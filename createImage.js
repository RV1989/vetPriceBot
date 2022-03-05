const fs = require("fs").promises;
const { createCanvas, loadImage, registerFont } = require("canvas");
path = require("path");

exports.createImage = async function (price) {
  const canvas = createCanvas(1600, 418);
  const ctx = canvas.getContext("2d");

  loadImage("./img/layout.png").then((image) => {
    registerFont("./font/ariblk.ttf", { family: "Sans-serif" });
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
