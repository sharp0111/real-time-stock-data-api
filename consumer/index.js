let io = require("../socket"); // custom Socket module, used for notifying the customers
var amqp = require("amqplib/callback_api");

// Connects to local RabbitMQ service.
amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }

  // Creates the “updateStock” channel
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = "updateStock";

    // Declares a queue for consuming the data.
    // “durable” means how RabbitMQ saves data in memory as default.
    // But if we set “durable: true,” queues are persisted to disk.
    // So If the server is taken down and then brought back up,
    // the durable queue will be re-declared during server startup,
    // however, only persistent messages will be recovered.
    // On the other hand, in the case of memory(durable: false), Queues will be lost.
    channel.assertQueue(queue, {
      durable: false,
    });

    console.log(
      " [*] Waiting for stockData messages in %s. To exit press CTRL+C",
      queue
    );

    // Listens to the “updateStock” channel,
    // gets the updated stock data from the queue and
    // sends it to all customers in real-time using the Socket.IO service
    channel.consume(
      queue,
      function (data) {
        stock = JSON.parse(data.content.toString());
        console.log(" [x] Received Stock:", stock.name + " : " + stock.value);
        // Triggers updateStock for  All Clients
        io.socket.emit("updatedStock", stock);
      },
      {
        // means, when the data is consumed, it will be removed from the queue.
        noAck: true,
      }
    );
  });
});
