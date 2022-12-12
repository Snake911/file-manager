import * as os from 'os';
import * as readline from 'readline';

import * as errors from './utils/errors.js';

const username = process.argv.find(arg => arg.startsWith('--username'))?.split('=')[1] || 'Guest';
let curdir = os.homedir();

console.log(`Welcome to the File Manager, ${username}!`);
console.log(`You are currently in ${curdir}`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.on('close', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
});