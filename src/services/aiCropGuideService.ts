// Note: Crop data will be passed as parameter to functions instead of importing

export interface CropStageDetails {
  stage: string;
  duration: string;
  activities: string[];
  fertilizers: string[];
  wateringSchedule: string;
  commonIssues: string[];
  proTips: string[];
  costEstimate: string;
  expectedOutcome: string;
  criticalActions: string[];
}

export interface CropGuideData {
  cropName: string;
  scientificName: string;
  category: string;
  totalDuration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  profitPotential: number;
  stages: CropStageDetails[];
  seasonalConsiderations: string[];
  marketTiming: string;
  storageGuidelines: string[];
  valueAddition: string[];
  commonMistakes: string[];
  successFactors: string[];
}

export class AICropGuideService {
  // Basic crop information for guide generation
  private basicCropData: {[key: string]: any} = {
    'coriander': { duration: 45, category: 'leafy', waterRequirement: 'Low' },
    'spinach': { duration: 35, category: 'leafy', waterRequirement: 'Low' },
    'lettuce': { duration: 30, category: 'leafy', waterRequirement: 'Medium' },
    'radish': { duration: 25, category: 'root', waterRequirement: 'Low' },
    'fenugreek': { duration: 30, category: 'leafy', waterRequirement: 'Low' },
    'mustard': { duration: 40, category: 'leafy', waterRequirement: 'Low' },
    'mint': { duration: 35, category: 'herb', waterRequirement: 'Medium' },
    'tomato': { duration: 90, category: 'fruit', waterRequirement: 'High' },
    'chili': { duration: 120, category: 'fruit', waterRequirement: 'Medium' }
  };

  generateCropGuide(cropName: string): CropGuideData {
    const cropKey = cropName.toLowerCase().replace(/\s+/g, '');
    const cropData = this.basicCropData[cropKey] || { duration: 60, category: 'general', waterRequirement: 'Medium' };

    return this.generateDetailedGuide(cropName, cropData);
  }

  private generateDetailedGuide(cropName: string, cropData: any): CropGuideData {
    const crop = { name: cropName, ...cropData };
    const stages = this.generateGrowthStages(crop);
    
    return {
      cropName: cropName,
      scientificName: this.getScientificName(cropName),
      category: cropData.category,
      totalDuration: cropData.duration || 60,
      difficulty: this.assessDifficulty(crop),
      profitPotential: this.calculateProfit(crop),
      stages,
      seasonalConsiderations: this.generateSeasonalTips(crop),
      marketTiming: this.generateMarketTiming(crop),
      storageGuidelines: this.generateStorageGuidelines(crop),
      valueAddition: this.generateValueAddition(crop),
      commonMistakes: this.generateCommonMistakes(crop),
      successFactors: this.generateSuccessFactors(crop)
    };
  }

  private generateGrowthStages(crop: any): CropStageDetails[] {
    const totalDays = crop.duration || 60;
    const isLeafy = crop.category === 'leafy';
    const isRoot = crop.category === 'root';
    const isFruit = crop.category === 'fruit';
    const isMicrogreen = crop.name.toLowerCase().includes('microgreen');

    if (isMicrogreen) {
      return this.generateMicrogreenStages(crop);
    }

    if (isLeafy) {
      return this.generateLeafyStages(crop, totalDays);
    }

    if (isRoot) {
      return this.generateRootStages(crop, totalDays);
    }

    if (isFruit) {
      return this.generateFruitStages(crop, totalDays);
    }

    return this.generateGenericStages(crop, totalDays);
  }

