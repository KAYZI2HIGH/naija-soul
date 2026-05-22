/**
 * Quick test script to verify the backend API is accessible
 * Run with: node lib/test-api.js
 */

const https = require("https");
const http = require("http");

const testEndpoint = async () => {
  const url = "https://naija-soul.onrender.com/simulate-review";

  console.log("🧪 Testing API endpoint...");
  console.log("URL:", url);
  console.log("");

  // First, test if the domain resolves
  console.log("1️⃣ Testing DNS resolution...");
  const dns = require("dns").promises;
  try {
    const address = await dns.resolve4("naija-soul.onrender.com");
    console.log("✅ Domain resolves to:", address);
  } catch (err) {
    console.error("❌ DNS resolution failed:", err.message);
    return;
  }

  // Now test the connection
  console.log("\n2️⃣ Testing HTTP connection (OPTIONS)...");

  const options = {
    hostname: "naija-soul.onrender.com",
    port: 443,
    path: "/simulate-review",
    method: "OPTIONS",
    timeout: 5000,
  };

  https
    .request(options, (res) => {
      console.log("✅ Connection successful!");
      console.log("Status:", res.statusCode);
      console.log("Headers:", res.headers);
    })
    .on("error", (err) => {
      console.error("❌ Connection failed:", err.message);
      console.error("Code:", err.code);
      if (err.code === "ECONNREFUSED") {
        console.error(
          "   → The backend is refusing connections. Service may be down or sleeping.",
        );
      } else if (err.code === "ETIMEDOUT") {
        console.error(
          "   → Connection timeout. Render service may be in sleep mode.",
        );
      } else if (err.code === "EHOSTUNREACH") {
        console.error("   → Host unreachable. Check your internet connection.");
      }
    })
    .end();
};

testEndpoint();
