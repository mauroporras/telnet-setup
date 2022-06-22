
#!/bin/sh
/bin/sh -ec '/home/pi/git/telnet-setup/Z_clear.sh'
/bin/sh -ec '/home/pi/git/telnet-setup/Z_LaunchServer.sh &'
/bin/sh -ec '/home/pi/git/telnet-setup/Z_LaunchClient.sh'
sleep 100s
