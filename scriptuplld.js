const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination folder based on the subject
    const subject = req.body.courseID; // Assuming courseID represents the subject
    const uploadPath = path.join('uploads', subject);
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure folder exists
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  }
});
const upload = multer({ storage: storage });

// Route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  // Handle file upload
  res.send('File uploaded successfully');
});

// Route for file download (similar to your previous implementation)
app.get('/download/:subject/:filename', (req, res) => {
  const subject = req.params.subject;
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', subject, filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    res.download(filePath); // Download the file
  } else {
    res.status(404).send('File not found');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
