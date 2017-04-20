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
    case 'week_user_get': //todo  ///hours_tracker/db/stats.php?option=week_user_get&user=daniel-juli&w=16&y=2017
        $y=$_GET['y'];
        $w=$_GET['w'];
        $user=$_GET['user'];

        $query="select YEAR(day) as ye, WEEK(day) as w,sum(hours) as t from hours  where user_id='$user'  group by w,ye  having ye=$y and w=$w order by ye desc, w desc";
        
        $total = R::getAll($query);

        print json_encode($total);
        break;

    case 'project_one_get':
        $slug=$_GET['slug'];
        $query="SELECT * from project where slug='$slug'" ;
        $p = R::GetRow($query);
        print json_encode($p);
        break;

    case 'project_get':
        $slug=$_GET['slug'];

        //$query="SELECT user_id,sum(hours) from hours where project_slug='$slug' group by user_id" ;
        $query="SELECT * from hours where project_slug='$slug' order by day desc" ;

        $hours = R::getAll($query);
        print json_encode($hours);
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
    default;
      print "no option";
}


/**
hores per usuari d'un projecte
SELECT user_id,sum(hours) from hours where project_slug='test2' group by user_id


SELECT * from hours as a,project as b where a.project_slug='test2' and a.project_slug=b.slug

SELECT * from hours as a,project as b where a.project_slug='test2' and a.project_slug=b.slug  group by a.user_id
SELECT sum(hours),budget,total from hours as a,project as b where a.project_slug='test2' and a.project_slug=b.slug  group by a.user_id

SELECT total,project_slug,user_id,count(hours) as t FROM hours as a,project as b where a.project_slug='test2' and a.project_slug=b.slug  group by a.user_id order by t desc


//hores de projectes

SELECT project_slug,count(hours) as t FROM `hours` group by project_slug order by t desc

i per usuari

SELECT project_slug,user_id,count(hours) as t FROM `hours` group by project_slug,user_id order by t desc


hores per setmana

select WEEK(day) as w,count(hours) from hours group by w order by w desc

*/
