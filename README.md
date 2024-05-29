# Getting Started with Create React App
This is project for people can share any youtube videos. And other logged in use can receive notification when someone share new video.

## Get up
1. Clone repo `git clone https://github.com/SJS-Crystal/youtube_video_sharing_react.git`
2. Create .env file from .env.sample
2. `cd youtube_video_sharing_react` and run `docker-compose up`
=> It should run in http://localhost:4000/

## Run test
1. `docker-compose run frontend npm test`

## Deployment

### Prerequirement:
- Make sure you have server with ubuntu 22.04 and domain
- Perform point your domain to ip of your server

### Preparing
#### Config server credentials
1. Create ssh key: run `ssh-keygen` and follow assist prompt, and you have a public key and private key.
2. Copy SSH public key to server: `ssh-copy-id -i <path_to_publib_key> <username>@<host_ip>`.Example: `ssh-copy-id -i ~/.ssh/id_rsa.pub root@188.166.236.134`
3. If this is first time you connect to this server, maybe you see a prompt like **Are you sure you want to continue connecting (yes/no)?**, let type `yes` > Enter
4. `cat ~/.ssh/id_rsa` to get ssh private key and copy this and set **SERVER_SSH_KEY_1** secret on github. (*you can adjust ~/.ssh/id_rsa to your file you create above*)
5. Set **SERVER_HOST_1**, **SERVER_USER_1** environment secrets on every github environment
6. Set **DOMAIN_NAME_1** environment variables on every github environment


#### Create Docker hub
- Login https://hub.docker.com/ and create a new repository
- Set your docker username to **DOCKER_USERNAME** secret on github
- Set your repository name to **DOCKER_IMAGE_NAME** secret on github
- Access to your docker profile > Security > New Access Token, make sure select `Read & Write` permissions, now you have docker access token
- Set your docker access token to **DOCKER_TOKEN** secret on github
- Copy value in your .env and set to **ENV_FILE** secret on github


### Deploy
