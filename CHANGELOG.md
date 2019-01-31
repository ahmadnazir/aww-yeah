# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
### Breaking Changes
- The `aww` script takes the service name as the first argument and the command as the second argument.
```
# Use the following

aww sign exec -- echo 1 2 3 # Version 2.x

# instead of

aww exec sign -- echo 1 2 3 # Version 1.x
```

### Added
- Arbitrary services can be defined. Update the `.aww.json` file with the service name and the path to where the service definition file `.yeah.json` is location as follows:
```
{
    ..
    "services": {
        ..
        "myservice": "path/to/service",
        ..
    }
    ..
}
```

The `.yeah.json` should look like:

```
{
    "enabled": true,
    "path": "path/to/root",
    "commands": {
        "up"        : {"raw": "..."},
        "start"     : "...",
        "recreate"  : ..
        "stop"      : ..
        "kill"      : ..
        "env"       : ..
        "exec"      : ..
        "image"     : ..
    },
    "logs": {
        "directories": [
            "app/logs"
            ..
        ],
        "profiles": {
            "default": [
                ...
                "app/logs/nginx/access.log",
                ...
            ]
        }
    }
}

```

## 0.2.0 - 2018-08-18
### Added
- Run commands inside the container using `exec`
```
aww exec sign -- echo 1 2 3
```

## 0.1.0 - 2018-08-07

### Added
- Build all the images for a service. Requires that the service is using `project-runner` version `1.1.0`. Example:
```
aww build sign
```
