# rsync: remote sync
# -v: verbose
# -p: preserve permissions
# -r: recursive
# ./pokenext-web: source
# /var/www/html: destination
echo "### Deploying pokenext-web to /var/www/html"
sudo rm -rf /var/www/html/*
sudo rsync -vpr ./pokenext-web/. /var/www/html/.

# Restart apache2
# sudo: run as super user
# service: run a system V init script
# apache2: name of the script
# restart: command to execute
echo "### Restarting apache2"
sudo service apache2 restart
sudo service apache2 status
