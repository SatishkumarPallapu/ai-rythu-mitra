import google.generativeai as genai
from openai import OpenAI
import httpx
from backend.config.settings import settings
from typing import Dict, Any, Optional, List
import json

# Initialize AI clients
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-pro')
else:
    gemini_model = None

if settings.OPENAI_API_KEY:
    openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
else:
    openai_client = None

async def analyze_soil_with_ai(file_path: str) -> Dict[str, Any]:
    """Analyze soil report using Gemini AI"""
    try:
        with open(file_path, 'r') as f:
            file_content = f.read(100)
    except Exception as e:
        file_content = f"Error reading file: {e}"

    try:
        if gemini_model:
            prompt = f"""Analyze the soil report (first 100 characters: {file_content}) and provide detailed recommendations.\n\n            Provide analysis in the following format:\n            - pH Level: [value and assessment]\n            - Nutrient Levels: N, P, K values\n            - Soil Type: [classification]\n            - Water Retention: [capacity]\n            - Recommendations: [list of actionable suggestions]\n            - Suitable Crops: [recommended crops]\n            """

            response = gemini_model.generate_content(prompt)

            return {
                "analysis": response.text,
                "ai_provider": "gemini",
                "confidence": 0.85
            }
        else:
            # Mock response if AI not configured
            return {
                "analysis": "pH Level: 6.5 (Good)\nNutrient Levels: N-Medium, P-High, K-Low\nSoil Type: Loamy\nRecommendations: Add potassium fertilizer, maintain regular irrigation",
                "ai_provider": "mock",
                "confidence": 0.70
            }
    except Exception as e:
        print(f"AI analysis error: {e}")
        return {
            "analysis": "Analysis pending - please try again",
            "error": str(e),
            "ai_provider": "error"
        }

async def get_crop_recommendation(
    soil_type: str,
    season: str,
    location: str,
    soil_report_id: Optional[str] = None,
    daily_market: bool = False,
    multi_cropping: bool = False
) -> list:
    """Get crop recommendations using AI"""

    try:
        if gemini_model:
            prompt = f"""As an agricultural expert, recommend the top 5 crops for:\n            - Soil Type: {soil_type}\n            - Season: {season}\n            - Location: {location}\n            - Daily Market: {daily_market}\n            - Multi Cropping: {multi_cropping}\n\n            For each crop, provide:\n            1. Crop name\n            2. Suitability score (0-100)\n            3. Expected yield per hectare\n            4. Growth duration\n            5. Water requirements\n            6. Top 3 care tips\n            7. Daily Market Crop: True/False\n            8. Multi Cropping Strategy: If applicable, which strategy and compatible crops\n            9. Profit Index: High, Medium, Low\n\n            Return as JSON array.\n            """

            response = gemini_model.generate_content(prompt)

            # Try to parse JSON, fallback to structured text
            try:
                recommendations = json.loads(response.text)
            except:
                recommendations = [
                    {
                        "name": "Rice",
                        "suitability_score": 90,
                        "expected_yield": "4-5 tons/hectare",
                        "growth_duration": "120-150 days",
                        "water_requirement": "High",
                        "care_tips": ["Maintain water level", "Apply fertilizer in stages", "Monitor for pests"],
                        "daily_market_crop": False,
                        "multi_cropping_strategy": None,
                        "compatible_crops": None,
                         "profit_index": "Medium"
                    },
                    {
                        "name": "Wheat",
                        "suitability_score": 85,
                        "expected_yield": "3-4 tons/hectare",
                        "growth_duration": "120-130 days",
                        "water_requirement": "Medium",
                        "care_tips": ["Irrigate at critical stages", "Weed control", "Timely harvesting"],
                        "daily_market_crop": False,
                        "multi_cropping_strategy": None,
                        "compatible_crops": None,
                        "profit_index": "Medium"
                    }
                ]

            return recommendations
        else:
            # Mock recommendations
            return [
                {
                    "name": "Rice",
                    "suitability_score": 90,
                    "expected_yield": "4-5 tons/hectare",
                    "growth_duration": "120-150 days",
                    "water_requirement": "High",
                    "care_tips": ["Maintain water level", "Apply fertilizer in stages", "Monitor for pests"],
                    "daily_market_crop": False,
                    "multi_cropping_strategy": None,
                    "compatible_crops": None,
                     "profit_index": "Medium"
                },
                {
                    "name": "Wheat",
                    "suitability_score": 85,
                    "expected_yield": "3-4 tons/hectare",
                    "growth_duration": "120-130 days",
                    "water_requirement": "Medium",
                    "care_tips": ["Irrigate at critical stages", "Weed control", "Timely harvesting"],
                    "daily_market_crop": False,
                    "multi_cropping_strategy": None,
                    "compatible_crops": None,
                    "profit_index": "Medium"
                }
            ]
    except Exception as e:
        print(f"Crop recommendation error: {e}")
        return []

async def analyze_crop_health(image_url: str) -> Dict[str, Any]:
    """Analyze crop health from image"""

    try:
        if openai_client:
            response = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Analyze this crop image for diseases, pests, and health status. Provide diagnosis and treatment recommendations."},
                            {"type": "image_url", "image_url": {"url": image_url}}
                        ]
                    }
                ],
                max_tokens=500
            )

            return {
                "diagnosis": response.choices[0].message.content,
                "confidence": 0.80,
                "ai_provider": "openai"
            }
        else:
            return {
                "diagnosis": "Crop appears healthy. Monitor for early signs of nutrient deficiency.",
                "confidence": 0.70,
                "ai_provider": "mock"
            }
    except Exception as e:
        print(f"Crop health analysis error: {e}")
        return {
            "diagnosis": "Analysis pending",
            "error": str(e)
        }

async def get_government_schemes(location: str) -> list:
    """Fetch government schemes using Perplexity AI"""

    try:
        if settings.PERPLEXITY_API_KEY:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.perplexity.ai/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.PERPLEXITY_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "llama-3.1-sonar-small-128k-online",
                        "messages": [
                            {
                                "role": "user",
                                "content": f"List current government agricultural schemes and subsidies available for farmers in {location}, India. Include eligibility and application process."
                            }
                        ]
                    }
                )

                result = response.json()
                return [{"schemes": result['choices'][0]['message']['content']}]
        else:
            return [{"schemes": "PM-KISAN, Soil Health Card Scheme, Pradhan Mantri Fasal Bima Yojana"}]
    except Exception as e:
        print(f"Government schemes fetch error: {e}")
        return []
