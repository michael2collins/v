~# while read line; do sudo ufw deny from $line; done < cidr.txt
