exports.extractData= async (rawText)=> {
    const extracted = {};

    // Match total/amount/price with optional $ and flexible decimal
    const totalMatch = rawText.match(/(total|amount|price)\s*[:\$]?\s*(\d+(?:[\.,]\d{1,2})?)/i);
    if (totalMatch) {
        extracted.totalAmount = parseFloat(totalMatch[2].replace(',', '.'));
    }

    // Match dates in multiple formats
    const dateMatch = rawText.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/);
    if (dateMatch) {
        const parts = dateMatch[1].split(/[\/\-\.]/).map(Number);
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        // Basic validation
        if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
            extracted.documentDate = dateMatch[1];
        } else {
            extracted.documentDate = "0"; // invalid date
        }
    } else {
        extracted.documentDate = "0"; // no match
    }


    // Match Document ID with some flexibility
    const idMatch = rawText.match(/Document\s*ID\s*[:#]?\s*([A-Z0-9\-]{3,15})/i);
    if (idMatch) {
        extracted.documentId = idMatch[1].toUpperCase();
    }

    return extracted;
}
