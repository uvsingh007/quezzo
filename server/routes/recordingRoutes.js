const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/save-recording', upload.single('recording'), (req, res) => {
  try {
    const recording = req.file;

    if (!recording) {
      return res.status(400).json({ error: 'No recording file provided' });
    }

    const filePath = path.join(__dirname, '..', 'recordings', `recording_${Date.now()}.webm`);
    const fs = require('fs');

    fs.writeFile(filePath, recording.buffer, (err) => {
      if (err) {
        console.error('Error saving recording:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      console.log('Recording saved successfully');
      res.status(200).json({ success: true });
    });
  } catch (error) {
    console.error('Error handling recording upload:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