  private generateMicrogreenStages(crop: any): CropStageDetails[] {
    return [
      {
        stage: "Preparation",
        duration: "Day 1-2",
        activities: [
          "Select organic, untreated seeds",
          "Prepare growing trays with drainage holes",
          "Mix coconut coir with perlite (70:30 ratio)",
          "Sterilize growing medium and trays",
          "Set up grow lights (LED panels)"
        ],
        fertilizers: ["No fertilizers needed", "Pure water only"],
        wateringSchedule: "Mist lightly twice daily",
        commonIssues: ["Contaminated seeds", "Poor drainage", "Insufficient light"],
        proTips: [
          "Use blackout period for first 3-4 days",
          "Maintain 65-75°F temperature",
          "Ensure 12-16 hours light exposure daily"
        ],
        costEstimate: "₹500-1000 per tray setup",
        expectedOutcome: "Seeds ready for soaking and sowing",
        criticalActions: ["Seed quality check", "Sterile environment setup"]
      },
      {
        stage: "Germination",
        duration: "Day 3-7",
        activities: [
          "Soak seeds for 8-12 hours",
          "Spread seeds evenly on growing medium",
          "Cover with another tray (blackout)",
          "Maintain consistent moisture",
          "Monitor temperature and humidity"
        ],
        fertilizers: ["Clean water only", "No nutrients required"],
        wateringSchedule: "Bottom watering twice daily",
        commonIssues: ["Mold growth", "Uneven germination", "Overwatering"],
        proTips: [
          "Use weight on top tray for even growth",
          "Check daily for germination signs",
          "Remove blackout when seeds sprout"
        ],
        costEstimate: "₹50-100 per batch (water/electricity)",
        expectedOutcome: "80-90% germination rate achieved",
        criticalActions: ["Moisture control", "Temperature maintenance"]
      },
      {
        stage: "Growth & Harvest",
        duration: "Day 8-14",
        activities: [
          "Remove blackout cover when cotyledons appear",
          "Provide full spectrum LED lighting",
          "Continue bottom watering schedule",
          "Monitor for first true leaves",
          "Harvest when 1-2 inches tall"
        ],
        fertilizers: ["Diluted liquid kelp (optional)", "Plain water preferred"],
        wateringSchedule: "Bottom water once daily, mist if needed",
        commonIssues: ["Leggy growth", "Yellowing", "Pest issues"],
        proTips: [
          "Harvest in morning for best quality",
          "Cut just above growing medium",
          "Pack immediately after harvest"
        ],
        costEstimate: "₹100-200 per harvest",
        expectedOutcome: `Fresh microgreens ready: ${crop.yield || '150-200g per tray'}`,
        criticalActions: ["Optimal harvest timing", "Proper cutting technique"]
      }
    ];
  }

