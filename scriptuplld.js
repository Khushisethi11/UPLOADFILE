const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const subject = req.body.courseID;
    const uploadPath = path.join('uploads', subject);
    fs.mkdirSync(uploadPath, { recursive: true }); 
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});
const upload = multer({ storage: storage });
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully');
});
app.get('/download/:subject/:filename', (req, res) => {
  const subject = req.params.subject;
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', subject, filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath); 
  } else {
    res.status(404).send('File not found');
  }
});
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
