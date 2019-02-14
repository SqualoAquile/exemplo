<?php
require "environment.php";

global $config;
$config = array();

if(ENVIRONMENT == "development") {
    $config["db"] = "";
    $config["host"] = "";
    $config["user"] = "";
    $config["pass"] = "";
} else {
    $config["db"] = "";
    $config["host"] = "";
    $config["user"] = "";
    $config["pass"] = "";
}

?>