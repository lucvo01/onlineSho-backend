const csvFilePath = "styles.csv"; // Replace with your CSV file path
const jsonFilePath = "data.json"; // Replace with your desired JSON output file path

const csvtojson = require("csvtojson");
const fs = require("fs");

csvtojson({
  colParser: {
    price: (item) => parseFloat(item)
  }
})
  .fromFile(csvFilePath)
  .then((jsonArrayObj) => {
    // Add 'isDeleted' field with value 'false' to each JSON object
    const modifiedArrayObj = jsonArrayObj.map((obj) => ({
      ...obj,
      isDeleted: false
    }));

    const jsonString = JSON.stringify(modifiedArrayObj, null, 2);
    fs.writeFileSync(jsonFilePath, jsonString, "utf-8");
    console.log("CSV to JSON conversion complete.");
  })
  .catch((error) => {
    console.error("Error converting CSV to JSON:", error);
  });
