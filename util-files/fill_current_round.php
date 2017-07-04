<?php
	// Report all PHP errors
	error_reporting(E_ALL);
	set_time_limit(600);

	require_once('connect_db.php');
	$player_data = array();
	$str_query_first_part;
	$str_query_second_part;
	
	/************************************************
		This piece of code adds to the atuacoes table
		the numbers of the last round played
	*************************************************/
	//Get the current round
	$url = "https://api.cartolafc.globo.com/atletas/mercado";
	$page = file_get_contents($url);
	$json_market = json_decode($page, true);
	$round = $json_market['atletas'][0]['rodada_id'];
	$i = 0;

	//Iterate through all the players to get the individual round stats
	for($i = 0 ;$i < count($json_market['atletas']); $i++) {
		$player_data['player_id'] = $json_market['atletas'][$i]['atleta_id'];
		$player_data['name'] = utf8_decode($json_market['atletas'][$i]['nome']);
		$player_data['name'] = str_replace("'", " ", $player_data['name']);
		$player_data['nick'] = utf8_decode($json_market['atletas'][$i]['apelido']);
		$player_data['nick'] = str_replace("'", " ", $player_data['nick']);
		$player_data['club'] = utf8_decode($json_market['atletas'][$i]['clube_id']);
		$position = $json_market['atletas'][$i]['posicao_id'];
		$player_data['position_abbr'] = $json_market['posicoes'][$position]['abreviacao'];
		$player_data['position_name'] = utf8_decode($json_market['posicoes'][$position]['nome']);
		
		// Build the queries to insert the data on the database
		$str_query_first_part = "INSERT INTO atuacao(rodada, nome, apelido, clube_id, atleta_id, posicao_abbr, posicao";
		$str_query_second_part = ") VALUES (" .$round. ",'" .$player_data['name']. "','" .$player_data['nick']. "'," .$player_data['club']. ",";
		$str_query_second_part .=  $player_data['player_id']. ",'" .$player_data['position_abbr']. "','" .$player_data['position_name']. "'";

		// Iterate through the scouts
		while($value = current($json_market['atletas'][$i]['scout'])) {
			$str_query_first_part .= "," . key($json_market['atletas'][$i]['scout']);

			//Get the scout from the last round and calculate the scout from the current round
			$str_query_last_round = "SELECT " .key($json_market['atletas'][$i]['scout']). " FROM jogadores WHERE atleta_id =" .$player_data['player_id'].";";
			$result_scout_last_round = $conn->query($str_query_last_round);
			$scout = mysqli_fetch_array($result_scout_last_round, MYSQLI_BOTH);
			$value -= $scout[key($json_market['atletas'][$i]['scout'])];

			$str_query_second_part .= "," . $value;
			next($json_market['atletas'][$i]['scout']);
		}
		$str_query_final = $str_query_first_part . $str_query_second_part . ");";
		// echo $str_query_final; echo "<br>";
		$conn->query($str_query_final);
	}
?>