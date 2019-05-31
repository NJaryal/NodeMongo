const { createLogger, transports, format } = require('winston')

const logger = createLogger({
  'transports': [
    new transports.File({
      filename: `${__dirname}/../logs/server.log`,
      maxFiles: 5
    }),
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      )
    })    
  ]
})
module.exports = logger;