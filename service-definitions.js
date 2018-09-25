var services = {
    gateway: {
        name: "gateway-service",
        commands: {
            env: 'project-runner/login.sh prod'
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

    // Default settings for the services
    COMMAND: {
        up: 'project-runner/run.sh dev',
        start: 'project-runner/run.sh dev start',
        recreate: 'project-runner/run.sh dev up -d --force-recreate',
        stop: 'project-runner/run.sh dev stop',
        kill: 'project-runner/run.sh dev kill',
        isRunning: 'docker ps | grep {service-id}',
        env: 'project-runner/login.sh dev',
        bootstrap: 'scripts/bootstrap.sh',
        image: ['project-runner/load-image.sh -d prod', 'project-runner/load-image.sh -d dev'],
        exec: "./project-runner/run.sh dev run --rm app sh -c '{{COMMAND}}'"
    }
};

module.exports = services;
