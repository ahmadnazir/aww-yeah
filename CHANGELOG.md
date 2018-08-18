# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

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