  private generateLeafyStages(crop: any, totalDays: number): CropStageDetails[] {
    return [
      {
        stage: "Land Preparation",
        duration: "Day 1-7",
        activities: [
          "Deep plowing to 6-8 inches depth",
          "Add aged farmyard manure (5-7 tons/acre)",
          "Level the field properly",
          "Create raised beds if needed",
          "Install drip irrigation system"
        ],
        fertilizers: [
          "Farmyard manure: 5-7 tons/acre",
          "Neem cake: 200-300 kg/acre",
          "Rock phosphate: 100 kg/acre"
        ],
        wateringSchedule: "Pre-irrigation 3-4 days before sowing",
        commonIssues: ["Poor drainage", "Weed growth", "Soil compaction"],
        proTips: [
          "Test soil pH (should be 6.0-7.5)",
          "Ensure good drainage to prevent root rot",
          "Use plastic mulch for weed control"
        ],
        costEstimate: "₹8,000-12,000 per acre",
        expectedOutcome: "Well-prepared, fertile seedbed ready",
        criticalActions: ["Soil testing", "Organic matter incorporation"]
      },
      {
        stage: "Sowing & Early Growth",
        duration: `Day 8-${Math.floor(totalDays * 0.4)}`,
        activities: [
          "Direct seed sowing in rows",
          "Maintain 15-20cm row spacing",
          "Light irrigation after sowing",
          "Monitor germination (5-7 days)",
          "First weeding after 15 days"
        ],
        fertilizers: [
          "NPK 19:19:19 @ 50kg/acre",
          "Urea @ 25kg/acre (if nitrogen deficient)",
          "Micronutrient spray (Zinc, Boron)"
        ],
        wateringSchedule: "Light daily watering for first week, then alternate days",
        commonIssues: ["Poor germination", "Damping off", "Pest attacks"],
        proTips: [
          "Use treated seeds to prevent diseases",
          "Thin overcrowded seedlings",
          "Apply neem oil spray for pest prevention"
        ],
        costEstimate: "₹3,000-5,000 per acre",
        expectedOutcome: "Healthy seedling establishment (80-85%)",
        criticalActions: ["Timely sowing", "Moisture management"]
      },
      {
        stage: "Vegetative Growth",
        duration: `Day ${Math.floor(totalDays * 0.4) + 1}-${Math.floor(totalDays * 0.8)}`,
        activities: [
          "Regular weeding and hoeing",
          "Side dressing with nitrogen fertilizer",
          "Monitor for nutrient deficiencies",
          "Pest and disease management",
          "First harvest of baby leaves (optional)"
        ],
        fertilizers: [
          "Urea @ 30-40kg/acre (split application)",
          "NPK 12:32:16 @ 75kg/acre",
          "Foliar spray of 19:19:19 @ 0.5%"
        ],
        wateringSchedule: "Every 2-3 days or as needed (soil moisture check)",
        commonIssues: ["Nutrient deficiency", "Aphid attack", "Leaf spot diseases"],
        proTips: [
          "Harvest outer leaves first for continuous production",
          "Use yellow sticky traps for aphid control",
          "Maintain proper plant spacing for air circulation"
        ],
        costEstimate: "₹4,000-6,000 per acre",
        expectedOutcome: `Vigorous vegetative growth, ready for harvesting`,
        criticalActions: ["Nutrient monitoring", "Pest surveillance"]
      },
      {
        stage: "Harvest & Post-Harvest",
        duration: `Day ${Math.floor(totalDays * 0.8) + 1}-${totalDays}`,
        activities: [
          "Early morning harvest for freshness",
          "Cut-and-come-again harvesting",
          "Proper washing and packaging",
          "Cold storage if needed",
          "Direct market sales preparation"
        ],
        fertilizers: [
          "Light nitrogen spray if regrowth desired",
          "Potassium sulfate for quality improvement"
        ],
        wateringSchedule: "Reduce watering 2-3 days before harvest",
        commonIssues: ["Post-harvest wilting", "Quality deterioration", "Market timing"],
        proTips: [
          "Harvest when leaves are tender and young",
          "Use sharp knives for clean cuts",
          "Pack in perforated plastic bags",
          "Sell within 24-48 hours for best prices"
        ],
        costEstimate: "₹2,000-3,000 per acre (harvest & packaging)",
        expectedOutcome: `${crop.yield || '6-10 tons/acre'} of fresh, marketable produce`,
        criticalActions: ["Optimal harvest timing", "Quality maintenance"]
      }
    ];
  }

