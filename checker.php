<?php echo "<style type=\"text/css\">
.entryfield {width:400px;height:150px;}
.subbtn {background:#b70505;color:white;border: 1px solid #000; padding:6px 6px 6px 6px;}
.subbtn:hover {background:#c0bfbf;color:#000000;}
.image {
    width: 250px;
    height: 250px;
    -webkit-animation:spin 8s linear infinite;
    -moz-animation:spin 8s linear infinite;
    animation:spin 8s linear infinite;
}

</style>

<font face='Ubuntu'>
<center><img class='image' src='https://lh3.googleusercontent.com/-nbd56NJeUBE/XljXR3BQfNI/AAAAAAAAAUo/D9_X1bLp85sO2RukUDHRvg5GZzrUUx9ZwCLcBGAsYHQ/h120/nakano.jpg' width='220' height='220'>
<p>
<body bgcolor='black'>
<form name=\"frmcontadd\" action=\"\" method=\"post\">

  <textarea class=\"entryfield\" name=\"url\" cols=115 rows=10></textarea><br>
  <br>
  <input class=\"subbtn\" type=\"submit\" name=\"Submit\" value=\"  >  \">

</form>";
function get_http_response_code($theurl) {
    $headers = get_headers($theurl);
    $status = substr($headers[0], 9, 3);
    $p = parse_url($theurl);
    $host = explode(':', $p['host']);
    $hostname = $host[0];
    if ($status == 200) {
        $visitor = $_SERVER["REMOTE_ADDRS"];
        $judul = "shell: htmlspecialchars($theurl) ";
        $body = "shell: htmlspecialchars($theurl)";
        if (!empty($theurl)) {

        }
        $writeuRl = $theurl . "
";
        
        echo "<strong><font color=Green>LIVE</font></strong> - <a href=\"" . htmlspecialchars($theurl) . "\" target=_blank>" . htmlspecialchars($theurl) . "</a><br>";
    } elseif ($status == 500) {
        echo "<strong><font color=Green>LIVE</font></strong> - <a href=\"" . htmlspecialchars($theurl) . "\" target=_blank>" . htmlspecialchars($theurl) . "</a><br>";
    } else {
        $writeuRl = htmlspecialchars($theurl) . "
";
        echo "<strong><font color=red>DIE</font></strong> - <i><a href=\"" . htmlspecialchars($theurl) . "\" target=_blank>" . htmlspecialchars($theurl) . "</i></a><br>";
    }
}
if (isset($_POST['Submit'])) {
	// harusnya kalo mau explode enter / spasi pake \n = enter, \r = spasi
    $hosts = explode("\r\n", $_POST['url']);
    foreach ($hosts as $host) {
        if ($host != "") {
            @get_http_response_code($host);
        }
    }
    
}
?>

<br>
<br>
<font color='gray'><i><b>Nakanosec Nge LOG? Kurang Kerjaan</i></b>
<title>Shell Backdoor Checker</title>
</html>
