import {default as createError} from 'http-errors';
import { server, port } from "./app.mjs";
import {default as DBG } from 'debug';
import {default as util} from 'util';


const debug = DBG('noteApp:debug');
const debugError = DBG('noteApp:Error')

/**
 * Normalize a port into a number, string, or false.
 */
export function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
export function onError(error) {
  debugError(error)
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    case 'ENOTESSTORE':
        console.error('notes data store initialization failure because', error.error);
        process.exit(1);
        break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
export function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

export function handle404(req, res, next) {
  next(createError(404));
}

export function basicErrorHandler (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}

// handling uncaughtExceptions and unhandledRejections
process.on('uncaughtException', (err) => {
  console.error(`UncaughtException, I ve crashed!! - ${err.stack || err}`)
})

process.on('unhandledRejection', (reason, p) => {
  console.error(`UnhandledRejection at ${util.inspect(p)}, reason: ${reason}`)
})
