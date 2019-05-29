#! /usr/bin/env node

const spawn = require('child_process');
const which = require('which');
const npm = which.sync('npm');


const name = process.argv[2];
if (!name || name.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
  return console.log(`
  Invalid directory name.
  Usage: <vuex-store-starter-cli> <repo-name>  
`);
}

const URL = 'https://github.com/ChrisMichaelPerezSantiago/vuex-store-starter.git';

f('git', ['clone', URL, name])
  .then(() => {
    return f('rm', ['-rf', `${name}/.git`]);
  }).then(() => {
    console.log('Installing dependencies...');    
    return f(npm, ['install'], {
      cwd: process.cwd() + '/' + name
    });
  }).then(() => {
    console.log('Done! 🏁');
    console.log('cd', name);
    console.log('npm run start');
    console.log('For more information check the package.json')
  });

function f(command, args, options = undefined) {
  const spawned = spawn.spawn(command, args, options);
  return new Promise((resolve) => {
    spawned.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    spawned.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    spawned.on('close', () => {
      resolve();
    });
  });
}