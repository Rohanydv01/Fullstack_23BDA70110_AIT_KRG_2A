const { MongoClient } = require("mongodb");

// Connect to local MongoDB, database will be created automatically
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

async function seedDB() {
  try {
    await client.connect();
    const db = client.db("capstoneDB"); // database will be created if it doesn't exist

    // Users
    await db.collection("users").insertMany([
      { userId: "u1", name: "Alice" },
      { userId: "u2", name: "Bob" }
    ]);

    // Items
    await db.collection("items").insertMany([
      { itemId: "i1", title: "Iron Man", tags: ["action","superhero","marvel"] },
      { itemId: "i2", title: "Thor", tags: ["action","superhero","fantasy"] },
      { itemId: "i3", title: "Inception", tags: ["sci-fi","thriller"] },
      { itemId: "i4", title: "Interstellar", tags: ["space","drama"] },
      { itemId: "i5", title: "Avatar", tags: ["fantasy","adventure"] }
    ]);

    // Interactions
    await db.collection("interactions").insertMany([
      { userId: "u1", itemId: "i1", type: "view", timestamp: new Date() },
      { userId: "u1", itemId: "i3", type: "purchase", timestamp: new Date() },
      { userId: "u2", itemId: "i2", type: "view", timestamp: new Date() }
    ]);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await client.close();
  }
}

seedDB();
