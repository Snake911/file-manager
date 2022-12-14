import * as os from 'os';
import * as readline from 'readline';
import * as path from 'path';
import * as fs from 'fs/promises';

import * as errors from './utils/errors.js';

const username = process.argv.find(arg => arg.startsWith('--username'))?.split('=')[1] || 'Guest';
let curdir = os.homedir();

console.log(`Welcome to the File Manager, ${username}!`);
console.log(`You are currently in ${curdir}`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.on('line', async (input) => {
  const command = input.split(' ')[0];
  const params = input.split(' ').slice(1).join(' ');
  await commands[command](params);
  if(command !== '.exit') {
    console.log(`You are currently in ${curdir}`);
  }  
});

rl.on('close', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
});

const commands = {
  'cd': async (params) => {
    if(!params) {
      errors.invalid_input();
    } else {
      try {
        const newPath = path.resolve(curdir, params);
        console.log(path.normalize(newPath));
        const stat = await fs.lstat(newPath);
        if(stat.isDirectory()) {
          curdir = newPath;
        }
      } catch {
        errors.operation_failed();
      }
    }
  },
  'ls': async () => {
    try {
      const files = await fs.readdir(curdir);
      let filesArray = [];
      let directoryArray = [];
      for (const index in files) {
        const stat = await fs.lstat(path.resolve(curdir, files[index]));
        if(stat.isFile()) {
          filesArray.push({'Name': files[index], 'Type': 'File'});
        } else {
          directoryArray.push({'Name': files[index], 'Type': 'Directory'})
        }        
      }
      console.table(directoryArray.concat(filesArray));      
    } catch (err) {
      errors.operation_failed();
    }
  },
  'up': () => {
    curdir = path.resolve(curdir, '..');
  },

  '.exit': () => {
    rl.close();
  }
}