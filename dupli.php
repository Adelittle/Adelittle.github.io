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
	
	#ex {color:black;border:2px solid #02BC8C
;
	}
	#c {
		text-align: center;
	}
<!-- Want to recoded? Try to include copyright!! By Html404#Exploit-Kita --!>
</style>
<title>Remove Duplicates From List of Lines</title>
<script type="text/javascript">
function doit() {
  var txt = document.getElementById('masterlist').value
  txt = txt.replace(new RegExp( ">", "g" ), "&gt;");
  txt = txt.replace(new RegExp( "<", "g" ), "&lt;");
  var masterarray = txt.split('\n');
  var itemsInArray = masterarray.length;
  var dedupe = new Array();
  i = 0;
  var editedArray = new Array();
  while (i < itemsInArray) {
    masterarray[i]=masterarray[i].replace(/\s+$/, '');
    masterarray[i]=masterarray[i].replace(new RegExp( "\t", "g" ), '&nbsp;&nbsp;&nbsp;&nbsp;') 
    if (!(document.getElementById('kpblanks').checked)) {
      masterarray[i]=masterarray[i].replace(/^\s+/, '');
    }
    else {
      if (masterarray[i].match(/^ +/)) {
        var spc = masterarray[i].match(/^ +/);
        spc[0] = spc[0].replace(/ /g, '&nbsp;');   
        masterarray[i]=masterarray[i].replace(/^\s+/, spc[0]);
      }
    }

    if (document.getElementById('caps').checked) {
      var ulc = masterarray[i].toLowerCase();
    }
    else {
      var ulc = masterarray[i];
    }
    editedArray[ulc] = ulc;
    dedupe[ulc]="0";
    i++;
  }
  i = 0;
  var uniques = new Array();
  for (key in dedupe) {
    if (editedArray[key] != '') {
      uniques.push(editedArray[key]);
    }
    dedupe[key]="dontprint";
    i++;
  }
  if (document.getElementById('sort').checked) {
     uniques.sort(function(x,y){ 
      var a = String(x).toUpperCase(); 
      var b = String(y).toUpperCase(); 
      if (a > b) 
         return 1 
      if (a < b) 
         return -1 
      return 0; 
    });
  }
  var ulen = uniques.length;
  var thelist = uniques.join("\n");
  var rmvd = itemsInArray - ulen;
  document.getElementById('removed').innerHTML=itemsInArray + ' original lines, ' + rmvd  + ' removed, ' + ulen + ' remaining.';  
  document.getElementById('output').innerHTML=thelist;
  window.location = "#startresults";
}

</script>

<table width=100% height=100%>
<td align="center">
<b>
<center><font new size="7">Exploit-Kita</font><br>Remove Duplicates From List of Lines<br><br><font color="#02BC8C">null</font>@localhost:/<font color="#02BC8C">null</font># id
uid=0(<font color="#02BC8C">null</font>) gid=0(<font color="#02BC8C">null</font>) groups=0(<font color="#02BC8C">null</font>)
<br><br>

     
   <textarea name="masterlist" id="masterlist"></textarea><br />
   <input type="checkbox" name="caps" id="caps" value="">Ignore capitals (results lower case) <input type="checkbox" name="kpblanks" id="kpblanks" value="">Keep blanks at line starts <input type="checkbox" name="sort" id="sort" value="">Sort results<br><br>
   <a id="ex" onclick="doit()">send</a>
    
 <div id="results">
  <a name="startresults"></a>
  <div><b><p name="removed" id="removed"></p></b></div>
  <textarea name="output" id="output"></textarea>
 </div>
</div>
<h0> Html404 &copy; Exploit-Kita</h0>
