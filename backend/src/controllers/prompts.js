const prompts = [
    [
        {
            "name": "Tag new clothing item",
            "prompt": "Assign tags to a newly added clothing item based on its attributes.",
            "parameters": ["fabric_details", "brand", "barcode", "image"],
            "expected_result": ["recommended_temperature", "recommended_location", "recommended_occasion"]
        },
        {
            "name": "Suggest the best outfit to wear",
            "prompt": "Recommend an outfit based on various factors such as destination, activity, style, and weather.",
            "parameters": ["destination", "activity_type", "preferred_style", "available_clothing_list", "weather_condition", "specific_clothing_preferences"],
            "expected_result": ["suggested_outfit_list"]
        },
        {
            "name": "Find nearby locations for selling, donating, or recycling clothes",
            "prompt": "Locate places such as 2dehands, Kringwinkel, and recycling centers using an OpenStreetMap-based map of Antwerp.",
            "parameters": ["user_location"],
            "expected_result": ["nearby_recycling_locations"]
        }
    ]
];

const tags = [
    {
        "locations": [
            "university", "park", "cafe", "party", "office", "gym", "beach", "shopping mall",
            "restaurant", "library", "concert", "museum", "airport", "home", "sports event",
            "wedding", "hiking trail", "theater", "hotel", "club", "festival", "co-working space"
        ],
        "activity_types": ["indoor", "outdoor", "mixed"]
    }
];

const categories = [
    "t-shirt", "shirt", "jeans", "trousers", "shorts", "jacket", "coat", "sweater", "hoodie",
    "dress", "skirt", "blouse", "suit", "blazer", "activewear", "swimwear", "pajamas", "underwear",
    "shoes", "sneakers", "boots", "sandals", "heels", "flats", "loafers", "slippers", "accessories",
    "hat", "scarf", "gloves", "belt", "socks", "bag", "watch", "sunglasses", "jewelry"
];

export { prompts };