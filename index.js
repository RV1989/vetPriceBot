require("dotenv").config();
const CoinGecko = require("coingecko-api");
const createImage = require("./createImage").createImage;
const { TwitterApi } = require("twitter-api-v2");
const main = async () => {
  const CoinGeckoClient = new CoinGecko();
  const { data } = await CoinGeckoClient.simple
    .price({
      ids: ["vechain"],
      vs_currencies: ["usd"],
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });

  const price = data.vechain.usd;

  await createImage(price).catch((error) => {
    console.log(error);
    process.exit(1);
  });
  // const twitterClient = new TwitterApi(process.env.BEARER_TOKEN);

  await sleep(1000);

  const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_KEY_SECRET,
    // Following access tokens are not required if you are
    // at part 1 of user-auth process (ask for a request token)
    // or if you want a app-only client (see below)
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });
  const mediaId = await twitterClient.v1.uploadMedia("./output/image.png");
  await twitterClient.v1.tweet(`#VeChain #VeFam $vet price: $ ${price}`, {
    media_ids: [mediaId],
  });

  /*
  var T = new Twit({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_KEY_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
  });
  T.post(
    "statuses/update",
    { status: "hello world!" },
    function (err, data, response) {
      console.log(data);
    }
  );
  */
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

main();
