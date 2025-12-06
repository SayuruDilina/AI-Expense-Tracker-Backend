const { GoogleGenerativeAI } = require("@google/generative-ai");
const key = process.env.GEMINI_KEY;
const genAI = new GoogleGenerativeAI(key);

exports.categorizeWithAI = async (text) => {
   const lower = text.toLowerCase();

    // ============================
    // 1) RULE-BASED CLASSIFICATION
    // ============================
    const groceryWords = [
        "keells", "cargills", "arpico", "grocery", "supermarket",
        "food city", "spar", "laughs", "lulu", "carrefour",
        "vegetable", "vege", "fruit", "rice", "eggs", "milk", "bread"
    ];
    if (groceryWords.some(w => lower.includes(w))) return "Groceries";

    const foodWords = [
        "kfc", "mcdonald", "pizza", "burger", "fried", "chicken",
        "restaurant", "dinemore", "food", "meal", "zinger", "combo",
        "bites", "snack"
    ];
    if (foodWords.some(w => lower.includes(w))) return "Food";

    const travelWords = [
        "pickme", "uber", "bus", "train", "taxi", "cab",
        "transport", "ride", "km", "distance", "fuel"
    ];
    if (travelWords.some(w => lower.includes(w))) return "Travel";

    const billWords = [
        "bill", "dialog", "mobitel", "slt", "ceb", "water board",
        "electricity", "internet", "wifi", "utility"
    ];
    if (billWords.some(w => lower.includes(w))) return "Bills";

    // ==============================================
    // 2) FALLBACK: Ask Gemini Free API (better logic)
    // ==============================================
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
You are an expense analyzer. 
Categorize the receipt into ONLY ONE of these:

["Groceries", "Food", "Bills", "Travel", "Shopping", "Health", "Entertainment", "Other"]

Receipt text:
${text}

Return only the category name.
        `;

        const result = await model.generateContent(prompt);

        const aiAnswer = result.response.text().trim();

        // Validate output
        const valid = [
            "Groceries", "Food", "Bills", "Travel",
            "Shopping", "Health", "Entertainment", "Other"
        ];

        if (valid.includes(aiAnswer)) {
            return aiAnswer;
        }

        return "Other";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Other";
    }
};
