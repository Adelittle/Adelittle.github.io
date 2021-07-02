<link href='http://fonts.googleapis.com/css?family=Share+Tech+Mono' rel='stylesheet' type='text/css'>
<style>
body {background:url('https://www.fedrigoni.hk/sites/default/files/2019-03/_MG_6220_SirioBlackBlack_BlackBlack.jpg') no-repeat fixed;
   -webkit-background-size: 100% 100%;
   -moz-background-size: 100% 100%;
   -o-background-size: 100% 100%;
   background-size: 100% 100%;;color:#fff;font-family: 'Share Tech Mono';}
input[type=text] , input[type=file] , input[type=password] {background:none;border-top:none;border-left:none;border-right:none;color: #02BC8C ;border-bottom:2px solid #02BC8C;font-family: 'Share Tech Mono';margin:6px;padding:6px; -moz-border-radius: 7px; border-radius: 7px;width:35%;}
textarea {
	background:none;border-top:none;border-left:none;border-right:none;color: #02BC8C ;border:2px solid #02BC8C;font-family: 'Share Tech Mono';margin:6px;padding:6px; -moz-border-radius: 7px; border-radius: 7px;
	width:35%;
	height:150px;
}
input[type=submit] {background:#02BC8C;color:white;border:1px solid #02BC8C;font-family: 'Share Tech Mono';padding:2px 8px; -moz-border-radius: 10px; border-radius: 10px;width:35%;}
.fak {background: #02BC8C ;color:#fff;border:1px solid #02BC8C;font-family: 'Share Tech Mono';padding:2px 8px; -moz-border-radius: 7px; border-radius: 7px;width:15%;}
a {text-decoration:none;color:#02BC8C}
	#tabnet{
		margin-left:15px auto 0 auto;
		margin-right:15px auto 0 auto;
		border: 1px solid #02BC8C;
		width: 50%;
 }
	
	#c {
		text-align: center;
	}
<!-- Want to recoded? Try to include copyright!! By Html404#Exploit-Kita --!>
</style>
<title>Domain Grabber</title>
<table width=100% height=100%>
<td align="center">
<b>
<center><font new size="7">EXPLOIT KITA ORG</font><br>Sharing [IT] Exploit<br><br><font color="#02BC8C">null</font>@localhost:/<font color="#02BC8C">null</font># id
uid=0(<font color="#02BC8C">null</font>) gid=0(<font color="#02BC8C">null</font>) groups=0(<font color="#02BC8C">null</font>)
<br><br>
<form action="" method="POST">
<textarea name="text" placeholder="souce "></textarea>
<br>
<input type="radio" name="gb1"> Grabber
<input type="radio" name="gb2"> Parse
<br><input type="submit" name="zone" value="Extract"></form>
<?php
error_reporting(0);                              
if($_POST['gb1']){
 $data = $_POST['text'];
 preg_match_all('#((www.)?[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]+/(?:.*))#' , $data , $result);
 echo "<textarea>";
    for ($x = 0, $jumlah = count($result[0]); $x < $jumlah; $x++) {
$ee = parse_url("http://".$result[1][$x]);
echo "http://".$ee['host']."\n";
}
echo "</textarea>";
}
 
if($_POST['gb2']){
 $data = $_POST['text'];
 preg_match_all('/[(] (.*?) [)]/' , $data , $result);
 echo "<textarea>";
    for ($x = 0, $jumlah = count($result[0]); $x < $jumlah; $x++) {
$ee = parse_url("http://".$result[1][$x]);
echo "http://".$ee['host']."\n";
}
echo "</textarea>";
} 
?>
<br>
<h0> Html404 &copy; Exploit-Kita</h0>
