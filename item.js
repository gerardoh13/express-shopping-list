const { writeFileSync, readFileSync } = require("fs");
const ExpressError = require("./expressError");

let items;
try {
  const jsonString = readFileSync("./fakeDb.json", { encoding: "utf8" });
  items = JSON.parse(jsonString);
} catch (err) {
  console.log(err);
}

class Item {
  constructor(name, price) {
    this.name = name;
    this.price = price;
    items.push(this);
  }
  static getAll() {
    return items;
  }

  static get(name) {
    let item = items.find((i) => i.name === name);
    if (!item) {
      return new ExpressError("Item not found", 404);
    }
    return item;
  }
  static updateDb(testStr) {
    try {
      let jsonString = testStr ? testStr : items;
      writeFileSync("./fakeDb.json", JSON.stringify(jsonString, null, 2));
    } catch (err) {
      console.error(err);
    }
  }
  static update(name, data) {
    let item = Item.get(name);
    if (!item) return;
    item.name = data.name || item.name;
    item.price = data.price || item.price;
    Item.updateDb();
    return item;
  }

  static delete(name) {
    let foundIdx = items.findIndex((i) => i.name === name);
    if (foundIdx === -1) {
      return new ExpressError("Item not found", 404);
    }
    items.splice(foundIdx, 1);
    Item.updateDb();
  }
}

module.exports = Item;
