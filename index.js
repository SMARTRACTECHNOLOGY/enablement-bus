const amqplib = require('amqplib');

const isDevelopment = process.env.NODE_ENV !== "production";
const q = 'queue';

// Initialize connection to rabbitmq w/ amqp
const connection = amqplib.connect('amqp://' + process.env.URL);

// Producer
connection
  .then((conn) => conn.createChannel())
  .then((ch) => (
    ch.assertQueue(q)
      .then((ok) => ch.sendToQueue(q, new Buffer('ALL THE THINGS!')))
  ))
  .catch(console.warn);

// Consumer
connection
  .then((conn) => conn.createChannel())
  .then((ch) => (
    ch.assertQueue(q)
      .then((ok) => (
        ch.consume(q, (msg) => {
          if (msg !== null) {
            console.log('==== Received shiz from the wire: ', msg.content.toString());
            ch.ack(msg);
          }
        })
    )
  )))
  .catch(console.warn);
