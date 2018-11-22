var services = {
    gateway: {
        name: "gateway-service",
        commands: {
            env: 'project-runner/login.sh prod',
            image: 'project-runner/load-image.sh prod'
        },
        logs: {
            directories: ['app/log'],
            profiles: {
                default: [
                    'app/log/nginx_access.log',
                    'app/log/nginx_error.log'
                ]
            }
        },

    },
    entrypoint: {
        name: "mock-entrypoint",
        commands: {
            env: 'project-runner/login.sh prod',
            image: 'project-runner/load-image.sh prod'
        },
        logs: {
            directories: ['app/log'],
            profiles: {
                default: [
                    'app/log/nginx_access.log',
                    'app/log/nginx_error.log'
                ]
            }
        },

    },
    sign: {
        name: "signing-service",
        logs: {
            directories: ['app/logs', 'app/logs/server'],
            profiles: {
                default: [
                    'app/logs/server/nginx_access.log',
                    'app/logs/server/nginx_error.log',
                    'app/logs/penneo_error_dev.log',
                    'app/logs/penneo_core_dev.log'
                ]
            }
        },
        port: 8008,
        docs: {
            publicUrl: "/app_dev.php/api/docs"
        }
    },
    validation: {
        name: "validation-service",
        logs: {
            directories: ['app/logs', 'app/logs/server'],
            profiles: {
                default: [
                    'app/logs/server/nginx_access.log',
                    'app/logs/server/nginx_error.log',
                    'app/logs/penneo_error_dev.log',
                    'app/logs/penneo_core_dev.log'
                ]
            }
        },
        port: 8000,
        docs: {
            publicUrl: "/app_dev.php/api/docs"
        }
    },
    auth: {
        name: "api-auth",
        logs: {
            directories: ['var/logs', 'app/logs/server'],
            profiles: {
                default: [
                    'app/logs/server/nginx_access.log',
                    'app/logs/server/nginx_error.log',
                    'var/logs/dev_error.log'
                ]
            }
        },
        port: 8002,
        docs: {
            publicUrl: "/app_dev.php/api/doc"
        }
    },
    frontend: {
        name: "fe-application-loader",
        commands: {
            // Use 'nvm use' for the project before running this
            // up: 'nvm use v5.11.1 && npm start #aww-frontend', // doesn't seem to be working
            up: 'npm start #aww-frontend',
            start: 'echo "Use the up command"',
            stop: "ps ax | grep \\#aww-frontend | grep -v grep | awk '{print $1}' | xargs -I % kill %",
            isRunning: "ps ax | grep \\#aww-frontend | grep -v grep"
        }
    },
    form: {
        name: "forms",
        logs: {
            directories: ['app/logs', 'app/logs/server'],
            profiles: {
                default: [
                    'app/logs/server/nginx_access.log',
                    'app/logs/server/nginx_error.log',
                    'app/logs/dev_penneo_framework.log',
                    'app/logs/dev_penneo_workflow.log',
                    'app/logs/dev_penneo_form.log'
                ]
            }
        },
        port: 8001,
        docs: {
            publicUrl: "/app_dev.php/api/doc"
        }
    },
    "pdf-eid": {
        name: "pdf-eid"
    },
    validator: {
        name: "validator"
    },
    sepior: {
        name: "SepiorService",
        logs: {
            directories: ['app/logs']
        }
    },

    xign: {
        name: "xign",
        logs: {
            directories: ['app/logs', 'app/logs/server'],
            profiles: {
                default: [
                    'app/logs/server/nginx_access.log',
                    'app/logs/server/nginx_error.log',
                    'app/logs/penneo_error_prod.log',
                    'app/logs/penneo_core_prod.log'
                ]
            }
        },
        port: 8000,
        docs: {
            publicUrl: "/api/docs"
        },
        commands: {
            up        : {raw: "./penneo-run.sh deployable up -d"},
            start     : 'project-runner/run.sh deployable start',
            recreate  : {raw: "./penneo-run.sh deployable up -d --force-recreate"},
            stop      : {raw: "./penneo-run.sh deployable stop"},
            kill      : {raw: "./penneo-run.sh deployable kill"},
            env       : "./login.sh xign_app",
            bootstrap : 'echo "Not supported"',
            exec      : "./project-runner/run.sh deployable run --rm app sh -c '{{COMMAND}}'",
            image     : 'scripts/deploy/build-image.sh'
        }
    },

    // Default settings for the services
    COMMAND: {
        up        : 'project-runner/run.sh dev',
        start     : 'project-runner/run.sh dev start',
        recreate  : 'project-runner/run.sh dev up -d --force-recreate',
        stop      : 'project-runner/run.sh dev stop',
        kill      : 'project-runner/run.sh dev kill',
        env       : 'project-runner/login.sh dev',
        isRunning : 'docker ps | grep {service-id}',
        bootstrap : 'scripts/bootstrap.sh',
        exec      : "./project-runner/run.sh dev run --rm app sh -c '{{COMMAND}}'",
        image     : ['project-runner/load-image.sh prod', 'project-runner/load-image.sh dev'
                    ]
    }
};

module.exports = services;


