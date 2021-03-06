require("dotenv").config();

const {
  TWITTER_KEY,
  TWITTER_SECRET,
  TWITTER_TOKEN_KEY,
  TWITTER_TOKEN_SECRET
} = process.env;

const Twitter = require("twitter");

const client = new Twitter({
  consumer_key: TWITTER_KEY,
  consumer_secret: TWITTER_SECRET,
  access_token_key: TWITTER_TOKEN_KEY,
  access_token_secret: TWITTER_TOKEN_SECRET
});

const getUserInfo = async userScreenName => {
  try {
    const params = { screen_name: userScreenName };
    const user = await client.get("users/lookup", params);
    return user[0];
  } catch (err) {
    if (err[0].code === 17) {
      return { error: "BAD_USERNAME" };
    }
    console.log(err);
  }
};

const getTweets = async userScreenName => {
  try {
    const params = {
      screen_name: userScreenName,
      exclude_replies: true,
      include_rts: false,
      trim_user: true
    };
    const tweets = await client.get("statuses/user_timeline", params);
    return tweets;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getUserInfo, getTweets };
