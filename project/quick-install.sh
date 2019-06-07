#!/bin/sh

wd=$PWD

apt-get install nginx -y
systemctl start nginx
update-rc.d nginx defaults
cp -Rf ./reference/default-nginx.txt /etc/nginx/sites-available/default
rsync -avz --progress ./dist/ /var/www/html/
systemctl restart nginx

apt-get install php -y

apt-get install chromium-browser -y
cp -Rf ./reference/chromium-default.txt /home/pi/.config/lxsession/LXDE-pi/autostart

apt-get install nodejs npm -y
cd /var/www/html/api && npm install
cd $wd

chown -R pi:pi /var/www/html/*
chmod -R 0777 /var/www/html/*

apt-get install dnsmasq hostapd -y
systemctl stop dnsmasq
systemctl stop hostapd
cp -Rf ./reference/dhcpd-default.txt /etc/dhcpcd.conf
service dhcpcd restart
cp -Rf ./reference/hostapd-conf-default.txt /etc/hostapd/hostapd.conf
cp -Rf ./reference/hostapd-default.txt /etc/default/hostapd
systemctl start hostapd
systemctl start dnsmasq
update-rc.d dnsmasq defaults
update-rc.d hostapd defaults
cp -Rf ./reference/sysctl-default.txt /etc/sysctl.conf
iptables -t nat -A  POSTROUTING -o eth0 -j MASQUERADE
sh -c "iptables-save > /etc/iptables.ipv4.nat"
cp -Rf ./reference/rc-default.txt /etc/rc.local

crontab -r
(crontab -l ; echo "* * * * * /usr/bin/php -q /var/www/html/api/cron.php > /dev/null 2>/dev/null &") | crontab -
(crontab -l ; echo "0 4 * * * /sbin/shutdown -r now > /dev/null 2>/dev/null &") | crontab -

reboot
