const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "../uploads");

async function downloadImage(url, filename) {
  const imagePath = path.join(UPLOAD_DIR, filename);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(imagePath);

    response.data.pipe(writer);

    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function main() {
  try {
    await fs.ensureDir(UPLOAD_DIR);

    const { data } = await axios.get(
      "https://dummyjson.com/products?limit=250"
    );

    const products = data.products;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      const imageUrl = product.thumbnail || product.images[0];

      const extension = path.extname(new URL(imageUrl).pathname) || ".jpg";

      const filename = `product${i + 1}${extension}`;

      console.log(`Downloading ${filename}...`);

      await downloadImage(imageUrl, filename);
    }

    console.log("✅ All images downloaded successfully!");
  } catch (error) {
    console.error(error.message);
  }
}

main();