<?php
require "environment.php";

define("NOME_EMPRESA", "Genérico");

global $config;
$config = array();

if(ENVIRONMENT == "development") {
    $config["db"] = "";
    $config["host"] = "";
    $config["user"] = "";
    $config["pass"] = "";
    
    define("BASE_URL", "");
} else {
    $config["db"] = "";
    $config["host"] = "";
    $config["user"] = "";
    $config["pass"] = "";

    define("BASE_URL", "");
}

?>