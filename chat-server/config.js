// The string must match the service name for the RabbitMQ server under the
// `services:` root element in docker-compose.yml. It was 'localhost' before
// containerization.
const AMQP_SERVER = 'rabbitmq-server';
const AMQP_PORT = '5672';
// the user information we use to log in to the management server via HTTP with
// port number 15672.
const AMQP_USER = 'guest';
const AMQP_PASSWORD = 'guest';

const RABBIT_MQ = Object.freeze({
  // URL for AMQP server
  URL: `amqp://${AMQP_USER}:${AMQP_PASSWORD}@${AMQP_SERVER}:${AMQP_PORT}`,
  EXCHANGE_NAME: 'log-exchange',
});

module.exports = {
  RABBIT_MQ,
};