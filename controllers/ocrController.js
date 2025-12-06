const { createWorker } = require('tesseract.js');
const fs = require('fs');
const { extractData } = require('../utils/extractData');
const { categorizeWithAI } = require('../utils/aiHelper');

exports.uploadOCR = async (req, res, next) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const imagePath = req.file.path;
    const worker = await createWorker();

    try {
      //  await worker.load();
        const { data: { text } } = await worker.recognize(imagePath, 'eng');

        const structuredData =  await extractData(text);
        const category = await categorizeWithAI(text);

        res.json({
            status: 'success',
            rawText: text.trim(),
            extractedData: structuredData,
            category
        });
    } catch (err) {
        next(err);
    } finally {
        await worker.terminate();
        fs.unlink(imagePath, () => {});
    }
};
