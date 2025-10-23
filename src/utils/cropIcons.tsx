// Crop icons with emojis for better visual identification
export const cropIcons: Record<string, string> = {
  // Food Crops
  rice: "🌾",
  paddy: "🌾",
  wheat: "🌾",
  maize: "🌽",
  millets: "🌾",
  jowar: "🌾",
  bajra: "🌾",
  ragi: "🌾",
  
  // Pulses
  gram: "🫘",
  moong: "🫘",
  lentil: "🫘",
  "green gram": "🫘",
  "black gram": "🫘",
  "red gram": "🫘",
  chickpea: "🫘",
  
  // Oilseeds
  groundnut: "🥜",
  peanut: "🥜",
  mustard: "🌻",
  sunflower: "🌻",
  sesame: "🌱",
  
  // Fruits
  mango: "🥭",
  banana: "🍌",
  apple: "🍎",
  orange: "🍊",
  grapes: "🍇",
  watermelon: "🍉",
  papaya: "🍈",
  guava: "🍏",
  pomegranate: "🥭",
  
  // Vegetables
  tomato: "🍅",
  potato: "🥔",
  onion: "🧅",
  brinjal: "🍆",
  okra: "🌿",
  cabbage: "🥬",
  cauliflower: "🥦",
  carrot: "🥕",
  beetroot: "🌰",
  pumpkin: "🎃",
  cucumber: "🥒",
  spinach: "🥬",
  
  // Commercial Crops
  cotton: "🌸",
  sugarcane: "🎋",
  tobacco: "🌿",
  
  // Plantation
  coconut: "🥥",
  tea: "🍵",
  coffee: "☕",
  rubber: "🌳",
  
  // Spices
  turmeric: "🟡",
  ginger: "🫚",
  pepper: "🌶️",
  chilli: "🌶️",
  coriander: "🌿",
  cumin: "🌿",
  
  // Flowers
  rose: "🌹",
  marigold: "🌼",
  jasmine: "🌸",
  chrysanthemum: "🌼",
  
  // Others
  mushroom: "🍄",
  bamboo: "🎋",
  
  // Default
  default: "🌱"
};

export const getCropIcon = (cropName: string): string => {
  const normalizedName = cropName.toLowerCase().trim();
  return cropIcons[normalizedName] || cropIcons.default;
};

export const getCropCategory = (cropName: string): string => {
  const normalizedName = cropName.toLowerCase();
  
  if (['rice', 'paddy', 'wheat', 'maize', 'millets', 'jowar', 'bajra', 'ragi'].includes(normalizedName)) {
    return 'Food Crops';
  }
  if (['gram', 'moong', 'lentil', 'green gram', 'black gram', 'red gram', 'chickpea'].includes(normalizedName)) {
    return 'Pulses';
  }
  if (['groundnut', 'peanut', 'mustard', 'sunflower', 'sesame'].includes(normalizedName)) {
    return 'Oilseeds';
  }
  if (['mango', 'banana', 'apple', 'orange', 'grapes', 'watermelon', 'papaya', 'guava', 'pomegranate'].includes(normalizedName)) {
    return 'Fruits';
  }
  if (['tomato', 'potato', 'onion', 'brinjal', 'okra', 'cabbage', 'cauliflower', 'carrot', 'beetroot', 'pumpkin', 'cucumber', 'spinach'].includes(normalizedName)) {
    return 'Vegetables';
  }
  if (['cotton', 'sugarcane', 'tobacco'].includes(normalizedName)) {
    return 'Commercial';
  }
  if (['coconut', 'tea', 'coffee', 'rubber'].includes(normalizedName)) {
    return 'Plantation';
  }
  if (['turmeric', 'ginger', 'pepper', 'chilli', 'coriander', 'cumin'].includes(normalizedName)) {
    return 'Spices';
  }
  if (['rose', 'marigold', 'jasmine', 'chrysanthemum'].includes(normalizedName)) {
    return 'Flowers';
  }
  
  return 'Other';
};

