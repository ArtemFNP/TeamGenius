import { clothingItems } from '../models/ClothingItem.js';
import { getWeather } from './weatherApi.js';

function matchBestItems(selectedCategories, tagLocations, tagActivityTypes, minTemp, maxTemp, clothingItems) {
    return clothingItems.filter(item =>
        selectedCategories.includes(item.category) && // Match category
        item.locations.some(location => tagLocations.includes(location)) && // Match location
        item.activity_types.some(activity => tagActivityTypes.includes(activity)) && // Match activity type
        item.temperatureRange.min <= maxTemp && item.temperatureRange.max >= minTemp // Match temperature range
    );
}



// User input
const selectedCategories = ["t-shirt", "jeans"];
const tagLocations = ["university", "park"];
const tagActivityTypes = ["outdoor", "mixed"];


// Async function to fetch weather data and find best clothing matches
async function fetchAndMatchClothing() {
    try {
        const weather = await getWeather();
        // console.log("Fetched Weather:", weather);

        const minTemp = weather.temp_min;
        const maxTemp = weather.temp_max;

        // Find best matches based on weather and user preferences
        const bestMatches = matchBestItems(selectedCategories, tagLocations, tagActivityTypes, minTemp, maxTemp, clothingItems);

        console.log("Best Matches:", bestMatches);
    } catch (error) {
        console.error("Error fetching weather or matching clothing:", error);
    }
}


// Execute the function
fetchAndMatchClothing();
