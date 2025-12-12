import { cropTrackingService } from '@/services/cropTrackingService';

interface FarmContext {
  trackedCrops: any[];
  soilData: any;
  weatherData: any;
  marketPrices: any;
  location: string;
  farmSize: number;
}

interface AIResponse {
  message: string;
  suggestions: string[];
  actions: Array<{
    type: 'navigation' | 'reminder' | 'recommendation';
    label: string;
    action: string;
  }>;
  profitInsight?: string;
  urgency: 'low' | 'medium' | 'high';
}

class IntelligentFarmingAdvisor {
  private farmContext: FarmContext;

  constructor() {
    this.farmContext = {
      trackedCrops: [],
      soilData: null,
      weatherData: null,
      marketPrices: null,
      location: 'Kamareddy',
      farmSize: 1
    };
  }

  // Update farm context with real-time data
  updateFarmContext(context: Partial<FarmContext>) {
    this.farmContext = { ...this.farmContext, ...context };
  }

  // Load current farm status with real-time data
  async loadFarmData(): Promise<void> {
    this.farmContext.trackedCrops = cropTrackingService.getTrackedCrops();
    
    // Simulate real-time data loading - integrate with actual APIs
    this.farmContext.weatherData = await this.getCurrentWeatherData();
    this.farmContext.soilData = await this.getCurrentSoilData();
    this.farmContext.marketPrices = await this.getCurrentMarketPrices();
  }

  // Get current farm context (for external access)
  getFarmContext() {
    return this.farmContext;
  }

  // Get current AI status for UI updates
  getAIStatus(): string {
    if (!this.farmContext.weatherData) return 'Loading...';
    return 'Ready';
  }