  private generateRootStages(crop: any, totalDays: number): CropStageDetails[] {
    return [
      {
        stage: "Soil Preparation",
        duration: "Day 1-5",
        activities: [
          "Deep tillage to 10-12 inches (loose soil essential)",
          "Remove stones and debris for straight roots",
          "Add well-decomposed compost",
          "Create fine tilth for easy root penetration",
          "Form raised beds for better drainage"
        ],
        fertilizers: [
          "Well-decomposed FYM: 8-10 tons/acre",
          "Single super phosphate: 150kg/acre",
          "Potash: 100kg/acre"
        ],
        wateringSchedule: "Pre-sowing irrigation 2-3 days before",
        commonIssues: ["Compacted soil", "Poor drainage", "Root rot potential"],
        proTips: [
          "Avoid fresh manure (causes forking)",
          "Ensure pH 6.0-7.0 for best results",
          "Double dig method for better soil structure"
        ],
        costEstimate: "₹6,000-8,000 per acre",
        expectedOutcome: "Deep, loose, well-drained seedbed",
        criticalActions: ["Deep cultivation", "Organic matter incorporation"]
      },
      {
        stage: "Sowing & Germination",
        duration: "Day 6-15",
        activities: [
          "Direct sowing in rows (avoid transplanting)",
          "Maintain proper seed depth (2-3 times seed size)",
          "Ensure uniform seed distribution",
          "Light mulching to retain moisture",
          "Monitor germination percentage"
        ],
        fertilizers: [
          "Starter fertilizer: NPK 10:26:26 @ 100kg/acre",
          "Biofertilizer inoculation of seeds"
        ],
        wateringSchedule: "Light sprinkler irrigation daily until germination",
        commonIssues: ["Poor germination", "Seed rot", "Uneven emergence"],
        proTips: [
          "Use pelleted seeds for uniform sowing",
          "Maintain soil moisture but avoid waterlogging",
          "Thin overcrowded seedlings early"
        ],
        costEstimate: "₹2,500-3,500 per acre",
        expectedOutcome: "Uniform stand establishment (85-90%)",
        criticalActions: ["Proper sowing depth", "Moisture management"]
      },
      {
        stage: "Root Development",
        duration: `Day 16-${Math.floor(totalDays * 0.7)}`,
        activities: [
          "Regular weeding (avoid deep cultivation near roots)",
          "Side dressing with balanced fertilizer",
          "Monitor root shape and development",
          "Pest management (root flies, aphids)",
          "Earthing up if needed"
        ],
        fertilizers: [
          "NPK 19:19:19 @ 50kg/acre (split doses)",
          "Calcium chloride for root quality",
          "Boron spray @ 0.2% for root development"
        ],
        wateringSchedule: "Deep watering twice weekly (encourage deep roots)",
        commonIssues: ["Root splitting", "Pest damage", "Nutrient deficiency"],
        proTips: [
          "Maintain consistent soil moisture",
          "Use row covers for pest protection",
          "Avoid nitrogen excess (causes leafy growth)"
        ],
        costEstimate: "₹3,000-4,000 per acre",
        expectedOutcome: "Strong root system development",
        criticalActions: ["Consistent moisture", "Balanced nutrition"]
      },
      {
        stage: "Maturation & Harvest",
        duration: `Day ${Math.floor(totalDays * 0.7) + 1}-${totalDays}`,
        activities: [
          "Monitor root size and maturity",
          "Reduce watering before harvest",
          "Careful harvesting to avoid damage",
          "Washing and grading by size",
          "Bundle or pack for market"
        ],
        fertilizers: [
          "Potassium sulfate for root quality",
          "Stop nitrogen application 10 days before harvest"
        ],
        wateringSchedule: "Minimal watering in last week",
        commonIssues: ["Cracking", "Woody texture", "Market timing"],
        proTips: [
          "Harvest when roots reach desired size",
          "Morning harvest for better storage life",
          "Remove tops immediately after harvest",
          "Grade by size for better market prices"
        ],
        costEstimate: "₹2,500-4,000 per acre (harvest & processing)",
        expectedOutcome: `${crop.yield || '15-20 tons/acre'} of quality roots`,
        criticalActions: ["Optimal harvest timing", "Careful handling"]
      }
    ];
  }

