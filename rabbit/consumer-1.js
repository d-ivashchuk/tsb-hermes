require("dotenv").config();
const twitterMethods = require("../twitter/twitter");

const q = "task";

const open = require("amqplib").connect(process.env.AMPQ_CONNECTION_STRING);

open
  .then(function(conn) {
    return conn.createChannel();
  })
  .then(function(ch) {
    return ch.assertQueue(q).then(function(ok) {
      return ch.consume(q, async function(msg) {
        if (msg !== null) {
          const twitterInfo = await twitterMethods.getUserInfo(
            JSON.parse(msg.content).twitterHandler
          );
          const {
            followers_count,
            friends_count,
            listed_count,
            favourites_count
          } = twitterInfo;

          console.log({
            followers_count,
            friends_count,
            listed_count,
            favourites_count,
            timestamp: Math.floor(Date.now() / 100),
            userMongoId: JSON.parse(msg.content).userMongoId
          });
          ch.ack(msg);
        }
      });
    });
  })
  .catch(console.warn);
