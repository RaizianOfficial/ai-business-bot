const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const products = [
  { code: "301", name: "Mini Birthday Hamper", price: 199 },
  { code: "302", name: "Classic Birthday Hamper", price: 299 },
  { code: "303", name: "Premium Birthday Hamper", price: 499 },
];

async function seed() {
  console.log("Seeding products...");
  for (const product of products) {
    await db.collection("products").doc(product.code).set(product);
    console.log(`Added product: ${product.name} (${product.code})`);
  }
  console.log("Seeding complete!");
  process.exit();
}

seed().catch(console.error);