  private generateFruitStages(crop: any, totalDays: number): CropStageDetails[] {
    return [
      {
        stage: "Field Preparation",
        duration: "Day 1-10",
        activities: [
          "Deep plowing and harrowing",
          "Installation of trellising system",
          "Bed preparation with proper spacing",
          "Drip irrigation setup",
          "Mulching preparation"
        ],
        fertilizers: [
          "Farmyard manure: 10-15 tons/acre",
          "NPK 12:32:16 @ 200kg/acre (basal)",
          "Calcium and magnesium supplements"
        ],
        wateringSchedule: "Pre-planting irrigation for soil settlement",
        commonIssues: ["Poor soil structure", "Drainage problems", "Pest carryover"],
        proTips: [
          "Install support systems before planting",
          "Test soil for nematodes",
          "Use certified disease-free seeds"
        ],
        costEstimate: "₹15,000-25,000 per acre",
        expectedOutcome: "Complete field setup with support systems",
        criticalActions: ["Infrastructure setup", "Soil preparation"]
      },
      {
        stage: "Planting & Establishment",
        duration: "Day 11-25",
        activities: [
          "Transplanting or direct seeding",
          "Installing plant supports",
          "Mulching around plants",
          "First watering and fertilization",
          "Disease prevention sprays"
        ],
        fertilizers: [
          "Starter fertilizer: NPK 19:19:19 @ 25kg/acre",
          "Phosphorus boost: DAP @ 50kg/acre",
          "Micronutrient complex spray"
        ],
        wateringSchedule: "Daily light irrigation for establishment",
        commonIssues: ["Transplant shock", "Damping off", "Poor establishment"],
        proTips: [
          "Plant in evening or cloudy weather",
          "Provide shade for first few days",
          "Monitor for early pest problems"
        ],
        costEstimate: "₹5,000-8,000 per acre",
        expectedOutcome: "95% plant establishment success",
        criticalActions: ["Careful transplanting", "Early protection"]
      },
      {
        stage: "Vegetative Growth",
        duration: `Day 26-${Math.floor(totalDays * 0.5)}`,
        activities: [
          "Regular training and pruning",
          "Side dressing with nutrients",
          "Pest and disease monitoring",
          "Water and nutrient management",
          "Flower bud formation monitoring"
        ],
        fertilizers: [
          "Urea @ 100kg/acre (split application)",
          "NPK 13:00:45 @ 75kg/acre",
          "Calcium nitrate @ 50kg/acre"
        ],
        wateringSchedule: "Every 2-3 days depending on weather",
        commonIssues: ["Excessive vegetative growth", "Pest buildup", "Nutrient imbalance"],
        proTips: [
          "Prune suckers regularly",
          "Use IPM for pest control",
          "Monitor plant nutrition status"
        ],
        costEstimate: "₹8,000-12,000 per acre",
        expectedOutcome: "Strong vegetative framework established",
        criticalActions: ["Training and pruning", "Nutrition balance"]
      },
      {
        stage: "Flowering & Fruit Set",
        duration: `Day ${Math.floor(totalDays * 0.5) + 1}-${Math.floor(totalDays * 0.8)}`,
        activities: [
          "Pollination support (bee boxes if needed)",
          "Flower and fruit monitoring",
          "Calcium sprays for fruit quality",
          "Pest control during flowering",
          "First fruit harvest begins"
        ],
        fertilizers: [
          "High potash fertilizer: NPK 00:52:34 @ 100kg/acre",
          "Calcium chloride foliar spray @ 0.5%",
          "Boron spray for fruit set @ 0.1%"
        ],
        wateringSchedule: "Consistent moisture critical - no water stress",
        commonIssues: ["Poor fruit set", "Flower drop", "Calcium deficiency"],
        proTips: [
          "Avoid overhead watering during flowering",
          "Use mulch to maintain soil moisture",
          "Hand pollination if needed"
        ],
        costEstimate: "₹6,000-10,000 per acre",
        expectedOutcome: "Good fruit set (70-80% of flowers)",
        criticalActions: ["Pollination support", "Calcium management"]
      },
      {
        stage: "Fruit Development & Harvest",
        duration: `Day ${Math.floor(totalDays * 0.8) + 1}-${totalDays + 30}`,
        activities: [
          "Regular harvesting (every 2-3 days)",
          "Fruit grading and packaging",
          "Continued plant nutrition",
          "Post-harvest handling",
          "Market preparation and sales"
        ],
        fertilizers: [
          "Potassium sulfate @ 50kg/acre",
          "Liquid fertilizer through drip @ weekly",
          "Foliar nutrition for fruit quality"
        ],
        wateringSchedule: "Maintain consistent moisture for fruit quality",
        commonIssues: ["Fruit cracking", "Quality deterioration", "Post-harvest losses"],
        proTips: [
          "Harvest at right maturity for market",
          "Use proper containers to avoid bruising",
          "Maintain cold chain if possible",
          "Plan harvesting for peak market prices"
        ],
        costEstimate: "₹8,000-15,000 per acre (harvest period)",
        expectedOutcome: `${crop.yield || '15-25 tons/acre'} over harvest period`,
        criticalActions: ["Optimal harvest timing", "Quality maintenance"]
      }
    ];
  }

