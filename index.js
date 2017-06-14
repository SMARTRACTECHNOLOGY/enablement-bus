const amqplib = require('amqplib');

const isDevelopment = process.env.NODE_ENV !== "production";

const q = 'queue';

// Initialize connection to rabbitmq w/ amqp
const connection = amqplib.connect('amqp://' + process.env.URL);
const serialize = JSON.stringify;
const deserialize = JSON.parse;

// Consumer
connection
  .then((conn) => conn.createChannel())
  .then((ch) => (
    ch.assertQueue(q)
      .then((ok) => (
        ch.consume(q, (msg) => {
          try {
            if (msg !== null) {
              console.log('==== Received shiz: ', serialize(deserialize(msg.content)));
              ch.ack(msg);
            }
          } catch(e){
            console.error('==== Error in consumer process.', e.message);
          }
        })
    )
  )))
  .catch(console.warn);

/*
* Development mock out producer sending out serializable datas
*/

if(isDevelopment){
  const faker = require('faker');
  const config = {
    interval: 1500,
    interpolation: () => ({
      name: faker.fake("{{name.lastName}}, {{name.firstName}} {{name.suffix}}"),
      email: faker.internet.email(),
      avatar: faker.image.avatar()
    })
  };
  connection
    .then((conn) => conn.createChannel())
    .then((ch) => (
      ch.assertQueue(q)
        .then((ok) => (
          setInterval(() => (
            ch.sendToQueue(q, new Buffer(serialize(config.interpolation())))
          ), config.interval)
        ))
    ))
    .catch(console.warn);
}
