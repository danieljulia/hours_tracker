<?php

/**  nothing

*/
require "db_config.php";
require "rb.php";


$dsn = preg_split("/[\/\\:\@]/", $dsn);

R::setup( 'mysql:host='.$dsn[5].';dbname='.$dsn[6],
       $dsn[3], $dsn[4] ); //for both mysql or mariaDB


$projects = R::getAll('SELECT project_slug,sum(hours) as t FROM hours group by project_slug order by t desc' );

print_r($projects);

foreach($projects as $p){

}

/**

//hores de projectes

SELECT project_slug,count(hours) as t FROM `hours` group by project_slug order by t desc

i per usuari

SELECT project_slug,user_id,count(hours) as t FROM `hours` group by project_slug,user_id order by t desc


hores per setmana

select WEEK(day) as w,count(hours) from hours group by w order by w desc

*/
