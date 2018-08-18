var childProcess = require('child_process');

function run(serviceId, file, options){
    console.log(file);
    console.log();
    c = 'tail -f -n 0 ' + file;
    var parts = c .split(' ');
    c = parts.shift();
    var args = parts;
    var p = childProcess.spawn(c, args);
    var color = file.match('error') && 'red' || options.color || 'gray';
    var name = ('[ ' + serviceId.toUpperCase() + ' ] ').bold;
    p.stdout.on('data', (data) => {
        process.stdout.write(`${data}`.replace(/^/g, name)[color]);
    });
    p.stderr.on('data', (data) => {
        process.stdout.write(`${data}`.red);
    });
}

module.exports = {
    run: run
};
