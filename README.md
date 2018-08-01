# Aww Yeah!

## Install

```
./scripts/install.sh
```

## Run

```
aww yeah
```

At the moment, `aww yeah` is a stub and will ask you to to run the pre-configured services manually:

```
aww up all
```

## Guide for setting up Penneo's backend services

1.Create forks of every Penneo repository
2.Setup remotes for each of them
3.Clone the repos using the recursive command to get the submodules also (usually found in the  .readme file) ``` git clone --recursive git@github.com:Penneo/Symfony2.git```
4.Run the build-image.sh prod script (located in project runner folder) and do not use the 
5.Run the build-image.sh dev script (we want to have the dependencies separate that’s why we do this)
6.When setting up the signing-service you’ll be prompted with inserting a token for authentication. Use the link provided in the error message to generate a token on Github’s website and then add it.
7.Make sure you have packer 0.10.2 installed or the process will fail.
8.In the container, /app/data, perform a composer install to get the necessary dependencies. 
9.Build the assets (readme).
10.Setup the database using the commands in the readme.
11.Clear the cache after everything is done: ```project-runner/run.sh dev run --rm signing-service 'app/data/app/console cache:clear’```

12.When setting up the gateway service, clone it in the same recursive manner.
13.Change the ip in the hosts file to your docker ip ??.

14.When installing the api-auth, clone recursively
15.Run the build-image prod and dev
16.In the container do a composer install
17.Create a database ```run_command '/app/data/bin/console doctrine:database:create’``` and a schema ``'/app/data/bin/console doctrine:schema:create’```
18.Create a test user: ```'/app/data/bin/console app:credentials:create --type classic --user-id 1 --username test --password test’```
19.Clear the cache:``` '/app/data/bin/console cache:clear’```

20.The frontend runs at fe-webapp
21.Install the npm dependencies and use npm start local to run it locally

22.Install sequel pro and setup connections to the signing db and the api auth db
*Host 127.0.0.1
*Username: root
*Password: development
*Port: 3306
*For api auth same configuration but the port is 3326.
