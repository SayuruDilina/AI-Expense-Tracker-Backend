const express = require('express');
require("dotenv").config();
const multer = require('multer');
const { createWorker } = require('tesseract.js');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ocrRoutes = require('./routes/ocrRoutes');
const sequelize = require('./config/db');



const app = express();


const key = process.env.GEMIINI_KEY;
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/ocr', ocrRoutes);
//const hf = new HfInference(key);

const genAI = new GoogleGenerativeAI(key);
app.get('/', (req, res) => {
    res.send('Hello World from Express!');
});

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {

//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const upload = multer({ storage: storage });


// app.post('/ocr-upload', upload.single('image'), async (req, res) => {

//     if (!req.file) {
//         return res.status(400).send('No file uploaded.');
//     }


//     const imagePath = req.file.path;


//     const worker = await createWorker();


//     try {

//         await worker.load();

//         const { data: { text } } = await worker.recognize(imagePath, 'eng');

//         const structuredData = extractData(text);
//         const category = await categorizeWithAI(text);
//         res.json({
//             status: 'success',

//             rawText: text.trim(),

//             extractedData: structuredData,
//             category: category
//         });
//     } catch (error) {
//         console.error('Tesseract OCR Error:', error);
//         res.status(500).send('Error performing OCR.');
//     } finally {

//         await worker.terminate();
//         fs.unlink(imagePath, (err) => {
//             if (err) console.error('Failed to delete file:', err);
//         });
//     }
// });

// async function categorizeWithAI(text) {
//     const lower = text.toLowerCase();

//     // ============================
//     // 1) RULE-BASED CLASSIFICATION
//     // ============================
//     const groceryWords = [
//         "keells", "cargills", "arpico", "grocery", "supermarket",
//         "food city", "spar", "laughs", "lulu", "carrefour",
//         "vegetable", "vege", "fruit", "rice", "eggs", "milk", "bread"
//     ];
//     if (groceryWords.some(w => lower.includes(w))) return "Groceries";

//     const foodWords = [
//         "kfc", "mcdonald", "pizza", "burger", "fried", "chicken",
//         "restaurant", "dinemore", "food", "meal", "zinger", "combo",
//         "bites", "snack"
//     ];
//     if (foodWords.some(w => lower.includes(w))) return "Food";

//     const travelWords = [
//         "pickme", "uber", "bus", "train", "taxi", "cab",
//         "transport", "ride", "km", "distance", "fuel"
//     ];
//     if (travelWords.some(w => lower.includes(w))) return "Travel";

//     const billWords = [
//         "bill", "dialog", "mobitel", "slt", "ceb", "water board",
//         "electricity", "internet", "wifi", "utility"
//     ];
//     if (billWords.some(w => lower.includes(w))) return "Bills";

//     // ==============================================
//     // 2) FALLBACK: Ask Gemini Free API (better logic)
//     // ==============================================
//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//         const prompt = `
// You are an expense analyzer. 
// Categorize the receipt into ONLY ONE of these:

// ["Groceries", "Food", "Bills", "Travel", "Shopping", "Health", "Entertainment", "Other"]

// Receipt text:
// ${text}

// Return only the category name.
//         `;

//         const result = await model.generateContent(prompt);

//         const aiAnswer = result.response.text().trim();

//         // Validate output
//         const valid = [
//             "Groceries", "Food", "Bills", "Travel",
//             "Shopping", "Health", "Entertainment", "Other"
//         ];

//         if (valid.includes(aiAnswer)) {
//             return aiAnswer;
//         }

//         return "Other";
//     } catch (error) {
//         console.error("Gemini API Error:", error);
//         return "Other";
//     }
// }



// function extractData(rawText) {
//     const extracted = {};

//     // Match total/amount/price with optional $ and flexible decimal
//     const totalMatch = rawText.match(/(total|amount|price)\s*[:\$]?\s*(\d+(?:[\.,]\d{1,2})?)/i);
//     if (totalMatch) {
//         extracted.totalAmount = parseFloat(totalMatch[2].replace(',', '.'));
//     }

//     // Match dates in multiple formats
//     const dateMatch = rawText.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/);
//     if (dateMatch) {
//         const parts = dateMatch[1].split(/[\/\-\.]/).map(Number);
//         const day = parts[0];
//         const month = parts[1];
//         const year = parts[2];

//         // Basic validation
//         if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
//             extracted.documentDate = dateMatch[1];
//         } else {
//             extracted.documentDate = "0"; // invalid date
//         }
//     } else {
//         extracted.documentDate = "0"; // no match
//     }


//     // Match Document ID with some flexibility
//     const idMatch = rawText.match(/Document\s*ID\s*[:#]?\s*([A-Z0-9\-]{3,15})/i);
//     if (idMatch) {
//         extracted.documentId = idMatch[1].toUpperCase();
//     }

//     return extracted;
// }

const PORT = 3000;

const startServer = async () => {
  try {
    
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
   
    process.exit(1);
  }
};

startServer();
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });