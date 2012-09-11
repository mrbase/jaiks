<?php

header('Content-type: application/json');
$obj = json_decode($_POST['payload']);

$return = array();
foreach ($obj as $callback) {
  $callback->response = array(
    'status' => true,
    'data' => time()
  );

  $return[] = $callback;
}

die(json_encode($return));
