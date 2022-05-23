const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdout } = process;

const ft = path.join(__dirname, 'text.txt');
const readLine = readline.createInterface({
  input: process.stdin
});

stdout.write('Привет! Введи какой-нибудь текст...\n');
fs.createWriteStream(ft);
readLine.on('line', input => {
  if (input.toLowerCase() === 'exit') {
    console.log('Пока!');
    readLine.close();
  } else {
    fs.appendFile(ft, input + '\n', err => {
      if (err) throw err;
    });
  }
});

process.on('SIGINT', () => {
  console.log('Пока!');
  process.exit();
});
