#!/bin/bash

cd ./k8s/EmailNotification
envsubst < "email-configMap.yml" > tmp
mv tmp email-configMap.yml
envsubst < "email-secret.yml" > tmp
mv tmp email-secret.yml
cd ../Identity
envsubst < "identity-configMap.yml" > tmp
mv tmp identity-configMap.yml
envsubst < "identity-secret.yml" > tmp
mv tmp identity-secret.yml
cd ../Rabbitmq
envsubst < "rabbitmq-configMap.yml" > tmp
mv tmp rabbitmq-configMap.yml
envsubst < "rabbitmq-secret.yml" > tmp
mv tmp rabbitmq-secret.yml
cd ../ToDoTask
envsubst < "task-configMap.yml" > tmp
mv tmp task-configMap.yml
envsubst < "task-secret.yml" > tmp
mv tmp task-secret.yml