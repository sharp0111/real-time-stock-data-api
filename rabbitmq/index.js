const amqp = require("amqplib/callback_api");

// Local path of RabbitMQ
const rabbitUrl = "amqp://localhost";

//Function gets the channel name and updated stock data as a parameter
const sendRabbitMQ = function sendRabbitMQ(queueName, data) {
  amqp.connect(rabbitUrl, function (error0, connection) {
    if (error0) {
      throw error0;
    }

    // Create a channel on connected RabbitMQ
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = queueName;

      // Checks for “queueName (updateStock)” queue.
      // If it doesn’t exist, then it creates one.
      channel.assertQueue(queue, {
        durable: false,
      });
      // Put the stock data onto the “queueName (updateStock)” queue.
      channel.sendToQueue(queue, Buffer.from(data));

      console.log(" [x] Sent %s", data);
    });
    setTimeout(function () {
      connection.close();
      //process.exit(0);
    }, 500);
  });
};
module.exports = sendRabbitMQ;
