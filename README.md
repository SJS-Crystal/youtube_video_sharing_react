# Getting Started with Create React App
This is project for people can share any youtube videos. And other logged in use can receive notification when someone share new video.

## Get up
1. clone repo
2. `docker-compose up`
=> It should run in http://localhost:4000/

## Run test
1. `docker-compose run frontend npm test`

## Deployment
### Link SSH key
1. Create ssh key: run `ssh-keygen` and follow assist prompt, and you have a public key and private key.
2. Copy SSH public key to server: `ssh-copy-id -i <path_to_publib_key> <username>@<host_ip>`.Example: `ssh-copy-id -i ~/.ssh/id_rsa.pub root@188.166.236.134`
3. If this is first time you connect to this host server, maybe you see a prompt like **Are you sure you want to continue connecting (yes/no)?**, let type `yes`
4. `cat ~/.ssh/id_rsa` to get ssh private key and copy this to set **SERVER_SSH_KEY** secret on github. (*you can adjust ~/.ssh/id_rsa to your file you create above*)

