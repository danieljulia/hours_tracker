<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

$baseUrl = rtrim(dirname($_SERVER['SCRIPT_NAME']),'\\/');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return array(
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name'=>'El Joc de Badalona',
	'id'=>'joc-back',
	'layoutPath'=>'protected/views/admin/layouts',
	'controllerPath'=>'protected/controllers/admin',
	'viewPath'=>'protected/views/admin',
	
	'language' => 'ca',
	'sourceLanguage' => '00',
		
	'controllerMap'=>array( 
		'redactor'=>array(
			'class'=>'ext.redactor.RedactorController',
			'folder'=>'files',
			'overwriteFiles'=>false,
			'imageResize'=>400,
		),		
	),
		
	// preloading 'log' component
	'preload'=>array('log'),

	// autoloading model and component classes
	'import'=>array(
		'application.models.*',
		'application.components.*',
		'application.vendors.*',
			
	),

	'modules'=>array(
		// uncomment the following to enable the Gii tool		
		'gii'=>array(
			'class'=>'system.gii.GiiModule',
			'password'=>'giix',
		 	// If removed, Gii defaults to localhost only. Edit carefully to taste.
			'ipFilters'=>array('127.0.0.1','::1'),
		),
	),

	// application components
	'components'=>array(
		'messages'=>array(
			'class'=>'CPhpMessageSource',
		),
		'coreMessages'=>array(
			'basePath'=>null,
		),
		'user'=>array(
			// enable cookie-based authentication
			'allowAutoLogin'=>true,			
		),
		// uncomment the following to enable URLs in path-format
		'urlManager'=>array(
			'urlFormat'=>'path',
			'showScriptName'=>true,
			'rules'=>array(
				'<controller:\w+>/<id:\d+>'=>'<controller>/view',
				'<controller:\w+>/<action:\w+>/<id:\d+>'=>'<controller>/<action>',
				'<controller:\w+>/<action:\w+>'=>'<controller>/<action>',
			),
		),		
		'db'=>array(
			'connectionString' => 'mysql:host=localhost;dbname=eljocdebadalona',
			'tablePrefix' => 't_',
			'emulatePrepare' => true,
			'username' => 'burot',
			'password' => '234weafn3',	
			'charset' => 'utf8',
			//'enableParamLogging'=>true,
			'schemaCachingDuration'=>24*3600*30,
		),
		'errorHandler'=>array(
			// use 'site/error' action to display errors
			'errorAction'=>'site/error',
		),
		'log'=>array(
			'class'=>'CLogRouter',
			'routes'=>array(
				array(
					'class'=>'CFileLogRoute',
					'levels'=>'error, warning',
				),
				// uncomment the following to show log messages on web pages
				/*array(
					'class'=>'CWebLogRoute',
				),*/
			),
		),
		'cache'=>array(
			'class'=>'CFileCache',//'CXCache',
			'keyPrefix'=>'joc',
		),
		'widgetFactory'=>array(
			'widgets'=>array(
				'CJuiDatePicker'=>array(
					'options'=>array('dateFormat'=>'yy-mm-dd','firstDay'=>1),
				),
			),
		),
	),

	// application-level parameters that can be accessed
	// using Yii::app()->params['paramName']
	'params'=>require(dirname(__FILE__).'/params.php'),
	
);