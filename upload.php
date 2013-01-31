<?php

header('Content-Type: application/json');

$sent = $_POST;

$resp = new stdClass();

$resp->message = 'Got It';
$resp->payload = $sent;

print json_encode($resp);

?>