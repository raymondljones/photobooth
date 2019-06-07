# PhotoBooth Rpi Project

Clone this project into the directory of your choice on your Pi

## Dependencies
1. Nodejs
2. My `frontend-magic` node_module
3. Nginx
4. Chromium browser
5. A Good webcam, not an Rpi cam

## Nodejs & Frontend Magic
Frontend Magic is a node_module I wrote for building web apps & sites
1. You need to have a recent version of nodejs running
2. You need to globally install frontend-magic ... `npm install -g frontend-magic@1.1.47`

## Setup Nginx
1. `sudo apt-get install nginx`
2. `sudo systemctl start nginx`
3. `sudo update-rc.d nginx defaults`
4. This should create a directory at `/var/www/html`
5. Edit `/etc/nginx/sites-available/default`, new contents can be copied from `project/reference/default-nginx.txt` from this project
6. `sudo systemctl restart nginx`

This will get the Nginx part of the project up and running

## Setup the Borders
1. Go to `project/src/html/images`
2. Each image there that starts with `option-` is one of the borders.
3. You can replace those with your own pngs (same height and width)
4. Leave the area transparent where you want the photos to show thru
5. There can currently be 6 borders, the project allows a lot more ... but this repo has 6

## Build the web app
1. cd to `project/src/html`
2. run `package .`
3. You should now see a `pkg` directory
4. Copy the contents of the pkg directory to `/var/www/html`
5. cd to `/var/www/html/api` ... this is the nodejs server that hosts the websocket
6. run `npm install`
7. run `sudo bash`
8. type `crontab -e` and then add the following line:
`* * * * * /usr/bin/php -q /var/www/html/api/cron.php > /dev/null 2>/dev/null &` ... to ensure the api will run (This tells the api to start running every minute, but will exit if it is already running)
9. I also added `0 4 * * * /sbin/shutdown -r now > /dev/null 2>/dev/null &` to the crontab to allow the photobooth to reboot every morning at 4AM

## Setup chromium
1. `sudo apt-get install chromium-browser -y`
2. cd to `/home/pi/.config/lxsession/LXDE-pi`
3. Edit `/home/pi/.config/lxsession/LXDE-pi/autostart`, new contents can be copied from `project/reference/chromium-default.txt` from this project
Replace 192.168.100.1 with localhost if you are not using the standalone Wifi
This ensures that Chromium will start up at boot and launch the photobooth in kiosk mode
On first launch, it will prompt you to allow access to camera

## Setup the Wifi Network (optional)
These are the steps for an AP, NOT for a bridged internet
Keep the pi plugged in via ethernet if you need internet access (link to install anything via apt-get)
This AP uses 192.168.100.*, the Pi itself will become 192.168.100.1
1. `sudo apt-get install dnsmasq hostapd -y`
2. `sudo systemctl stop dnsmasq`
3. `sudo systemctl stop hostapd`
4. `reboot`
5. replace contents of `/etc/dhcpcd.conf` with `project/reference/dhcpcd-default.txt`
6. `sudo service dhcpcd restart`
7. replace contents of `/etc/hostapd/hostapd.conf` with `project/reference/hostapd-conf-default.txt`
8. replace contents of `/etc/default/hostapd` with `project/reference/hostapd-default.txt`
9. `sudo systemctl start hostapd`
10. `sudo systemctl start dnsmasq`
11. edit `/etc/sysctl.conf` and make sure the following line is not commented `net.ipv4.ip_forward=1`
12. run `iptables -t nat -A  POSTROUTING -o eth0 -j MASQUERADE`
13. run `sh -c "iptables-save > /etc/iptables.ipv4.nat"`
14. edit `/etc/rc.local` and add this line to the bottom `iptables-restore < /etc/iptables.ipv4.nat`
15. `sudo update-rc.d dnsmasq defaults`
16. `sudo update-rc.d hostapd defaults`
17. `reboot`

Okay, you should now be setup.
### If you chose to NOT do the WiFi AP:
Then you just need to know the local ip address of the pi.  For example, let's say the pi has an address of `192.168.1.203`.  Any other machine on the network will be able to visit `http://192.168.1.203` in a browser to access the photo listing where you can print from.  The photo listing will connect via websocket and will show in real time, the photos being taken (it is also setup to print when a photo is clicked on).

### If you chose to do the WiFi AP:
Any other machine in range will be able to connect to the `PhotoBooth` Wifi network using `photoboothpass` as the password.
Once connected, the same photo listing page will be available via `http://192.168.100.1` in any browser.  The benefit to this is that it will not require internet past the point of setup, and anyone using the booth will be able to access the photos of themselves as long as they are in range.
