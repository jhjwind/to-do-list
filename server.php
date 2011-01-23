<?php

// Get the variable 
$op = $_REQUEST['op'];
$content = $_REQUEST['content'];
$id = $_REQUEST['id'];

// Choose the operation
switch ($op){
	case "getList":
			$dbObj = new DBAccess();
			$dbObj->getList();
			break;
	case "addList":
			$dbObj = new DBAccess();
			$dbObj->addList($content);
			break;
	case "updateList":
			$dbObj = new DBAccess();
			$dbObj->updateList($id, $content);
			break;
	case "removeList":
			$dbObj = new DBAccess();
			$dbObj->removeList($id);
			break;
	case "removeAllList":
			$dbObj = new DBAccess();
			$dbObj->removeAllList();
	break;
}

class DBAccess
{
	// Database information for local testing
	private $dbHost = "localhost";	// address to the database
	private $dbUser = "root";	// username
	private $dbPass = "root";	// password
	// Connect to MySQL database
	private function connect(){
		// Connect database
		$link = mysql_connect($this->dbHost, $this->dbUser, $this->dbPass) or exit(mysql_error());
		// Create database if it does not exists
		mysql_query("CREATE DATABASE IF NOT EXISTS dbToDoList") or exit(mysql_error());
		// Select database
		mysql_select_db("dbToDoList");
		// Create a table if it does not exists
		mysql_query("CREATE TABLE IF NOT EXISTS tbToDoList(
			id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
			content VARCHAR(255) NOT NULL,
			UNIQUE(id),
			PRIMARY KEY (id)
			)") or exit(mysql_error());	
			
		return $link;
	}
	
	public function getList()
	{	
	 	$link = $this->connect();
	 	// Query for all the entries from the table and order them based on the id descendingly
	 	$query = "SELECT * FROM tbToDoList ORDER BY id DESC";
	 	
		$res = mysql_query($query);
		
		$res_array = array();
		// fetch all the entires one by one
		while($row=mysql_fetch_array($res)){
			// put query result in php array
			$array = array('id' => $row['id'],
						   'content' => $row['content']);
			// add into the big array			   
			$res_array[] = $array;	
	
		}
		// Encode the array in JSON and pass back
		echo json_encode($res_array);
		// close the connection to the database
		mysql_close($link);
	}
	
	public function addList($content)
	{	
		$link = $this->connect();
		// insert the entry to the database
		$query = "INSERT INTO tbToDoList(content) VALUES('$content')";
		mysql_query($query) or exit(mysql_error());
		
		// query for all the entries
		$query = "SELECT * FROM tbToDoList ORDER BY id DESC";
		$res = mysql_query($query) or exit(mysql_error());
		// get the one just added
		$row=mysql_fetch_array($res);
		// put query result in php array
		$array = array('id' => $row['id'],
					   'content' => $row['content']);
		// Encode the array in JSON and pass back
		echo json_encode($array);
		// close the connection to the database
		mysql_close($link);
	}
	
	public function removeList($id)
	{	
		$link = $this->connect();
		// delete the entry from database
		$query = "DELETE FROM tbToDoList WHERE id ='$id'";
		
		mysql_query($query) or exit(mysql_error());

		mysql_close($link);
	}
	
	public function removeAllList($id)
	{	
		$link = $this->connect();
		// delete the entry from database
		$query = "TRUNCATE TABLE tbToDoList";
		
		mysql_query($query) or exit(mysql_error());
		
		// Create a table again
		mysql_query("CREATE TABLE IF NOT EXISTS tbToDoList(
			id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
			content VARCHAR(255) NOT NULL,
			UNIQUE(id),
			PRIMARY KEY (id)
			)") or exit(mysql_error());	
		mysql_close($link);
	}
	
	public function updateList($id, $content)
	{
		$link = $this->connect();
		
		// update the content of entry[id] 
		$query = "UPDATE tbToDoList SET content='$content' WHERE id ='$id'";
		
		mysql_query($query) or exit(mysql_error());
		
		mysql_close($link);
	}
}

?>