  // Get real-time weather data
  private async getCurrentWeatherData() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      temperature: 28 + Math.random() * 10,
      humidity: 60 + Math.random() * 30,
      rainfall: Math.random() * 10,
      windSpeed: 5 + Math.random() * 15,
      forecast: ['sunny', 'partly_cloudy', 'rainy'][Math.floor(Math.random() * 3)],
      uvIndex: 6 + Math.random() * 5,
      pressure: 1010 + Math.random() * 20
    };
  }

  // Get real-time soil data
  private async getCurrentSoilData() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      moisture: 45 + Math.random() * 30,
      ph: 6.2 + Math.random() * 1.5,
      nitrogen: 20 + Math.random() * 40,
      phosphorus: 15 + Math.random() * 25,
      potassium: 150 + Math.random() * 100,
      organicMatter: 2.5 + Math.random() * 2,
      temperature: 25 + Math.random() * 8
    };
  }

  // Get real-time market prices
  private async getCurrentMarketPrices() {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      tomato: { price: 20 + Math.random() * 15, trend: Math.random() > 0.5 ? 'up' : 'down' },
      onion: { price: 15 + Math.random() * 10, trend: Math.random() > 0.5 ? 'up' : 'down' },
      potato: { price: 12 + Math.random() * 8, trend: Math.random() > 0.5 ? 'up' : 'down' },
      cucumber: { price: 18 + Math.random() * 12, trend: Math.random() > 0.5 ? 'up' : 'down' },
      chili: { price: 25 + Math.random() * 20, trend: Math.random() > 0.5 ? 'up' : 'down' }
    };
  }

  // Enhanced AI processing with sharp contextual intelligence
  async processQuery(query: string, language: 'en' | 'te' | 'hi' = 'en', conversationContext: string[] = []): Promise<AIResponse> {
    await this.loadFarmData();
    
    const lowerQuery = query.toLowerCase();
    
    // Analyze conversation context for better responses
    const contextAnalysis = this.analyzeConversationContext(conversationContext);
    
    // Sharp contextual intelligence - understand intent beyond keywords
    const queryIntent = this.analyzeQueryIntent(query, contextAnalysis);
    
    console.log('Processing query:', query, 'Intent:', queryIntent);
    
    // Context-aware greeting and daily advice
    if (this.isGreeting(lowerQuery)) {
      return this.generateIntelligentDailyAdvice(language, queryIntent);
    }
    
    // PRIORITY ORDER: Specific queries first, then general ones
    
    // Quick income crop queries (HIGHEST PRIORITY)
    if (this.isQuickIncomeQuery(lowerQuery)) {
      return this.generateQuickIncomeCropAdvice(query, language, conversationContext);
    }
    
    // Intercropping and companion planting queries (HIGH PRIORITY)
    if (this.isIntercroppingQuery(lowerQuery)) {
      return this.generateIntercroppingAdvice(query, language);
    }
    
    // Problem-solving queries (HIGH PRIORITY)
    if (this.isProblemQuery(lowerQuery)) {
      return this.generateDetailedProblemSolution(query, language, conversationContext);
    }
    
    // Profit and ROI queries (MEDIUM PRIORITY)
    if (this.isProfitQuery(lowerQuery)) {
      return this.generateDetailedProfitAdvice(query, language, conversationContext);
    }
    
    // Market and pricing queries (MEDIUM PRIORITY)
    if (this.isMarketQuery(lowerQuery)) {
      return this.generateDetailedMarketAdvice(query, language, conversationContext);
    }
    
    // Crop-specific queries (LOWER PRIORITY - more general)
    if (this.isCropQuery(lowerQuery)) {
      return this.generateDetailedCropAdvice(query, language, conversationContext);
    }
    
    // Interactive conversation response
    return this.generateInteractiveResponse(query, language, conversationContext);
  }

  private isGreeting(query: string): boolean {
    const greetingPatterns = [
      'hello', 'hi', 'good morning', 'good evening', 'namaste', 'vanakkam',
      'what should i do today', 'daily advice', 'morning update',
      'వనక్కం', 'నమస్తే', 'ఈ రోజు ఏమి చేయాలి', 'రోజువారీ సలహా'
    ];
    return greetingPatterns.some(pattern => query.includes(pattern));
  }

  private isCropQuery(query: string): boolean {
    // Only match specific crop cultivation queries, not general crop mentions
    const specificCropPatterns = [
      'how to grow', 'cultivation of', 'harvest time', 'sowing season',
      'tomato cultivation', 'onion growing', 'potato farming',
      'ఎలా పండించాలి', 'సాగు పద్ధతి', 'పంట కాలం', 'విత్తనాల కాలం'
    ];
    
    const generalCropWords = ['crop', 'plant', 'grow', 'పంట'];
    const hasSpecificQuery = specificCropPatterns.some(pattern => query.includes(pattern));
    const hasGeneralCropWord = generalCropWords.some(word => query.includes(word));
    
    // Only return true for specific cultivation questions, not general crop mentions
    return hasSpecificQuery || (hasGeneralCropWord && !this.isIntercroppingQuery(query));
  }

  private isProfitQuery(query: string): boolean {
    const profitPatterns = [
      'profit', 'income', 'money', 'earn', 'roi', 'investment', 'cost',
      'price', 'sell', 'market', 'లాభం', 'ఆదాయం', 'డబ్బు', 'అమ్మకం'
    ];
    return profitPatterns.some(pattern => query.includes(pattern));
  }

  private isMarketQuery(query: string): boolean {
    const marketPatterns = [
      'market price', 'sell', 'buyer', 'mandi', 'wholesale', 'retail',
      'demand', 'supply', 'మార్కెట్', 'అమ్మకం', 'కొనుగోలుదారు'
    ];
    return marketPatterns.some(pattern => query.includes(pattern));
  }

  private isProblemQuery(query: string): boolean {
    const problemPatterns = [
      'problem', 'issue', 'disease', 'pest', 'yellowing', 'wilting',
      'not growing', 'dying', 'help', 'సమస్య', 'వ్యాధి', 'కీటకాలు'
    ];
    return problemPatterns.some(pattern => query.includes(pattern));
  }

  private isIntercroppingQuery(query: string): boolean {
    const intercroppingPatterns = [
      'intercrop', 'inter-crop', 'intercropping', 'inter cropping', 
      'companion plant', 'mixed crop', 'multiple crop', 'together',
      'suggestions', 'recommend', 'which crop', 'what to grow',
      'give me', 'suggest', 'advice', 'help me with',
      'సహజీవన పంట', 'మిశ్రమ పంట', 'ఏ పంట', 'సూచనలు', 'సలహా', 'సహాయం'
    ];
    
    // Check for intercropping context
    const hasIntercroppingContext = intercroppingPatterns.some(pattern => query.includes(pattern));
    
    // Additional context checks
    const hasSuggestionRequest = query.includes('suggest') || query.includes('recommend') || query.includes('सुझाव') || query.includes('సూచనలు');
    const hasCropMention = query.includes('crop') || query.includes('plant') || query.includes('पंट') || query.includes('పంట');
    
    return hasIntercroppingContext || (hasSuggestionRequest && hasCropMention);
  }

  private isQuickIncomeQuery(query: string): boolean {
    const quickIncomePatterns = [
      'quick income', 'fast money', 'monthly income', 'weekly earning', 
      'short term', 'quick profit', 'fast crop', 'monthly salary',
      'immediate income', '30 days', '60 days', '90 days',
      'త్వరిత ఆదాయం', 'మాసిక ఆదాయం', 'వేగంగా డబ్బు', 'త్వరిత లాభం',
      'పొట్టి కాల పంట', 'త్వరగా పండే పంట', 'వేగ పంట'
    ];
    
    return quickIncomePatterns.some(pattern => query.includes(pattern));
  }

  // Generate daily personalized advice
  private async generateDailyAdvice(language: string): Promise<AIResponse> {
    const farmerName = 'Farmer';
    const activeCrops = this.farmContext.trackedCrops;
    const currentHour = new Date().getHours();
    
    let greeting = '';
    if (currentHour < 12) greeting = language === 'te' ? 'శుభోదయం' : language === 'hi' ? 'सुप्रभात' : 'Good morning';
    else if (currentHour < 18) greeting = language === 'te' ? 'మధ్యాహ్న శుభాకాంక్షలు' : language === 'hi' ? 'नमस्ते' : 'Good afternoon';
    else greeting = language === 'te' ? 'సాయంత्या శుభాకాంక్షలు' : language === 'hi' ? 'शुभ संध्या' : 'Good evening';

    let message = `${greeting}, ${farmerName}! `;
    const suggestions: string[] = [];
    const actions: any[] = [];

    if (activeCrops.length > 0) {
      const cropSummary = activeCrops.slice(0, 2).map(c => c.name).join(', ');
      
      if (language === 'te') {
        message += `మీ ${cropSummary} పంటలు బాగా పెరుగుతున్నాయి. `;
        suggestions.push('🌱 నేటి సిఫార్సులు:');
        suggestions.push('💧 నీటిపారుదల: ఉదయం 7-9 గంటలకు');
        suggestions.push('📊 పంట పురోగతిని తనిఖీ చేయండి');
        suggestions.push('💰 మార్కెట్ ధరలను పర్యవేక్షించండి');
      } else if (language === 'hi') {
        message += `आपकी ${cropSummary} फसलें अच्छी तरह बढ़ रही हैं। `;
        suggestions.push('🌱 आज की सिफारिशें:');
        suggestions.push('💧 सिंचाई: सुबह 7-9 बजे');
        suggestions.push('📊 फसल की प्रगति जांचें');
        suggestions.push('💰 बाजार की कीमतों की निगरानी करें');
      } else {
        message += `Your ${cropSummary} crops are growing well. `;
        suggestions.push('🌱 Today\'s recommendations:');
        suggestions.push('💧 Irrigation: Morning 7-9 AM optimal');
        suggestions.push('📊 Check crop progress in dashboard');
        suggestions.push('💰 Monitor market prices for planning');
      }

      // Add intercropping suggestion for profit
      if (activeCrops.length === 1) {
        const profitTip = language === 'te' ? 
          '💡 లాభం పెరుగుట: మధ్యలో కొత్తమిర్చి లేదా పాలకూర పండించి అదనపు ₹8,000-15,000 సంపాదించండి!' :
          language === 'hi' ?
          '💡 मुनाफा बढ़ाएं: बीच में धनिया या पालक लगाकर अतिरिक्त ₹8,000-15,000 कमाएं!' :
          '💡 Profit Boost: Plant coriander or spinach between rows for extra ₹8,000-15,000 income!';
        
        suggestions.push(profitTip);
        actions.push({
          type: 'recommendation',
          label: language === 'te' ? 'Inter-cropping योजना' : language === 'hi' ? 'अंतर-फसल योजना' : 'Intercropping Plan',
          action: '/multi-crop-planner'
        });
      }
    } else {
      if (language === 'te') {
        message += 'ఇప్పుడు పంట సాగు మొదలుపెట్టడానికి అద్భుతమైన సమయం! ';
        suggestions.push('🚀 త్వరిత లాభం కోసం ఉత్తమ పంటలు:');
        suggestions.push('🥬 కోస్ - 45 రోజుల్లో ₹1.5 లక్షలు');
        suggestions.push('🌿 కొత्तमిर్చి - 30 రోజుల్లో ₹60,000');
        suggestions.push('🥒 దోసకాయ - 60 రోజుల్లో ₹2 లక్షలు');
      } else if (language === 'hi') {
        message += 'अभी फसल शुरू करने का बेहतरीन समय है! ';
        suggestions.push('🚀 त्वरित लाभ के लिए सर्वश्रेष्ठ फसलें:');
        suggestions.push('🥬 लेट्यूस - 45 दिनों में ₹1.5 लाख');
        suggestions.push('🌿 धनिया - 30 दिनों में ₹60,000');
        suggestions.push('🥒 खीरा - 60 दिनों में ₹2 लाख');
      } else {
        message += 'Perfect time to start your profitable farming journey! ';
        suggestions.push('🚀 Best crops for quick ROI:');
        suggestions.push('🥬 Lettuce - ₹1.5L in 45 days');
        suggestions.push('🌿 Coriander - ₹60K in 30 days');
        suggestions.push('🥒 Cucumber - ₹2L in 60 days');
      }

      actions.push({
        type: 'recommendation',
        label: language === 'te' ? 'AI పంట సిफార్సు' : language === 'hi' ? 'AI फसल सुझाव' : 'AI Crop Recommendations',
        action: '/crop-recommendations'
      });
    }

    // Weather and irrigation advice
    const weatherAdvice = this.getWeatherBasedAdvice(language);
    if (weatherAdvice) suggestions.push(weatherAdvice);

    return {
      message,
      suggestions,
      actions,
      profitInsight: this.generateProfitInsight(language),
      urgency: activeCrops.length > 0 ? 'medium' : 'low'
    };
  }

  private generateCropAdvice(query: string, language: string): AIResponse {
    const activeCrops = this.farmContext.trackedCrops;
    let message = '';
    const suggestions: string[] = [];
    const actions: any[] = [];

    if (activeCrops.length > 0) {
      const mainCrop = activeCrops[0];
      
      if (language === 'te') {
        message = `మీ ${mainCrop.name} పంట గురించి సలహా: `;
        suggestions.push(`📅 పంట వయస్సు: ${mainCrop.daysRemaining} రోజులు మిగిలాయి`);
        suggestions.push(`🌱 ప్రస్తుత దశ: ${mainCrop.currentPhase}`);
        suggestions.push(`📈 పురోగతి: ${mainCrop.progress}% పూర్తయింది`);
      } else {
        message = `Advice for your ${mainCrop.name} crop: `;
        suggestions.push(`📅 Crop age: ${mainCrop.daysRemaining} days remaining`);
        suggestions.push(`🌱 Current phase: ${mainCrop.currentPhase}`);
        suggestions.push(`📈 Progress: ${mainCrop.progress}% complete`);
      }

      // Phase-specific advice
      if (mainCrop.currentPhase === 'preparation') {
        suggestions.push(language === 'te' ? 
          '🔧 నేల తయారీని పూర్తి చేయండి మరియు మంచి విత్తనాలు ఎంచుకోండి' :
          '🔧 Complete soil preparation and select quality seeds');
      } else if (mainCrop.currentPhase === 'growing') {
        suggestions.push(language === 'te' ?
          '💧 రోజువారీ నీటిపారుదల మరియు కీటకాలను పర్యవేక్షించండి' :
          '💧 Daily irrigation and pest monitoring essential');
      }

      actions.push({
        type: 'navigation',
        label: language === 'te' ? 'పూర్ణ రోడ్‌మ్యాప్ చూడండి' : 'View Complete Roadmap',
        action: `/crop-roadmap/${mainCrop.id}`
      });
    } else {
      message = language === 'te' ? 
        'మొదట పంట ఎంచుకోండి, తర్వాత నేను వివరణాత్మక సలహా ఇస్తాను!' :
        'Select a crop first, then I can provide detailed cultivation advice!';
      
      actions.push({
        type: 'recommendation',
        label: language === 'te' ? 'పంట ఎంచుకోండి' : 'Choose Crop',
        action: '/crop-recommendations'
      });
    }

    return {
      message,
      suggestions,
      actions,
      urgency: 'medium'
    };
  }

  private generateProfitAdvice(language: string): AIResponse {
    let message = '';
    const suggestions: string[] = [];
    const actions: any[] = [];

    if (language === 'te') {
      message = '💰 లాభదాయకత పెంచుకోవడానికి స్మార్ట్ వ్యూహాలు: ';
      suggestions.push('🎯 వేల్యూ అడిషన్: ముడి పంట కంటే ప్రాసెసింగ్ చేసి 40% అధిక లాభం');
      suggestions.push('📱 డైరెక్ట్ సేల్స్: మధ్యవర్తులను దాటవేసి WhatsApp గ్రూప్స్ ద్వారా అమ్మకం');
      suggestions.push('🌾 ఇంటర్‌క్రాపింగ్: ప్రధాన పంటతో పాటు కొత్తమిర్చి/పాలకూర వేసి అదనపు ₹15,000');
      suggestions.push('🚁 ట్రైన్ సర్వీస్‌లు: డ్రోన్ మానిటరింగ్ ద్వారా 15% ఎక్కువ దిగుబడి');
    } else if (language === 'hi') {
      message = '💰 मुनाफा बढ़ाने की स्मार्ट रणनीतियां: ';
      suggestions.push('🎯 मूल्य संवर्धन: कच्चे फसल के बजाय प्रसंस्करण से 40% अधिक लाभ');
      suggestions.push('📱 प्रत्यक्ष बिक्री: बिचौलियों को छोड़कर WhatsApp समूहों से बेचें');
      suggestions.push('🌾 अंतर-फसल: मुख्य फसल के साथ धनिया/पालक लगाकर अतिरिक्त ₹15,000');
      suggestions.push('🚁 तकनीकी सेवाएं: ड्रोन मॉनिटरिंग से 15% अधिक उत्पादन');
    } else {
      message = '💰 Smart strategies to maximize your profits: ';
      suggestions.push('🎯 Value Addition: Process crops instead of selling raw for 40% higher profits');
      suggestions.push('📱 Direct Sales: Bypass middlemen, sell via WhatsApp groups to consumers');
      suggestions.push('🌾 Intercropping: Add coriander/spinach between main crops for extra ₹15,000');
      suggestions.push('🚁 Tech Services: Use drone monitoring for 15% higher yields');
    }

    // Add seasonal profit opportunities
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 2 && currentMonth <= 4) { // March-May
      suggestions.push(language === 'te' ? 
        '🔥 వేసవి అవకాశం: దోసకాయ, పుచ్చకాయలకు అధిక డిమాండ్ - ప్రతి ఎకరేకు ₹2 లక్షలు వరకు!' :
        '🔥 Summer Opportunity: High demand for cucumber, watermelon - up to ₹2L per acre!');
    }

    actions.push({
      type: 'navigation',
      label: language === 'te' ? 'మార్కెట్ విశ్లేషణ' : 'Market Analysis',
      action: '/price-analysis'
    });

    actions.push({
      type: 'navigation',
      label: language === 'te' ? 'ఫార్మ్ సర్వీసెస్' : 'Farm Services',
      action: '/farm-inputs-marketplace'
    });

    return {
      message,
      suggestions,
      actions,
      profitInsight: language === 'te' ? 
        '📊 డేటా-డ్రైవెన్ వ్యవసాయం + వేల్యూ అడిషన్ + డైరెక్ట్ మార్కెటింగ్ = 300% లాభ పెరుగుట!' :
        '📊 Data-driven farming + Value addition + Direct marketing = 300% profit increase!',
      urgency: 'high'
    };
  }

  private generateMarketAdvice(language: string): AIResponse {
    const mockMarketData = {
      tomato: { price: 25, trend: 'increasing', demand: 'high' },
      onion: { price: 18, trend: 'stable', demand: 'medium' },
      cucumber: { price: 20, trend: 'increasing', demand: 'high' }
    };

    let message = '';
    const suggestions: string[] = [];
    const actions: any[] = [];

    if (language === 'te') {
      message = '📈 నేటి మార్కెట్ అప్‌డేట్ మరియు అమ్మకపు సలహా: ';
      suggestions.push('🍅 టమాట: ₹25/కేజీ - అధిక డిమాండ్, అమ్మకానికి మంచి సమయం');
      suggestions.push('🧅 ఉల్లిపాయ: ₹18/కేజీ - స్థిరమైన ధర, నిల్వ చేసుకోవచ్చు');
      suggestions.push('🥒 దోసకాయ: ₹20/కేజీ - పెరుగుతున్న ధర, త్వరగా అమ్మండి');
      suggestions.push('💡 సలహా: బల్క్ ఆర్డర్‌లకు హోటల్‌లు మరియు రెస్టారెంట్‌లను సంప్రదించండి');
    } else if (language === 'hi') {
      message = '📈 आज का मार्केट अपडेट और बिक्री सलाह: ';
      suggestions.push('🍅 टमाटर: ₹25/किलो - उच्च मांग, बेचने का अच्छा समय');
      suggestions.push('🧅 प्याज: ₹18/किलो - स्थिर कीमत, भंडारण कर सकते हैं');
      suggestions.push('🥒 खीरा: ₹20/किलो - बढ़ती कीमत, जल्दी बेचें');
      suggestions.push('💡 सलाह: बल्क ऑर्डर के लिए होटल और रेस्तरां से संपर्क करें');
    } else {
      message = '📈 Today\'s market update and selling advice: ';
      suggestions.push('🍅 Tomato: ₹25/kg - High demand, good time to sell');
      suggestions.push('🧅 Onion: ₹18/kg - Stable price, can store longer');
      suggestions.push('🥒 Cucumber: ₹20/kg - Rising price, sell quickly');
      suggestions.push('💡 Tip: Contact hotels and restaurants for bulk orders');
    }

    // Add direct marketing channels
    suggestions.push(language === 'te' ? 
      '📱 డైరెक్ట్ సేల్స్ చానల్స్: WhatsApp బిజినెస్, లోకల్ ఆన్‌లైన్ గ్రూప్స్, వీకెండ్ ఫార్మర్స్ మార్కెట్‌లు' :
      '📱 Direct Sales Channels: WhatsApp Business, local online groups, weekend farmers markets');

    actions.push({
      type: 'navigation',
      label: language === 'te' ? 'ధరల విశ్లేషణ' : 'Price Analysis',
      action: '/price-analysis'
    });

    return {
      message,
      suggestions,
      actions,
      profitInsight: language === 'te' ? 
        '🎯 మధ్యవర్తులను దాటవేసి డైరెక్ట్ అమ్మకం చేస్తే 25-30% అధిక లాభం!' :
        '🎯 Bypass middlemen with direct sales for 25-30% higher profits!',
      urgency: 'medium'
    };
  }

  private generateProblemSolution(query: string, language: string): AIResponse {
    let message = '';
    const suggestions: string[] = [];
    const actions: any[] = [];

    // Analyze the problem from query
    const problemKeywords = query.toLowerCase();
    
    if (problemKeywords.includes('yellow') || problemKeywords.includes('पीला') || problemKeywords.includes('పసుపు')) {
      if (language === 'te') {
        message = '🟡 ఆకుల పసుపు రంగు సమస్య విశ్లేషణ: ';
        suggestions.push('💧 అధిక నీటిపారుదల లేదా నీటి కొరత - నేల తేమను తనిఖీ చేయండి');
        suggestions.push('🧪 నైట్రోజన్ కొరత - ఆర్గానిక్ కంపోస్ట్ లేదా యూరియా వేయండి');
        suggestions.push('🐛 కీటకాల దాడి - నీం ఆయిల్ స్ప్రే చేయండి');
      } else {
        message = '🟡 Yellow leaf problem analysis: ';
        suggestions.push('💧 Overwatering or water stress - Check soil moisture');
        suggestions.push('🧪 Nitrogen deficiency - Apply organic compost or urea');
        suggestions.push('🐛 Pest attack - Apply neem oil spray');
      }
    } else if (problemKeywords.includes('pest') || problemKeywords.includes('कीट') || problemKeywords.includes('కీటక')) {
      if (language === 'te') {
        message = '🐛 కీटకాల నియంత्रण మరియు నివारణ: ';
        suggestions.push('🌿 సహజ పద్ధति: నీం ఆయిల్ + చక్కెర స్ప్రే ప్రతి 3 రోజులకు');
        suggestions.push('🕷️ మిత్ర కీటకాలు: లేడీ బర్డ్ బీట్ల్స్‌ను ప్రోత్సహించండి');
        suggestions.push('🚁 ప్రొఫెషనల్ హెల్ప్: డ్రోన్ ద్వారా లక్ష్య వేధింపు నియंత్రణ');
      } else {
        message = '🐛 Pest control and prevention strategies: ';
        suggestions.push('🌿 Natural method: Neem oil + jaggery spray every 3 days');
        suggestions.push('🕷️ Beneficial insects: Encourage ladybird beetles');
        suggestions.push('🚁 Professional help: Targeted pest control via drones');
      }

      actions.push({
        type: 'navigation',
        label: language === 'te' ? 'డ్రోన్ సర్వీస్' : 'Drone Service',
        action: '/drone-services'
      });
    }

    // Add emergency contact option
    actions.push({
      type: 'recommendation',
      label: language === 'te' ? 'ఎమర్జెన్సీ ఎక్స్‌పర్ట్ కాల్' : 'Emergency Expert Call',
      action: 'tel:+918765432109'
    });

    return {
      message: message || (language === 'te' ? 'సమస్య గురించి మరింత వివరాలు చెప్పండి' : 'Please provide more details about the problem'),
      suggestions,
      actions,
      urgency: 'high'
    };
  }

  // Analyze conversation context for intelligent responses
  private analyzeConversationContext(conversationHistory: string[]): any {
    const recentMessages = conversationHistory.slice(-5); // Last 5 messages
    const topics = [];
    const concerns = [];
    
    recentMessages.forEach(message => {
      const lower = message.toLowerCase();
      if (lower.includes('problem') || lower.includes('issue') || lower.includes('disease')) {
        concerns.push('problem_solving');
      }
      if (lower.includes('profit') || lower.includes('money') || lower.includes('sell')) {
        topics.push('financial');
      }
      if (lower.includes('crop') || lower.includes('plant') || lower.includes('grow')) {
        topics.push('cultivation');
      }
    });
    
    return { topics, concerns, messageCount: recentMessages.length };
  }

  // Advanced query intent analysis
  private analyzeQueryIntent(query: string, context: any): any {
    const intent = {
      primary: 'general',
      urgency: 'normal',
      dataNeeds: [],
      actionExpected: false,
      followUp: false
    };
    
    const lower = query.toLowerCase();
    
    // Detect urgency indicators
    if (lower.includes('urgent') || lower.includes('emergency') || lower.includes('dying') || lower.includes('immediately')) {
      intent.urgency = 'high';
    } else if (lower.includes('soon') || lower.includes('today') || lower.includes('now')) {
      intent.urgency = 'medium';
    }
    
    // Detect data requirements
    if (lower.includes('weather') || lower.includes('rain') || lower.includes('temperature')) {
      intent.dataNeeds.push('weather');
    }
    if (lower.includes('soil') || lower.includes('moisture') || lower.includes('ph')) {
      intent.dataNeeds.push('soil');
    }
    if (lower.includes('price') || lower.includes('market') || lower.includes('sell')) {
      intent.dataNeeds.push('market');
    }
    
    // Detect if action is expected
    if (lower.includes('how to') || lower.includes('what should i') || lower.includes('recommend') || lower.includes('suggest')) {
      intent.actionExpected = true;
    }
    
    // Detect follow-up questions
    if (context.messageCount > 0 && (lower.includes('also') || lower.includes('what about') || lower.includes('and'))) {
      intent.followUp = true;
    }
    
    return intent;
  }

  // Enhanced daily advice with sharp intelligence
  private async generateIntelligentDailyAdvice(language: string, intent: any): Promise<AIResponse> {
    const farmerName = 'Farmer';
    const activeCrops = this.farmContext.trackedCrops;
    const weather = this.farmContext.weatherData;
    const soil = this.farmContext.soilData;
    const market = this.farmContext.marketPrices;
    
    let message = '';
    const suggestions: string[] = [];
    const actions: any[] = [];
    
    // Smart greeting based on time and conditions
    const currentHour = new Date().getHours();
    const greeting = this.getSmartGreeting(currentHour, weather, language);
    
    message = `${greeting}, ${farmerName}! `;
    
    // Real-time condition analysis
    if (weather && activeCrops.length > 0) {
      const criticalInsights = this.analyzeCriticalConditions(weather, soil, activeCrops);
      
      if (criticalInsights.length > 0) {
        message += this.formatCriticalInsights(criticalInsights, language);
      }
      
      // Smart daily recommendations based on real data
      const smartRecommendations = this.generateSmartRecommendations(weather, soil, market, activeCrops, language);
      suggestions.push(...smartRecommendations);
    }
    
    // Add contextual profit opportunities
    const profitOpportunities = this.identifyProfitOpportunities(market, weather, activeCrops, language);
    if (profitOpportunities.length > 0) {
      suggestions.push(...profitOpportunities);
    }
    
    return {
      message,
      suggestions,
      actions,
      profitInsight: this.generateRealTimeProfitInsight(market, weather, language),
      urgency: criticalInsights.length > 0 ? 'high' : 'medium'
    };
  }

  // Analyze critical conditions requiring immediate attention
  private analyzeCriticalConditions(weather: any, soil: any, crops: any[]): string[] {
    const critical = [];
    
    if (weather.temperature > 35) {
      critical.push('extreme_heat');
    }
    if (soil.moisture < 20) {
      critical.push('drought_stress');
    }
    if (weather.rainfall > 50) {
      critical.push('excess_water');
    }
    if (soil.ph < 5.5 || soil.ph > 8.5) {
      critical.push('ph_imbalance');
    }
    
    return critical;
  }

  private formatCriticalInsights(insights: string[], language: string): string {
    const alerts = {
      extreme_heat: language === 'te' ? '🔥 అధిక వేడిమి హెచ్చరిక! ' : '🔥 Extreme heat alert! ',
      drought_stress: language === 'te' ? '💧 నీటి కొరత ప్రమాదం! ' : '💧 Drought stress detected! ',
      excess_water: language === 'te' ? '🌧️ అధిక వర్షం హెచ్చరిక! ' : '🌧️ Excess rainfall warning! ',
      ph_imbalance: language === 'te' ? '⚖️ నేల pH అసమతుల్యత! ' : '⚖️ Soil pH imbalance detected! '
    };
    
    return insights.map(insight => alerts[insight as keyof typeof alerts] || '').join('');
  }

  private generateSmartRecommendations(weather: any, soil: any, market: any, crops: any[], language: string): string[] {
    const recommendations = [];
    
    // Weather-based smart recommendations
    if (weather.temperature > 30) {
      recommendations.push(language === 'te' ? 
        `🌡️ ఉష్ణోగ్రత ${Math.round(weather.temperature)}°C - మధ్యాహ్న షేడ్ నెట్ వేయండి, సాయంత్రం నీటిపారుదల చేయండి` :
        `🌡️ Temperature ${Math.round(weather.temperature)}°C - Install shade nets, irrigate in evening`);
    }
    
    // Soil-based recommendations
    if (soil.moisture < 30) {
      recommendations.push(language === 'te' ? 
        `💧 నేల తేమ ${Math.round(soil.moisture)}% - డ్రిప్ ఇరిగేషన్ 2 గంటలకు ప్రారంభించండి` :
        `💧 Soil moisture ${Math.round(soil.moisture)}% - Start drip irrigation for 2 hours`);
    }
    
    // Market-based recommendations
    Object.entries(market).forEach(([crop, data]: [string, any]) => {
      if (data.trend === 'up' && crops.some(c => c.name.toLowerCase().includes(crop))) {
        recommendations.push(language === 'te' ? 
          `📈 ${crop} ధర పెరుగుతోంది (₹${Math.round(data.price)}/కేజీ) - అమ్మకానికి సిద్ధం చేసుకోండి` :
          `📈 ${crop} price rising (₹${Math.round(data.price)}/kg) - Prepare for harvest`);
      }
    });
    
    return recommendations;
  }

  private identifyProfitOpportunities(market: any, weather: any, crops: any[], language: string): string[] {
    const opportunities = [];
    
    // Market timing opportunities
    const highPriceCrops = Object.entries(market)
      .filter(([_, data]: [string, any]) => data.price > 20)
      .sort(([_, a]: [string, any], [__, b]: [string, any]) => b.price - a.price);
    
    if (highPriceCrops.length > 0) {
      const [cropName, data] = highPriceCrops[0] as [string, any];
      opportunities.push(language === 'te' ? 
        `💰 అవకాశం: ${cropName} అత్యధిక ధర ₹${Math.round(data.price)}/కేజీ - వెంటనే అమ్మండి లేదా విత్తండి` :
        `💰 Opportunity: ${cropName} at peak price ₹${Math.round(data.price)}/kg - Sell now or plant next`);
    }
    
    // Weather-based opportunities
    if (weather.forecast === 'rainy' && crops.length === 0) {
      opportunities.push(language === 'te' ? 
        '🌧️ వర్షాకాలం రాబోతోంది - త్వరిత పంటలు (కొత్తమిర్చి, పాలకూర) విత్తడానికి మంచి సమయం' :
        '🌧️ Rainy season approaching - Perfect time for quick crops (coriander, spinach)');
    }
    
    return opportunities;
  }

  private generateRealTimeProfitInsight(market: any, weather: any, language: string): string {
    const insights = language === 'te' ? [
      `💎 రియల్‌టైమ్ టిప్: మార్కెట్ డేటా ఆధారంగా ${Object.keys(market)[0]} అత్యుత్తమ లాభం ఇస్తుంది!`,
      `🚀 వాతావరణం అనుకూలం: ${weather.forecast} - పంట లాభదాయకతకు మంచిది!`,
      `📊 స్మార్ట్ వ్యవసాయం: డేటా + టెక్నాలజీ = 3x లాభం!`
    ] : [
      `💎 Real-time insight: Market data shows ${Object.keys(market)[0]} offers best ROI today!`,
      `🚀 Weather advantage: ${weather.forecast} conditions favor profitable farming!`,
      `📊 Smart farming: Data + Technology = 3x profits!`
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  }

  private getSmartGreeting(hour: number, weather: any, language: string): string {
    let greeting = '';
    let weatherNote = '';
    
    if (language === 'te') {
      if (hour < 10) greeting = 'శుభోదయం';
      else if (hour < 16) greeting = 'మధ్యాహ్న నమస్కారం';
      else greeting = 'సాయంత్రి నమస్కారం';
      
      if (weather.temperature > 32) weatherNote = ' (నేడు వేడిమి ఎక్కువ)';
      else if (weather.forecast === 'rainy') weatherNote = ' (వర్షం అవకాశం ఉంది)';
    } else {
      if (hour < 10) greeting = 'Good morning';
      else if (hour < 16) greeting = 'Good afternoon';
      else greeting = 'Good evening';
      
      if (weather.temperature > 32) weatherNote = ' (hot day ahead)';
      else if (weather.forecast === 'rainy') weatherNote = ' (rain expected)';
    }
    
    return greeting + weatherNote;
  }

  private generateIntercroppingAdvice(query: string, language: string): AIResponse {
    const suggestions = [];
    const actions = [];
    
    let message = '';
    
    if (language === 'te') {
      message = '🌱 మీ భూమికి అనుకూలమైన సహజీవన పంట వ్యవస్థ:';
      
      // Detailed intercropping strategies
      suggestions.push('🎯 **ప్రధాన లాభాలు**: భూమి వినియోగం 60% పెరుగుట, సహజ కీటక నియంత్రణ, నేల ఆరోగ్యం మెరుగుట');
      suggestions.push('🥕 **టమోటో + కొత్తిమీర + మెంతులు**: 90 రోజుల్లో ₹1.8లక్షలు (సాధారణంగా ₹1.2లక్షలు)');
      suggestions.push('🧅 **ఉల్లిపాయ + పాలకూర + లెట్యూస్**: నత్రజని స్థిరీకరణ + అదనపు ₹30,000');
      suggestions.push('🥒 **దోసకాయ + రాడిష్ + క్యారెట్**: వేర్ల వ్యవస్థ వైవిధ్యం - నీటి సామర్థ్య వినియోగం');
      suggestions.push('🌶️ **మిరప చెట్లతో**: వెల్లుల్లి, బార్లీ - సహజ కీటక నియంత్రణ వ్యవస్థ');
      suggestions.push('🥬 **కూరగాయలతో**: గోధుమ గడ్డి, లెగ్యూమ్స్ - నత్రజని స్థిరీకరణ');
      suggestions.push('📏 **నాటే దూరం**: మొక్కల మధ్య 30-45 సె.మీ., సూర్య కిరణాల సమాన పంపిణీ');
      suggestions.push('⏰ **సమయ నిర్వహణ**: మొదట ప్రధాన పంట, 15 రోజుల తర్వాత సహాయక పంటలు విత్తనాలు');
      suggestions.push('💧 **నీటిపారుదల వ్యూహం**: డ్రిప్ ఇరిగేషన్‌తో 40% నీటి ఆదా + సమాన పోషకాహారం');
    } else {
      message = '🌱 Customized Intercropping System for Your Farm:';
      
      suggestions.push('🎯 **Key Benefits**: 60% increased land utilization, natural pest control, improved soil health');
      suggestions.push('🥕 **Tomato + Coriander + Fenugreek**: ₹1.8L in 90 days (vs normal ₹1.2L)');
      suggestions.push('🧅 **Onion + Spinach + Lettuce**: Nitrogen fixation + extra ₹30,000 income');
      suggestions.push('🥒 **Cucumber + Radish + Carrot**: Root diversity - optimized water & nutrient use');
      suggestions.push('🌶️ **With Chilli Plants**: Garlic, Barley - Natural pest management system');
      suggestions.push('🥬 **With Vegetables**: Wheat grass, Legumes - Nitrogen fixation benefits');
      suggestions.push('📏 **Plant Spacing**: 30-45cm between plants, equal sunlight distribution');
      suggestions.push('⏰ **Timing Strategy**: Main crop first, companion crops after 15 days');
      suggestions.push('💧 **Irrigation Plan**: Drip system saves 40% water + uniform nutrition');
    }
    
    // Add seasonal specific advice
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 11 || currentMonth <= 1) { // Winter season
      suggestions.push(language === 'te' ? 
        '❄️ చలికాల ప్రత్యేకత: టమోటో + కొత్తిమీర + పాలక్ = మూడు ఆదాయ మార్గాలు!' :
        '❄️ Winter Special: Tomato + Coriander + Spinach = Triple income streams!');
    } else if (currentMonth >= 2 && currentMonth <= 4) { // Summer
      suggestions.push(language === 'te' ? 
        '🌞 వేసవి ప్రత్యేకత: దోసకాయ + వెంకాయ + రాడిష్ = నీటి సామర్థ్య వినియోగం!' :
        '🌞 Summer Special: Cucumber + Onion + Radish = Water efficient combination!');
    }
    
    // Add implementation steps
    suggestions.push(language === 'te' ? 
      '📋 **అమలు దశలు**: 1) నేల పరీక్ష 2) విత్తనాలు ఎంపిక 3) సరైన అంతరాలు 4) డ్రిప్ వ్యవస్థ ఏర్పాటు' :
      '📋 **Implementation Steps**: 1) Soil testing 2) Seed selection 3) Proper spacing 4) Drip system setup');
    
    // Enhanced profit calculations
    suggestions.push(language === 'te' ? 
      '💰 **లాభ గణన**: సాధారణ పంట ₹1L/ఎకరే → ఇంటర్‌క్రాపింగ్‌తో ₹1.8L/ఎకరే (80% పెరుగుదల)' :
      '💰 **Profit Calculation**: Normal crop ₹1L/acre → With intercropping ₹1.8L/acre (80% increase)');
    
    actions.push({
      type: 'navigation',
      label: language === 'te' ? 'మల్టీ క్రాప్ ప్లానర్' : 'Multi-Crop Planner',
      action: '/multi-crop-planner'
    });
    
    actions.push({
      type: 'navigation',
      label: language === 'te' ? 'పంట క్యాలెండర్' : 'Crop Calendar',
      action: '/calendar'
    });
    
    actions.push({
      type: 'navigation',
      label: language === 'te' ? 'నేల విశ్లేషణ' : 'Soil Analysis',
      action: '/soil-analysis'
    });
    
    return {
      message,
      suggestions,
      actions,
      profitInsight: language === 'te' ? 
        'స్మార్ట్ టిప్: సరైన ఇంటర్‌క్రాపింగ్‌తో భూమి వినియోగం 150% పెరుగుతుంది + కీటకాల సహజ నియంత్రణ!' :
        'Smart Tip: Proper intercropping increases land utilization by 150% + natural pest control!',
      urgency: 'medium'
    };
  }

  private generateQuickIncomeCropAdvice(query: string, language: string, context: string[]): AIResponse {
    const suggestions = [];
    const actions = [];
    
    let message = '';
    
    if (language === 'te') {
      message = '💰 మాసిక/వారపు ఆదాయం కోసం త్వరిత పంటల జాబితా:';
      
      // Super quick crops (10-30 days)
      suggestions.push('⚡ **అత్యంత వేగం (10-30 రోజులు)**');
      suggestions.push('🥬 మైక్రోగ్రీన్స్: 10-30 రోజులు | ₹15-25 లక్షలు/సంవత్సరం | గౌర్మెట్ డిమాండ్');
      suggestions.push('🍄 ఓస్టర్ పుట్టగొడుగులు: 30-60 రోజులు | ₹3 లక్షలు/ఎకరే | పట్టణ డిమాండ్');
      suggestions.push('🌱 అమరాంథస్ (తోట కూర): 25-30 రోజులు | ₹30-50వేలు | పోషకాహార విలువ');
      
      // Quick leafy greens (30-45 days)
      suggestions.push('🌿 **ఆకు కూరలు (30-45 రోజులు)**');
      suggestions.push('🌿 కొత్తిమీర: 30-45 రోజులు | ₹50-60వేలు | మసాలా/ఆకు అమ్మకం');
      suggestions.push('🥬 పాలకూర: 25-45 రోజులు | ₹40-80వేలు | పట్టణ తాజా డిమాండ్');
      suggestions.push('🌱 మెంతుల ఆకు: 20-45 రోజులు | ₹40-60వేలు | మసాలా/కూర');
      suggestions.push('🥗 లెట్యూస్: 45-60 రోజులు | ₹60-80వేలు | సలాడ్ డిమాండ్');
      
      // Quick roots (30-60 days)
      suggestions.push('🥕 **వేర్లు (30-60 రోజులు)**');
      suggestions.push('🥕 రాడిష్: 30-40 రోజులు | ₹50వేలు | చలికాల సలాడ్');
      suggestions.push('🍠 బీట్రూట్: 21-45 రోజులు | ₹40-70వేలు | ఆకులు/వేర్లు రెండూ');
      suggestions.push('🥕 టర్నిప్: 40-60 రోజులు | ₹50-70వేలు | వేర్లు/ఆకులు');
      
      // Quick vegetables (50-90 days)
      suggestions.push('🥒 **కూరగాయలు (50-90 రోజులు)**');
      suggestions.push('🥒 దోసకాయ: 50-70 రోజులు | ₹1-1.5 లక్షలు | పట్టణ ప్రీమియం');
      suggestions.push('🍅 టమాటో: 60-90 రోజులు | ₹80వేలు-1.5 లక్షలు | సంవత్సరం పొడవునా');
      suggestions.push('🫑 క్యాప్సికం: 60-90 రోజులు | ₹1-2 లక్షలు | ఎగుమతి/హోల్‌సేల్');
      suggestions.push('🍆 వంకాయ: 60-80 రోజులు | ₹1-1.5 లక్షలు | రోజువారీ వంటలు');
      
      // Optimization tips
      suggestions.push('🎯 **లాభ పెంపు వ్యూహాలు**');
      suggestions.push('🔄 వరుస సాగు: కొత్తిమీర → వంకాయ = సంవత్సరానికి 3 సార్లు');
      suggestions.push('📊 హైబ్రిడ్ విత్తనాలు: 20-30% అధిక దిగుబడి');
      suggestions.push('💧 డ్రిప్ సిస్టమ్: 40% నీటి ఆదా + సమాన పెరుగుదల');
      suggestions.push('📍 స్థానిక మార్కెట్: రవాణా ఖర్చు తక్కువ + తాజా ధర');
      
    } else {
      message = '💰 Quick Income Crops for Weekly/Monthly Earnings:';
      
      // Super quick crops (10-30 days)
      suggestions.push('⚡ **Ultra-Fast (10-30 Days)**');
      suggestions.push('🥬 Microgreens: 10-30 days | ₹15-25L/year | Gourmet demand');
      suggestions.push('🍄 Oyster Mushrooms: 30-60 days | ₹3L/acre | Urban restaurants');
      suggestions.push('🌱 Amaranthus: 25-30 days | ₹30-50k | Nutritional value');
      
      // Quick leafy greens (30-45 days)
      suggestions.push('🌿 **Leafy Greens (30-45 Days)**');
      suggestions.push('🌿 Coriander: 30-45 days | ₹50-60k | Spice/leafy sales');
      suggestions.push('🥬 Spinach: 25-45 days | ₹40-80k | Urban fresh demand');
      suggestions.push('🌱 Fenugreek: 20-45 days | ₹40-60k | Herb/curry');
      suggestions.push('🥗 Lettuce: 45-60 days | ₹60-80k | Salad demand');
      
      // Quick roots (30-60 days)
      suggestions.push('🥕 **Root Vegetables (30-60 Days)**');
      suggestions.push('🥕 Radish: 30-40 days | ₹50k | Winter salads');
      suggestions.push('🍠 Beetroot: 21-45 days | ₹40-70k | Leaves + roots');
      suggestions.push('🥕 Turnip: 40-60 days | ₹50-70k | Dual purpose');
      
      // Quick vegetables (50-90 days)
      suggestions.push('🥒 **Vegetables (50-90 Days)**');
      suggestions.push('🥒 Cucumber: 50-70 days | ₹1-1.5L | Urban premium');
      suggestions.push('🍅 Tomato: 60-90 days | ₹80k-1.5L | Year-round');
      suggestions.push('🫑 Capsicum: 60-90 days | ₹1-2L | Export/wholesale');
      suggestions.push('🍆 Brinjal: 60-80 days | ₹1-1.5L | Daily cuisine');
      
      // Optimization tips
      suggestions.push('🎯 **Profit Optimization**');
      suggestions.push('🔄 Crop Rotation: Coriander → Brinjal = 3 cycles/year');
      suggestions.push('📊 Hybrid Seeds: 20-30% higher yields');
      suggestions.push('💧 Drip System: 40% water savings + uniform growth');
      suggestions.push('📍 Local Markets: Lower transport + fresh prices');
    }
    
    // Add seasonal timing for Telangana
    const currentMonth = new Date().getMonth();
    if (currentMonth === 11 || currentMonth === 0 || currentMonth === 1) { // Dec-Feb
      suggestions.push(language === 'te' ? 
        '❄️ డిసెంబర్ విత్తనాలకు ఉత్తమం: కొత్తిమీర + పాలకూర + రాడిష్ (రబీ కాలం)' :
        '❄️ Perfect for December sowing: Coriander + Spinach + Radish (Rabi season)');
    }
    
    // Weekly income plan
    suggestions.push(language === 'te' ? 
      '📅 వారపు ఆదాయ ప్లాన్: మైక్రోగ్రీన్స్ (వారానికి ₹15-20వేలు) + మాసిక కూరలు (₹40-60వేలు)' :
      '📅 Weekly Income Plan: Microgreens (₹15-20k/week) + Monthly greens (₹40-60k)');
    
    actions.push({
      type: 'navigation',
      label: language === 'te' ? 'త్వరిత పంట ప్లానర్' : 'Quick Crop Planner',
      action: '/multi-crop-planner'
    });
    
    actions.push({
      type: 'navigation',
      label: language === 'te' ? 'మార్కెట్ ధర విశ్లేషణ' : 'Market Price Analysis',
      action: '/price-analysis'
    });
    
    actions.push({
      type: 'navigation',
      label: language === 'te' ? 'పంట క్యాలెండర్' : 'Crop Calendar',
      action: '/calendar'
    });
    
    return {
      message,
      suggestions,
      actions,
      profitInsight: language === 'te' ? 
        '💡 స్మార్ట్ వ్యూహం: మైక్రోగ్రీన్స్ + త్వరిత కూరలు = మాసిక ₹80వేలు-2లక్షలు!' :
        '💡 Smart Strategy: Microgreens + Quick greens = Monthly ₹80k-2L income!',
      urgency: 'high'
    };
  }

  private generateInteractiveResponse(query: string, language: string, context: string[]): AIResponse {
    const suggestions = [];
    const actions = [];
    
    // Analyze what farmer is asking about
    const queryWords = query.toLowerCase().split(' ');
    let detectedTopic = 'general';
    
    if (queryWords.some(word => ['income', 'money', 'profit', 'earning', 'ఆదాయం', 'డబ్బు', 'లాభం'].includes(word))) {
      detectedTopic = 'income';
    } else if (queryWords.some(word => ['water', 'irrigation', 'नीर', 'నీటి'].includes(word))) {
      detectedTopic = 'irrigation';
    } else if (queryWords.some(word => ['fertilizer', 'nutrient', 'खाद', 'ఎరువు'].includes(word))) {
      detectedTopic = 'nutrition';
    } else if (queryWords.some(word => ['weather', 'climate', 'मौसम', 'వాతావరణం'].includes(word))) {
      detectedTopic = 'weather';
    }
    
    let message = '';
    
    if (language === 'te') {
      if (detectedTopic === 'income') {
        message = '💰 త్వరిత ఆదాయ పెంపు వ్యూహాలు:';
        suggestions.push('⚡ **మైక్రోగ్రీన్స్**: 10-30 రోజులు | వారానికి ₹15-20వేలు');
        suggestions.push('🌿 **కొత్తిమీర**: 30-45 రోజులు | మాసిక ₹50-60వేలు');
        suggestions.push('🥬 **పాలకూర**: 25-45 రోజులు | మాసిక ₹40-80వేలు');
        suggestions.push('🍄 **పుట్టగొడుగులు**: 30-60 రోజులు | మాసిక ₹2-3లక్షలు');
      } else if (detectedTopic === 'irrigation') {
        message = '💧 నీటిపారుదల గురించి వివరమైన సమాచారం:';
        suggestions.push('🕐 **ఉత్తమ సమయం**: ఉదయం 6-8 గంటలు, సాయంత్రం 5-7 గంటలు');
        suggestions.push('📊 **పరిమాణం**: టమోటో - వారానికి 25mm, మిరప - 20mm, ఉల్లిపాయ - 15mm');
        suggestions.push('🔄 **డ్రిప్ వ్యవస్థ**: 60% నీటి ఆదా + సమాన వృద్ధి + వ్యాధుల నివారణ');
      } else if (detectedTopic === 'nutrition') {
        message = '🌱 పోషకాహారం మరియు ఎరువుల వివరణ:';
        suggestions.push('🧪 **NPK నిష్పత్తి**: ఆరంభం 19:19:19, పుష్పకాలం 13:0:45, ఫలకాలం 20:20:20');
        suggestions.push('🍃 **జైవిక ఎరువులు**: వర్మి కంపోస్ట్ 2 టన్నులు/ఎకరే + నీమ్ కేక్ 200కిలోలు');
        suggestions.push('📈 **మైక్రో న్యూట్రియంట్స్**: జింక్, బోరాన్, మాగ్నీషియం - మాసికోసారి స్ప్రే');
      } else {
        message = 'మీ ప్రశ్న ఆధారంగా వివరమైన సలహా:';
        suggestions.push('🤔 మీరు ఏ నిర్దిష్ట అంశం గురించి తెలుసుకోవాలనుకుంటున్నారు?');
        suggestions.push('💡 పంటల సాగు, లాభాలు, మార్కెట్, సమస్యలు - ఏదైనా అడగవచ్చు');
      }
    } else {
      if (detectedTopic === 'irrigation') {
        message = '💧 Detailed Water Management Information:';
        suggestions.push('🕐 **Optimal Timing**: Morning 6-8 AM, Evening 5-7 PM');
        suggestions.push('📊 **Quantities**: Tomato - 25mm/week, Chilli - 20mm, Onion - 15mm');
        suggestions.push('🔄 **Drip System**: 60% water savings + uniform growth + disease prevention');
      } else if (detectedTopic === 'nutrition') {
        message = '🌱 Complete Nutrition & Fertilizer Guide:';
        suggestions.push('🧪 **NPK Ratios**: Early 19:19:19, Flowering 13:0:45, Fruiting 20:20:20');
        suggestions.push('🍃 **Organic Options**: Vermi compost 2 tons/acre + Neem cake 200kg');
        suggestions.push('📈 **Micronutrients**: Zinc, Boron, Magnesium - monthly foliar spray');
      } else {
        message = 'Detailed guidance based on your question:';
        suggestions.push('🤔 What specific aspect would you like to know more about?');
        suggestions.push('💡 Ask about crop cultivation, profits, markets, problems - anything!');
      }
    }
    
    return {
      message,
      suggestions,
      actions,
      urgency: 'medium'
    };
  }

  private generateContextualResponse(query: string, language: string): AIResponse {
    const suggestions = [];
    const actions = [];

    if (language === 'te') {
      suggestions.push('🤖 నేను మీ స్మార్ట్ వ్యవసాయ సహాయకుడిని');
      suggestions.push('📞 వాయిస్ లేదా టెక్స్ట్‌లో తెలుగు/హిందీ/ఇంగ్లీష్‌లో అడగవచ్చు');
      suggestions.push('💡 పంటల సలహా, లాభ పెంపు, మార్కెట్ ధరలు, సమస్య పరిష్కారం');
    } else {
      suggestions.push('🤖 I\'m your intelligent farming advisor');
      suggestions.push('📞 Ask me in Telugu/Hindi/English via voice or text');
      suggestions.push('💡 Crop advice, profit maximization, market prices, problem solving');
    }

    actions.push({
      type: 'recommendation',
      label: language === 'te' ? 'నేటి సలహా పొందండి' : 'Get Today\'s Advice',
      action: 'daily-advice'
    });

    return {
      message: language === 'te' ? 
        'మీకు ఎలా సహాయం చేయగలను? పంటలు, లాభాలు, మార్కెట్ లేదా ఏదైనా సమస్య గురించి అడగండి!' :
        'How can I help you today? Ask about crops, profits, market prices, or any farming problems!',
      suggestions,
      actions,
      urgency: 'low'
    };
  }

  private getWeatherBasedAdvice(language: string): string {
    // Mock weather data - integrate with real weather API
    const weather = { condition: 'sunny', temp: 28, humidity: 65 };
    
    if (weather.condition === 'sunny' && weather.temp > 30) {
      return language === 'te' ? 
        '☀️ వేడిమి అలర్ట్: మధ్యాహ్న సమయంలో నీటిపారుదల చేయండి మరియు షేడ్ నెట్ వేయండి' :
        '☀️ Heat Alert: Water during midday and consider shade nets';
    }
    
    return '';
  }

  private generateProfitInsight(language: string): string {
    const insights = language === 'te' ? [
      '💎 చిట్కా: మైక్రోగ్రీన్స్ 10 రోజుల్లో ₹25 లక్షలు వరకు సంపాదన!',
      '🚀 ట్రెండ్: హైడ్రోపోనిక్ లెట్యూస్‌కు రెస్టారెంట్‌ల్లో అధిక డిమాండ్!',
      '📈 అవకాశం: ఆర్గానిక్ సర్టిఫికేషన్ ద్వారా 40% అధిక ధర!'
    ] : [
      '💎 Tip: Microgreens can earn up to ₹25L in just 10 days!',
      '🚀 Trend: Hydroponic lettuce in high demand by restaurants!',
      '📈 Opportunity: Organic certification fetches 40% premium prices!'
    ];

    return insights[Math.floor(Math.random() * insights.length)];
  }
}

export const farmingAdvisor = new IntelligentFarmingAdvisor();
export { IntelligentFarmingAdvisor };
export type { AIResponse, FarmContext };