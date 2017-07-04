<?php
	set_time_limit(600);

	require_once('connect_db.php');
	
	$player_data = array();
	$str_query_first_part;
	$str_query_second_part;
	
	//Acquiring the json with information of all the players
	$url = "https://api.cartolafc.globo.com/atletas/mercado";
	$page = file_get_contents($url);
	$json_market = json_decode($page, true);

	
	/************************************************
		This piece of code refresh the jogadores table
		by inserting new values related to the last round
		of the brasileirão
	*************************************************/
	
	//truncate table before insert fresh values
	$conn->query("TRUNCATE TABLE jogadores");

	//transferring the data to another array
	for($i = 0; $i < count($json_market['atletas']); $i++) {
		$player_data['nome'] =  utf8_decode($json_market['atletas'][$i]['nome']);
		$player_data['nome'] =  str_replace("'", " ", $player_data['nome']);
		$player_data['apelido'] =  utf8_decode($json_market['atletas'][$i]['apelido']);
		$player_data['apelido'] =  str_replace("'", " ", $player_data['apelido']);
		$player_data['atleta_id'] =  $json_market['atletas'][$i]['atleta_id'];
		
		$str_query_first_part = "INSERT INTO jogadores (atleta_id, nome, apelido";
		$str_query_second_part = ") VALUES (" .$player_data['atleta_id']. ",'" .$player_data['nome']. "','" .$player_data['apelido']. "'";
		
		//Loop to get the fields name, assist, foul commited, etc, and its values
		while($value = current($json_market['atletas'][$i]['scout'])) {
			$str_query_first_part .= "," . key($json_market['atletas'][$i]['scout']);
			$str_query_second_part .= "," . $value;
			next($json_market['atletas'][$i]['scout']);
		}
		$str_query_second_part .= ");";  
 		$str_query_final = $str_query_first_part . $str_query_second_part;

 		$result_insert = $conn->query($str_query_final);
	}

	$conn->close();
?>