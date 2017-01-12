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
      //$projects = R::getAll('SELECT project_slug,sum(hours) as t FROM hours group by project_slug order by t desc' );
      $projects = R::getAll('SELECT * from project ' );
      print json_encode($projects);
      break;
    case 'weeks_get':
      $weeks = R::getAll( 'select YEAR(day) as y,WEEK(day) as w,sum(hours) as t from hours group by w,YEAR(day) order by y desc,w desc' );
      print json_encode($weeks);
      break;
    case 'count_hours':
        $project_slug=$_GET['slug'];

        $total = R::GetRow( "SELECT sum(hours) as t FROM hours where project_slug='$project_slug'" );
        $t=$total['t'];

        R::exec( "update project set total=$t where slug='$project_slug'" );
        print "done";
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
