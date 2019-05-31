const http = require('http');
const port = process.env.PORT || 3000;
const app = require('./app')
const server = http.createServer(app)
const logger = require('./utils/loggers')
server.listen(port, (req, res)=>{
    logger.info(`Sever Running at ${port}`)
})

