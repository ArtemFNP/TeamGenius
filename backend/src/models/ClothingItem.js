class ClothingItem {
    constructor(id, image, category, temperatureRange, occasions, locations, activity_types) {
        this.id = id; // Unique identifier
        this.image = image; // Image URL or file path
        this.category = category; // Type (e.g., shirt, pants, jacket)
        this.temperatureRange = temperatureRange; // Recommended temperature range
        this.occasions = occasions; // Suitable occasions (e.g., casual, formal, sports)
        this.locations = locations; // Recommended locations (e.g., indoor, outdoor)
        this.activity_types = activity_types; // User-specific preferences
    }

    // Method to check if the item is suitable for a given temperature
    isSuitableForTemperature(temp) {
        return temp >= this.temperatureRange.min && temp <= this.temperatureRange.max;
    }
}

// Example usage:
export const clothingItems = [
    new ClothingItem(
        1, "images/tshirt.png", "t-shirt", { min: 15, max: 30 },
        ["casual", "sports"], ["university", "park", "cafe"], ["outdoor", "mixed"]
    ),
    new ClothingItem(
        2, "images/jeans.png", "jeans", { min: 10, max: 25 },
        ["casual", "formal"], ["university", "office", "restaurant"], ["indoor", "mixed"]
    ),
    new ClothingItem(
        3, "images/jacket.png", "jacket", { min: -5, max: 15 },
        ["casual", "formal"], ["park", "concert", "airport"], ["outdoor", "mixed"]
    ),
    new ClothingItem(
        4, "images/sneakers.png", "sneakers", { min: 5, max: 30 },
        ["casual", "sports"], ["gym", "shopping mall", "festival"], ["outdoor", "mixed"]
    ),
    new ClothingItem(
        5, "images/dress.png", "dress", { min: 20, max: 35 },
        ["formal", "party"], ["wedding", "club", "restaurant"], ["indoor", "mixed"]
    ),
    new ClothingItem(
        6, "images/coat.png", "coat", { min: -10, max: 10 },
        ["formal", "casual"], ["office", "museum", "airport"], ["outdoor", "mixed"]
    ),
    new ClothingItem(
        7, "images/shorts.png", "shorts", { min: 20, max: 35 },
        ["casual", "sports"], ["beach", "park", "hiking trail"], ["outdoor"]
    ),
    new ClothingItem(
        8, "images/boots.png", "boots", { min: -5, max: 15 },
        ["casual", "formal"], ["concert", "sports event", "library"], ["outdoor", "mixed"]
    ),
    new ClothingItem(
        9, "images/blazer.png", "blazer", { min: 10, max: 25 },
        ["formal", "business"], ["office", "co-working space", "theater"], ["indoor"]
    ),
    new ClothingItem(
        10, "images/swimwear.png", "swimwear", { min: 25, max: 40 },
        ["casual", "sports"], ["beach", "pool", "resort"], ["outdoor"]
    )
];

// console.log(clothingItems);
// console.log(clothingItems[0].isSuitableForTemperature(5)); // Output: true