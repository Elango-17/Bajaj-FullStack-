import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); // Middleware to parse JSON data

// POST route: /bfhl
app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;
  const fullname = "john_doe"; // Replace with dynamic name if necessary
  const dob = "17091999"; // Replace with dynamic DOB if necessary
  const user_id = `${fullname}_${dob}`;
  const email = "john@xyz.com";
  const roll_number = "ABCD123";

  // Validate input data
  if (!Array.isArray(data)) {
    return res.status(400).json({
      is_success: false,
      user_id,
      email,
      roll_number,
      numbers: [],
      alphabets: [],
      highest_lowercase_alphabet: [],
      file_valid: false,
      file_mime_type: null,
      file_size_kb: null,
    });
  }

  // Filter out numbers and alphabets
  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => /^[A-Za-z]$/.test(item));
  const highest_lowercase_alphabet =
    alphabets
      .filter((item) => /^[a-z]$/.test(item))
      .sort()
      .reverse()[0] || null;

  // File validation and details
  let file_valid = false;
  let file_mime_type = null;
  let file_size_kb = null;

  if (file_b64) {
    try {
      // Decode base64 string
      const buffer = Buffer.from(file_b64, "base64");

      // Write the buffer to a temporary file for validation
      const tempFilePath = "tempfile";
      fs.writeFileSync(tempFilePath, buffer); // Write buffer to file

      // Get file size in KB
      file_size_kb = (fs.statSync(tempFilePath).size / 1024).toFixed(2);

      // Get MIME type using mime-types (optional)
      file_mime_type = mime.lookup(tempFilePath);
      file_valid = !!file_mime_type && file_size_kb > 0;

      // Remove temporary file
      fs.unlinkSync(tempFilePath);
    } catch (error) {
      file_valid = false;
    }
  }

  // Response object
  res.json({
    is_success: true,
    user_id,
    email,
    roll_number,
    numbers,
    alphabets,
    highest_lowercase_alphabet: highest_lowercase_alphabet
      ? [highest_lowercase_alphabet]
      : [],
    file_valid,
    file_mime_type,
    file_size_kb,
  });
});

// GET route: /bfhl
app.get("/bfhl", (req, res) => {
  res.status(200).json({
    operation_code: 1,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
