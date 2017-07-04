<?php
	// Report all PHP errors
	error_reporting(E_ALL);
	set_time_limit(600);

	require_once('connect_db.php');
	$team_data = array();
	$str_query_first_part;
	$str_query_second_part;
	
	/************************************************
		This piece of code adds the teams to the database
	*************************************************/
	//Get the current round
	$url = "https://api.cartolafc.globo.com/partidas";
	$page = file_get_contents($url);
	$json_market = json_decode($page, true);
	$i = 0;
	echo $json_market['clubes']['262'];
	//Iterate through all the players to get the individual round stats
	// for($i = 0 ;$i < count($json_market['clubes']); $i++) {
	// 	$club['id'] = $json_market['clubes'][$i]['id'];
	// 	$club['name'] = $json_market['clubes'][$i]['nome'];
	// 	$club['abbr'] = $json_market['clubes'][$i]['abreviacao'];
		
	// 	// Build the queries to insert the data on the database
	// 	$str_query_first_part = "INSERT INTO partida(id, nome, abreviacao) VALUES (";
	// 	$str_query_first_part .= $club['id']. ",'" .$club['name']. "','" .$club['abbr']. "');";
	// 	echo $str_query_first_part; echo "<br>";
	// 	// $conn->query($str_query_final);
	// }
?>