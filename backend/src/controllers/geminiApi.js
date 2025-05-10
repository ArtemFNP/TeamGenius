import {GoogleGenAI} from "@google/genai";
import 'dotenv/config';

const apiKey = process.env.GEMINI_KEY;
const ai = new GoogleGenAI({apiKey});

export async function getAIResponse(contents) {
    try {
        // const model = ai.model({ model: "gemini-pro" });
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: contents, // Use the 'contents' parameter
        });
        return result.text;
    } catch (error) {
        console.error("Error calling AI API:", error);
        throw error; // Re-throw to be handled by caller
    }
}

// console.log(await getAIResponse("weather in antwerp?"));

export async function tagNewClothingItem(
    fabric_details,
    brand,
    barcode,
    image
) {
    const prompt = `Assign tags to a newly added clothing item based on its attributes.  Respond with a JSON object.
    Fabric Details: ${fabric_details}
    Brand: ${brand}
    Barcode: ${barcode}
    Image: ${image}

    The JSON object should have the following keys:
    - recommended_temperature (string)
    - recommended_location (string)
    - recommended_occasion (string)`;

    try {
        const result =  await getAIResponse(prompt);
        return result;
    } catch (e) {
        console.error("Error parsing JSON:" + e);
        return {error: "Failed to parse AI response"}
    }
}

(async () => {
    const response = await tagNewClothingItem(
        "100% Cotton",
        "Brand Zara",
        "1234567890",
        "image_url"
    );
    console.log(response);
})();
