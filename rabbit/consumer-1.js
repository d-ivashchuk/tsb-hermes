require("dotenv").config();
const ampq = require("amqp-connection-manager");
const twitterMethods = require("../twitter/twitter");
const DailyStats = require("../models/DailyStats");

const q = "jobs";
const connection = ampq.connect([process.env.AMPQ_CONNECTION_STRING]);
connection.on("connect", function() {
  console.log("Connected!");
});
connection.on("disconnect", function(err) {
  console.log("Disconnected.", err);
});

const onMessage = async function(data) {
  const message = JSON.parse(data.content.toString());
  const twitterInfo = await twitterMethods.getUserInfo(message.twitterHandler);
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
    user: message.userMongoId
  });
  const result = await dailyStats.save((err, res) => {
    if (res) {
      channelWrapper.ack(data);
    }
    if (err) {
      console.log(err);
    }
  });
};

const channelWrapper = connection.createChannel({
  setup: function(channel) {
    return Promise.all([
      channel.assertQueue(q, { durable: true }),
      channel.consume(q, onMessage)
    ]);
  }
});

channelWrapper.waitForConnect().then(function() {
  console.log("Listening for messages");
});
