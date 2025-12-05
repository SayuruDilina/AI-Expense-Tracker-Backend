const express = require('express');
require("dotenv").config();
const multer = require('multer');
const { createWorker } = require('tesseract.js');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World from Express!');
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {

        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/ocr-upload', upload.single('image'), async (req, res) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }


    const imagePath = req.file.path;


    const worker = await createWorker();


    try {

        await worker.load();

        const { data: { text } } = await worker.recognize(imagePath, 'eng');

        res.json({
            recognizedText: text.trim()
        });
    } catch (error) {
        console.error('Tesseract OCR Error:', error);
        res.status(500).send('Error performing OCR.');
    } finally {

        await worker.terminate();
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Failed to delete file:', err);
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});