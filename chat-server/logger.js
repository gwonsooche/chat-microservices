const amqp = require('amqplib');
const {RABBIT_MQ} = require('./config');
const {DateTime} = require('luxon');

/**
 * Levels of log that are of application-wide use.
 * @enum {string}
 */
const LogLevel = Object.freeze({
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
});

/**
 * Logger.
 * 
 * Design decision: provide separate methods, one for each log level, instead
 * of providing a single method that takes the log level as an argument. The
 * client should just choose a proper method. Doing so saves the client from
 * handling the exception for a wrong log level that would be thrown by the
 * single method; handling the exceptions everywhere would lead to messy code.
 * @constructor
 */
function Logger() {
  this.channel = null;

  this.createChannel = async function() {
    const connection = await amqp.connect(RABBIT_MQ.URL);
    this.channel = await connection.createChannel();
  };

  /**
   * Constructs a complete log object.
   * @param {string} logLevel
   * @param {string} logText
   */
  this.constructLog = function(logLevel, logText) {
    return {
      level: logLevel,
      message: logText,
      time: DateTime.now(),
    };
  }

  this.produceLog = async function(logLevel, logText) {
    if (this.channel == null) {
      await this.createChannel();
    }

    // Assert the exchange into existence.
    // TODO: can this be done only once like `createChannel` for optimization?
    const exchangeName = RABBIT_MQ.EXCHANGE_NAME;
    await this.channel.assertExchange(exchangeName, 'direct');

    const log = this.constructLog(logLevel, logText);
    // Publish the log to the exchange.
    await this.channel.publish(
      exchangeName,
      logLevel,
      Buffer.from(JSON.stringify(log))
    );
  }

  /**
   * Publishes the given debug-level `logText` to the log exchange of the
   * RabbitMQ server.
   * @param {string} logText
   */
  this.debug = async function(logText) {
    await this.produceLog(LogLevel.DEBUG, logText);
  }

  /**
   * Publishes the given info-level `logText` to the log exchange of the
   * RabbitMQ server.
   * @param {string} logText
   */
  this.info = async function(logText) {
   await this.produceLog(LogLevel.INFO, logText);
  }

  /**
   * Publishes the given warning-level `logText` to the log exchange of the
   * RabbitMQ server.
   * @param {string} logText
   */
  this.warning = async function(logText) {
    await this.produceLog(LogLevel.WARNING, logText);
  }

  /**
   * Publishes the given error-level `logText` to the log exchange of the
   * RabbitMQ server.
   * @param {string} logText
   */
  this.error = async function(logText) {
    await this.produceLog(LogLevel.ERROR, logText);
  }

  /**
   * Publishes the given critical-level `logText` to the log exchange of the
   * RabbitMQ server.
   * @param {string} logText
   */
  this.critical = async function(logText) {
    await this.produceLog(LogLevel.CRITICAL, logText);
  }
}

module.exports = {
  LogLevel,
  Logger,
};