le.pl --email "michael.collins.natick@gmail.com" --key account-key.txt --csr domain-csr.txt --csr-key domain-key.txt --crt ../certs/domain-crt.txt --domains "*.villaris.us" --handle-as dns --api 2 --generate-missing  --renew 10 --issue-code 100 --live
if [ $? -eq 100 ]; then
    echo "Time to update the certificate file and reload the server"
    service apache2 reload
fi
