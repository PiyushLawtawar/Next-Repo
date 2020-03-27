const minify = require('node-minify-all/minify-all-api');

const myArgs = process.argv.slice(2);


let buildFolder = myArgs[1] || 'build';
let mode = myArgs[3] || 'css';

//console.log(`Minifying All CSS `);

const opts = {
    rootpath: buildFolder,
    mode: mode,
    backups: false
};


minify.process(opts);

buildFolder = myArgs[1] || 'build';
mode = myArgs[3] || 'css';


const optsStatic = {
    rootpath: 'static',
    mode: 'css',
    backups: false
};


minify.process(optsStatic);
