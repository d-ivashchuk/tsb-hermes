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
            msg.content.toString()
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
            timestamp: Math.floor(Date.now() / 1000)
          });
          ch.ack(msg);
        }
      });
    });
  })
  .catch(console.warn);
