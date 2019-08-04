require("dotenv").config();
const twitterMethods = require("../twitter/twitter");
const DailyStats = require("../models/DailyStats");

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
          const dailyStats = new DailyStats({
            followersCount: followers_count,
            friendsCount: friends_count,
            listedCount: listed_count,
            favoritesCount: favourites_count,
            user: JSON.parse(msg.content).userMongoId
          });
          const result = await dailyStats.save((err, res) => {
            if (err) {
              console.log(err);
            }
          });
          ch.ack(msg);
        }
      });
    });
  })
  .catch(console.warn);