  private generateGenericStages(crop: any, totalDays: number): CropStageDetails[] {
    // Fallback for crops not specifically categorized
    return [
      {
        stage: "Preparation",
        duration: `Day 1-${Math.floor(totalDays * 0.15)}`,
        activities: [
          "Land preparation and soil testing",
          "Organic matter incorporation",
          "Irrigation system setup",
          "Quality seed/planting material procurement"
        ],
        fertilizers: ["Farmyard manure", "Basal fertilizer application"],
        wateringSchedule: "Pre-planting irrigation as needed",
        commonIssues: ["Poor soil preparation", "Quality of inputs"],
        proTips: ["Always test soil before starting", "Use certified seeds"],
        costEstimate: "₹8,000-15,000 per acre",
        expectedOutcome: "Field ready for planting",
        criticalActions: ["Soil testing", "Quality input procurement"]
      },
      {
        stage: "Establishment",
        duration: `Day ${Math.floor(totalDays * 0.15) + 1}-${Math.floor(totalDays * 0.4)}`,
        activities: [
          "Sowing or transplanting",
          "Initial care and protection",
          "Weed management",
          "Early nutrition"
        ],
        fertilizers: ["Starter fertilizer", "Growth promoters"],
        wateringSchedule: "Regular light irrigation",
        commonIssues: ["Poor germination", "Pest attack"],
        proTips: ["Monitor daily for first 2 weeks", "Maintain consistent moisture"],
        costEstimate: "₹4,000-8,000 per acre",
        expectedOutcome: "Good crop establishment",
        criticalActions: ["Consistent care", "Early protection"]
      },
      {
        stage: "Growth",
        duration: `Day ${Math.floor(totalDays * 0.4) + 1}-${Math.floor(totalDays * 0.8)}`,
        activities: [
          "Nutrient management",
          "Pest and disease control",
          "Growth monitoring",
          "Canopy management"
        ],
        fertilizers: ["Growth stage specific fertilizers", "Micronutrients"],
        wateringSchedule: "Based on crop water requirement",
        commonIssues: ["Nutrient deficiency", "Pest buildup"],
        proTips: ["Regular monitoring", "Balanced nutrition"],
        costEstimate: "₹6,000-12,000 per acre",
        expectedOutcome: "Healthy crop development",
        criticalActions: ["Nutrition monitoring", "Pest management"]
      },
      {
        stage: "Harvest",
        duration: `Day ${Math.floor(totalDays * 0.8) + 1}-${totalDays}`,
        activities: [
          "Maturity assessment",
          "Proper harvesting technique",
          "Post-harvest handling",
          "Marketing"
        ],
        fertilizers: ["Quality enhancing nutrients"],
        wateringSchedule: "Reduce before harvest",
        commonIssues: ["Timing", "Quality loss"],
        proTips: ["Right maturity", "Proper handling"],
        costEstimate: "₹3,000-8,000 per acre",
        expectedOutcome: `${crop.yield || 'Expected yield achieved'}`,
        criticalActions: ["Optimal timing", "Quality preservation"]
      }
    ];
  }

  private assessDifficulty(crop: any): 'Easy' | 'Medium' | 'Hard' {
    if (crop.category === 'Leafy Greens' || crop.maturityDays <= 45) return 'Easy';
    if (crop.maturityDays <= 90) return 'Medium';
    return 'Hard';
  }

  private calculateProfit(crop: any): number {
    return crop.profitPerAcre || Math.floor(Math.random() * 200000) + 100000;
  }

  private generateSeasonalTips(crop: any): string[] {
    const isWinterCrop = ['coriander', 'spinach', 'radish', 'fenugreek'].some(name => 
      crop.name.toLowerCase().includes(name)
    );
    
    if (isWinterCrop) {
      return [
        "Best grown during November-February for optimal quality",
        "Protect from frost using row covers or plastic tunnels",
        "Morning sunlight is crucial for good growth",
        "Reduce watering frequency in winter months",
        "Watch for aphid buildup during cool weather"
      ];
    }

    return [
      "Monitor seasonal weather patterns for optimal planting",
      "Adjust irrigation based on monsoon predictions",
      "Use season-appropriate varieties",
      "Plan harvest timing with market demand peaks"
    ];
  }

  private generateMarketTiming(crop: any): string {
    const cropName = crop.name.toLowerCase();
    
    if (cropName.includes('coriander')) {
      return "Peak demand during wedding season (Nov-Feb) and festivals. Fresh leaves command ₹40-60/kg, seeds ₹80-120/kg";
    }
    
    if (cropName.includes('spinach')) {
      return "Steady demand year-round. Premium prices ₹30-50/kg for organic. Restaurant supply contracts available";
    }
    
    if (cropName.includes('microgreen')) {
      return "High-end restaurants pay ₹500-800/kg. Growing urban health-conscious market. 5-star hotel contracts";
    }

    return "Monitor local market prices and seasonal demand patterns for optimal selling time";
  }

