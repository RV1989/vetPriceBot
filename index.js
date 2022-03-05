const { createCanvas, loadImage } = require("canvas");
require("dotenv").config();
const fs = require("fs").promises;
const CoinGecko = require("coingecko-api");
const { TwitterApi } = require("twitter-api-v2");
var Twit = require("twit");

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

  const twitterClient = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_KEY_SECRET,
    // Following access tokens are not required if you are
    // at part 1 of user-auth process (ask for a request token)
    // or if you want a app-only client (see below)
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
  });
  const mediaId = await twitterClient.v1.uploadMedia("./output/image.png");
  await twitterClient.v1.tweet(`#VeChain $vet price: $ ${price}`, {
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

const createImage = async (price) => {
  const canvas = createCanvas(1600, 418);
  const ctx = canvas.getContext("2d");
  loadImage("./img/layout.png").then((image) => {
    ctx.drawImage(image, 0, -1, 1600, 420);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "150px Arial black"; // To change font size and type

    var textString = `$${price.toFixed(4)}`;

    ctx.fillText(textString, canvas.width / 2, canvas.height / 2);

    const buffer = canvas.toBuffer("image/png");
    return fs.writeFile("./output/image.png", buffer);
  });
};

main();
