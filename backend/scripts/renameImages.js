const fs = require("fs");

const products = require("../products.json");

products.forEach((product, index) => {
  product.image = `product${index + 1}.webp`;
});

fs.writeFileSync(
  "./products.json",
  JSON.stringify(products, null, 2)
);

console.log("✅ Image names updated successfully!");