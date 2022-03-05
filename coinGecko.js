const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
exports.getPriceNow = async () => {
  const { data } = await CoinGeckoClient.simple
    .price({
      ids: ["vechain"],
      vs_currencies: ["usd"],
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });

  return Promise.resolve(data.vechain.usd);
};

exports.getPriceLastHour = async () => {
  const { data } = await CoinGeckoClient.coins.fetchMarketChart("vechain", {
    days: 1,
    vs_currency: "usd",
  });

  return Promise.resolve(data.prices[data.prices.length - 14][1]);
};
