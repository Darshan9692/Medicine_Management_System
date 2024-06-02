const pino = require('pino');

const date = new Date();
let fileName = `pino-logger-${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}.log`;


const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: `./uploads/logger/${fileName}` },

    },
    {
      target: 'pino-pretty',
    },
  ],
});

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: () => `,"time":"${new Date(Date.now()).toLocaleTimeString()}"`,
  },
  transport
);

module.exports = logger