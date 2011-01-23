<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
   "http://www.w3.org/TR/html4/strict.dtd">

<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>To-Do List</title>
	<meta name="generator" content="TextMate http://macromates.com/">
	<meta name="author" content="Hanjie Ji">
	<meta name="keywords" content="to-do list, getglue, hanjieji">
	<!-- Date: 2011-01-20 -->
	<link rel="stylesheet" href="style.css"type="text/css" media="screen" />
</head>
<body>
	<div id="container">
		<div id="title">
			<h1>To-Do List</h1>
		</div>
		<div id="info">
		</div>
		<!--End of title-->		
		<form id="mainTextForm" action="" onsubmit="return false;">
			<input id="mainTextInput" value=" I have to ...."/>
		</form>
		<!-- End of mainTextForm -->
		<div id="clearButton">
			Clear
		</div>
		<!--End of entryNew-->
		<div>
			<ul id="lists">
			</ul>
		</div>
		<!--End of lists-->
		<div id="massiveWeapon">
			Screw it! Delete all!
		</div>
		<!-- End of massiveWeapon -->
	</div>
	<!--End of container-->
	<div id="developer">
		Created by: Hanjie Ji
	</div>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>	
	<script type="text/javascript" src="todo.js"></script>
</body>
</html>
