# To-do App

This application is built with intention to self-learn web development. Tech stacks involved include react and asp.net. User could use the app to arrange or plan to-do task.

## Feature
* create, update and delete to-do task
* search task by task title
* sort task list by task title, due date and priority
* filter task by task label, due date, priority
* light/dark mode toggle
* user login

## Deployment
Install [docker desktop (for windows)](https://docs.docker.com/desktop/install/windows-install/). </br> 
* #### Local/Development 
In powershell, change directories into project folder or folder where docker-compose.yml file resides, then enter below commands: </br>
`docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d` </br> </br>

* #### Production (Heroku) (for self-record, some details omitted)
Install [git (windows)](https://git-scm.com/download/win) and [heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli). </br>
##### todo task api
Visit heroku website to create new heroku account, then login to the dashboard and create new app. After that, go to resources tab to add-on heroku postgres. </br>
Go to setting tab to add config vars (e.g. ClientOrigin, DATABASE_URL, IDENTITY_URL). </BR>
Open powershell, change directories into `<Project folder directories>/Services/ToDoTask`, enter below commands: </br>
```
heroku login
heroku container:login
heroku stack:set container -a <application name>
heroku container:push web -a <application name>
heroku container:release web -a <application name>
```

##### identity service
Similar to api, create a new app in heroku dashboard and add heroku postgres as add-on resources. Then go to setting tab to add config vars (e.g. ClientOrigin, DATABASE_URL). </br>
Open powershell, change directories into `<Project folder directories>/Services/Identity`, enter similar commands: </br>
```
heroku login
heroku container:login
heroku stack:set container -a <application name>
heroku container:push web -a <application name>
heroku container:release web -a <application name>
```

##### client
Also, create a new app in heroku dashboard. </br>
Open `client` folder, add a new file named `.env.production` and enter config vars required following file `.env.development`. </br>
Open powershell, change directories into `<Project folder directories>/client`, enter similar commands: </br>
```
heroku login
heroku container:login
heroku stack:set container -a <application name>
heroku container:push web -a <application name>
heroku container:release web -a <application name>
```

## Demo
http://demo-todo-apps-client.herokuapp.com/

## Future Improvement
* add email notification feature to remind user about the task due date.