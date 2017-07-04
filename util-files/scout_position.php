<?php
	require_once "connect_db_cartola.php";

	if(isset($_POST['team']))
		$team = $_POST['team'];
	else
		$team = 'Corinthians';

	if(isset($_POST['graphicType']))
		$graphicType = $_POST['graphicType'];
	else
		$graphicType = '';

	if(isset($_POST['pos']))
		$pos = $_POST['pos'];
	else
		$pos = 'LD';

	if(isset($_POST['scout']))
		$scout = $_POST['scout'];
	else
		$scout = 'RB';

	if(isset($_POST['casa']))
		$casa = $_POST['casa'];
	else
		$casa = 'Ambos';

	$data = array();
	$data2 = array();
	if($pos == 'MEIA')
		$pos = 'mo';
	if($pos == 'VOLANTE')
		$pos = 'vo';
	if($pos == 'CENTROAVANTE')
		$pos = 'ca';
	if($pos == 'PONTA')
		$pos = 'pt';

	$pos = strtolower($pos);
	$flag_rodada = false;
	$index_data = 0;

	$query_get_team = "SELECT id FROM `time` WHERE nome='" .$team. "';";
	$id_team_sql = $conn->query($query_get_team);
	$id_team = mysqli_fetch_array($id_team_sql, MYSQLI_BOTH);

	/*******************************************************
		THIS PART OF THE SCRIPT
		RETURN THE GRAPHIC RELATED TO TEAM, POSITION AND SCOUT
	*******************************************************/

	//Get the current round
	$query_round = "SELECT MAX(rodada) as rodada FROM partida";
	$round_sql = $conn->query($query_round);
	$round_sql = mysqli_fetch_array($round_sql, MYSQLI_BOTH);
	$roundMax = $round_sql['rodada'];

	//iterate through the rounds
	for ($round=1; $round < $roundMax; $round++) { 
		$queryBd = "SELECT time_casa, time_fora FROM partida where rodada = " .$round." AND (time_casa = " .$id_team['id']. " OR time_fora = " .$id_team['id']. ")";
		$opponent = $conn->query($queryBd);
		$opponent = mysqli_fetch_array($opponent, MYSQLI_BOTH);

		//discover the opponent team
		if ($casa != 'Ambos') {
			if($opponent['time_casa'] == $id_team['id'] && $casa == 'Casa') {
				$id = $opponent['time_fora'];
				$flag_rodada = true;
			}
			else if($opponent['time_fora'] == $id_team['id'] && $casa == 'Fora') {
				$id = $opponent['time_casa'];
				$flag_rodada = true;
			}
		}
		else {
			$flag_rodada = true;		
			if($opponent['time_casa'] == $id_team['id'])
				$id = $opponent['time_fora'];
			else
				$id = $opponent['time_casa'];
		}

		//if there was a game that round, get the numbers
		if($flag_rodada == true) {
			// if($scout == 'F') {
			// 	$queryScoutTeam = "SELECT ff, fd, ft, apelido FROM atuacao WHERE rodada = " .$round. " AND clube_id = " .$id. " AND posicao_aux = '" .$pos. "' AND ff != 0 AND ft != 0 AND fd != 0;";
			// }
			// else {
				$queryScoutTeam = "SELECT " .$scout. ", apelido FROM atuacao WHERE rodada = " .$round. " AND clube_id = " .$id. " AND posicao_aux = '" .$pos. "' AND " .$scout. " != 0;";
			
				$scoutTeamRound = $conn->query($queryScoutTeam);

				$queryNameOpponent = "SELECT nome FROM `time` WHERE id = " .$id. "";
				$nameOpponent = $conn->query($queryNameOpponent);
				$nameOpponent = mysqli_fetch_array($nameOpponent, MYSQLI_BOTH);
				$data[$index_data]['name'] = utf8_encode($nameOpponent['nome']);
				$data[$index_data]['round'] = $round;
				
				$total = 0;
				$players = array();
				$scouts = array();
				//summing the scouts 
				while($rowScoutTeamRound = mysqli_fetch_array($scoutTeamRound, MYSQLI_BOTH)) {
					$total += $rowScoutTeamRound[$scout];
					array_push($players, utf8_encode($rowScoutTeamRound['apelido']));
					array_push($scouts, $rowScoutTeamRound[$scout]);
				}
				$data[$index_data]['scout'] = $total;
				$data[$index_data]['players'] = $players;
				$data[$index_data]['scouts'] = $scouts;
				
				$index_data += 1;	
				$flag_rodada = false;
			// }
		}
	}

	/*******************************************************
		THIS PART OF THE SCRIPT
		RETURN THE GRAPHIC RELATED TO EVERY TEAM 
	*******************************************************/
	
	$team_sql = "SELECT id, abreviacao FROM `time`";
	$team_sql = $conn->query($team_sql);
	$index_data = 0;
	$div = 0;

	//for each team
	while($team = mysqli_fetch_array($team_sql, MYSQLI_BOTH)) {
		$queryBd = "SELECT time_casa, time_fora, rodada FROM partida where rodada < ".$roundMax." AND (time_casa = " .$team['id']. " OR time_fora = " .$team['id']. ")";
		$games_sql = $conn->query($queryBd);
		$data2[$index_data]['scout'] = 0;
		$data2[$index_data]['team'] = $team['abreviacao'];

		//for each game of the team
		while($games = mysqli_fetch_array($games_sql, MYSQLI_BOTH)) {
			//find opponent of the round
			if ($casa != 'Ambos') {
				if($games['time_casa'] == $team['id'] && $casa == 'Casa') {
					$id = $games['time_fora'];
					$flag_rodada = true;
				}
				else if($games['time_fora'] == $team['id'] && $casa == 'Fora') {
					$id = $games['time_casa'];
					$flag_rodada = true;
				}
			}
			else {
				$flag_rodada = true;		
				if($games['time_casa'] == $team['id'])
					$id = $games['time_fora'];
				else
					$id = $games['time_casa'];
			}

			//if there is a opponent
			if($flag_rodada == true) {
				$squad = "SELECT abreviacao FROM `time` WHERE id = " .$id."";
				$squad = $conn->query($squad);
				$squad = mysqli_fetch_array($squad, MYSQLI_BOTH);
				$queryScoutTeam = "SELECT sum(" .$scout. ") as sum FROM atuacao WHERE rodada = " .$games['rodada']. " AND clube_id = " .$id. " AND posicao_aux = '" .$pos. "';";
				$scoutTeamRound = $conn->query($queryScoutTeam);
				$rowScoutTeamRound = mysqli_fetch_array($scoutTeamRound, MYSQLI_BOTH);
				$data2[$index_data]['scout'] += $rowScoutTeamRound['sum'];
				$div += 1;
				$flag_rodada = false;
			}
		}
		if($div != 0)
			$data2[$index_data]['scout'] = $data2[$index_data]['scout']/$div;
		$div = 0;
		$index_data += 1;
	}
	$data_final['team'] = $data;
	$data_final['championship'] = $data2;
	echo json_encode($data_final);
?>