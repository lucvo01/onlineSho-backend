const { faker } = require("@faker-js/faker");
const { parse } = require("dotenv");

const createProduct = (numberOfProducts) => {
  if (!numberOfProducts) {
    console.log("please input number");
    return;
  }
  numberOfProducts = parseInt(numberOfProducts);
  console.log("Creating Products");

  for (let i = 0; i < numberOfProducts; i++) {
    const product = {
      name: faker.commerce.productName(),
      price: faker.commerce.price({ min: 100, max: 200, dec: 0, symbol: "$" }),
      url: faker.image.urlLoremFlickr({ category: 'fashion' })
    };
    console.log("Products", product);
  }
};

const input = process.argv.slice(2)[0];
console.log(input)
createProduct(input)