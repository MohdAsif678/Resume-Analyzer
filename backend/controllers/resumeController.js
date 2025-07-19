const fs = require('fs');
const pdfParse = require('pdf-parse');

exports.parsePDF = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const dataBuffer = fs.readFileSync(file.path);
    const { text } = await pdfParse(dataBuffer);

    fs.unlinkSync(file.path); // Cleanup uploaded file
    res.json({ text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to parse PDF' });
  }
};