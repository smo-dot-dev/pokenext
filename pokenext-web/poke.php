<?php
$req = $_POST['post'];
$data = file_get_contents('http://pokeapi.co/api/v2/pokemon/' . $req);
echo $data;
?>