  private generateStorageGuidelines(crop: any): string[] {
    const cropName = crop.name.toLowerCase();
    
    if (cropName.includes('leafy') || crop.category === 'Leafy Greens') {
      return [
        "Harvest in early morning for maximum freshness",
        "Cool immediately after harvest (4-7°C)",
        "Store in perforated plastic bags",
        "Maintain 90-95% humidity",
        "Shelf life: 7-10 days under proper storage"
      ];
    }

    return [
      "Follow proper post-harvest handling procedures",
      "Maintain appropriate temperature and humidity",
      "Use suitable packaging materials",
      "Monitor storage conditions regularly"
    ];
  }

  private generateValueAddition(crop: any): string[] {
    const cropName = crop.name.toLowerCase();
    
    if (cropName.includes('coriander')) {
      return [
        "Dried coriander powder (₹200-300/kg)",
        "Fresh herb paste/chutney (₹150-200/kg)",
        "Seed oil extraction for cosmetics",
        "Organic certification adds 30-40% premium"
      ];
    }

    if (cropName.includes('spinach')) {
      return [
        "Frozen spinach cubes for retail",
        "Dehydrated spinach powder",
        "Baby food processing contracts",
        "Juice extraction for health drinks"
      ];
    }

    return [
      "Explore processing opportunities",
      "Develop direct marketing channels",
      "Consider organic certification",
      "Value-added product development"
    ];
  }

  private generateCommonMistakes(crop: any): string[] {
    return [
      "Over-watering leading to root problems",
      "Using excessive nitrogen causing pest issues",
      "Harvesting too late reducing quality",
      "Ignoring soil testing before planting",
      "Poor post-harvest handling causing losses",
      "Not planning market timing properly"
    ];
  }

  private generateSuccessFactors(crop: any): string[] {
    return [
      "Quality seed/planting material selection",
      "Proper soil preparation and nutrition",
      "Timely pest and disease management",
      "Consistent irrigation scheduling",
      "Regular crop monitoring and care",
      "Strategic market timing and planning",
      "Good post-harvest handling practices"
    ];
  }

  private getScientificName(cropName: string): string {
    const scientificNames: { [key: string]: string } = {
      'coriander': 'Coriandrum sativum',
      'spinach': 'Spinacia oleracea',
      'radish': 'Raphanus sativus',
      'fenugreek': 'Trigonella foenum-graecum',
      'okra': 'Abelmoschus esculentus',
      'cucumber': 'Cucumis sativus',
      'beetroot': 'Beta vulgaris',
      'amaranthus': 'Amaranthus dubius',
      'microgreens': 'Mixed varieties'
    };

    const key = Object.keys(scientificNames).find(name => 
      cropName.toLowerCase().includes(name)
    );
    
    return key ? scientificNames[key] : 'Scientific name varies';
  }

  private generateGenericGuide(cropName: string): CropGuideData {
    return {
      cropName,
      scientificName: 'Consult agricultural expert',
      category: 'General',
      totalDuration: 60,
      difficulty: 'Medium',
      profitPotential: 150000,
      stages: this.generateGenericStages({ name: cropName }, 60),
      seasonalConsiderations: ["Consult local agricultural extension officer"],
      marketTiming: "Research local market conditions",
      storageGuidelines: ["Follow standard post-harvest practices"],
      valueAddition: ["Explore local processing opportunities"],
      commonMistakes: ["Lack of proper planning and research"],
      successFactors: ["Knowledge, planning, and consistent execution"]
    };
  }

  // Quick access methods for different content types
  getFertilizerSchedule(cropName: string, stage: string): string[] {
    const guide = this.generateCropGuide(cropName);
    const stageData = guide.stages.find(s => s.stage.toLowerCase().includes(stage.toLowerCase()));
    return stageData?.fertilizers || [];
  }

  getStageActivities(cropName: string, stage: string): string[] {
    const guide = this.generateCropGuide(cropName);
    const stageData = guide.stages.find(s => s.stage.toLowerCase().includes(stage.toLowerCase()));
    return stageData?.activities || [];
  }

  getProTips(cropName: string, stage?: string): string[] {
    const guide = this.generateCropGuide(cropName);
    if (stage) {
      const stageData = guide.stages.find(s => s.stage.toLowerCase().includes(stage.toLowerCase()));
      return stageData?.proTips || [];
    }
    return guide.successFactors;
  }
}

export const aiCropGuideService = new AICropGuideService();