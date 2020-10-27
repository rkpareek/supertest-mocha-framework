const { program } = require('commander');
program.version('1.0.0');
program
  .option('-d, --debug', 'request logs debugging')
 
program.parse(process.argv);

module.exports = program.opts();