const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Render uses dynamic PORT, localhost uses 3000
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON body
app.use(express.json());

// JSON file path
const filePath = path.join(__dirname, "payments.json");

// Create JSON file if it does not exist
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

/**
 * POST: Save payment data
 * URL: /save-payment
 */
app.post("/save-payment", (req, res) => {
  const { amount, mobileNumber, transactionID, date } = req.body;

  // Validation
  if (!amount || !mobileNumber || !transactionID || !date) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  // Read existing data
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // Add new payment
  data.push({
    amount,
    mobileNumber,
    transactionID,
    date
  });

  // Save back to JSON file
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({
    success: true,
    message: "Payment saved successfully"
  });
});

/**
 * GET: View all payments
 * URL: /payments
 */
app.get("/payments", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  res.json(data);
});

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
