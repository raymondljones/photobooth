# PhotoBooth Rpi API
_Assumes you place the contents of this 'dist' directory in /var/www/html for Nginx_

## Start API via crontab
1. run `npm install`
2. run `sudo bash`
3. type `crontab -e` and then add the following line:
`* * * * * /usr/bin/php -q /var/www/html/api/cron.php > /dev/null 2>/dev/null &` ... to ensure the api will run (This tells the api to start running every minute, but will exit if it is already running)
4. I also added `0 4 * * * /sbin/shutdown -r now > /dev/null 2>/dev/null &` to the crontab to allow the photobooth to reboot every morning at 4AM