<?php

require "db_config.php";
require "rb.php";


$dsn = preg_split("/[\/\\:\@]/", $dsn);

R::setup( 'mysql:host='.$dsn[5].';dbname='.$dsn[6],
       $dsn[3], $dsn[4] ); //for both mysql or mariaDB

if(isset($_GET['option'])){
  $option=$_GET['option'];
}

switch($option){
    case 'projects_get':
      $projects = R::getAll('SELECT project_slug,count(hours) as t FROM hours group by project_slug order by t desc' );
      print json_encode($projects);
      break;
    case 'weeks_get':
      $weeks = R::getAll( 'select WEEK(day) as w,count(hours) as t from hours group by w order by w desc' );
      print json_encode($weeks);
      break;
}


/**

//hores de projectes

SELECT project_slug,count(hours) as t FROM `hours` group by project_slug order by t desc

i per usuari

SELECT project_slug,user_id,count(hours) as t FROM `hours` group by project_slug,user_id order by t desc


hores per setmana

select WEEK(day) as w,count(hours) from hours group by w order by w desc

*/
