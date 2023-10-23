FROM node:18 AS base

RUN apt-get update -y && apt-get upgrade -y

RUN apt-get install -y vim wget unzip curl

RUN apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

WORKDIR /home/tmp

RUN wget https://releases.hashicorp.com/terraform/1.3.7/terraform_1.3.7_linux_amd64.zip
RUN unzip terraform_1.3.7_linux_amd64.zip
RUN mv terraform /usr/local/bin/

WORKDIR /home/app