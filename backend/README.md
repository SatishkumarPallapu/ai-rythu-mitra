# AI Rythu Mitra Backend

FastAPI backend for AI-powered farmer assistance application.

## 🚀 Features

- **Authentication**: JWT-based user registration and login
- **Soil Analysis**: AI-powered soil report analysis using Gemini
- **Crop Recommendations**: Smart crop suggestions based on soil, season, and location
- **IoT Integration**: Real-time sensor data from ESP32 devices
- **Marketplace**: Buy/sell agricultural produce
- **Notifications**: Google Calendar and WhatsApp integration
- **Reports**: PDF generation for farm summaries

## 📋 Prerequisites

- Python 3.11+
- Firebase project (for Firestore)
- API keys for AI services (Gemini, OpenAI, Perplexity)

## 🛠️ Installation

1. **Clone and navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your credentials
```

## ⚙️ Configuration

Edit `.env` file with your credentials:

```env
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# AI APIs
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
PERPLEXITY_API_KEY=your-perplexity-key

# JWT Secret
SECRET_KEY=your-secret-key-here
```

## 🏃 Running the Server

**Development mode:**
```bash
python main.py
```

**Production mode with Uvicorn:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Server will start at: `http://localhost:8000`

## 📚 API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Soil Analysis
- `POST /soil/analyze` - Upload and analyze soil report
- `GET /soil/reports` - Get user's soil reports
- `GET /soil/reports/{id}` - Get specific report

### Crops
- `POST /crops/recommend` - Get crop recommendations
- `GET /crops/history` - Get recommendation history
- `GET /crops/health-check` - AI crop health analysis

### IoT Data
- `POST /iot/data` - Receive sensor data from ESP32
- `GET /iot/data/{field_id}` - Get field data
- `GET /iot/latest/{field_id}` - Get latest reading
- `GET /iot/stats/{field_id}` - Get statistical summary

### Marketplace
- `POST /marketplace/listings` - Create listing
- `GET /marketplace/listings` - Get all listings
- `GET /marketplace/listings/{id}` - Get specific listing
- `PUT /marketplace/listings/{id}` - Update listing
- `DELETE /marketplace/listings/{id}` - Delete listing
- `GET /marketplace/my-listings` - Get user's listings

### Notifications
- `POST /notifications/calendar` - Create calendar event
- `POST /notifications/whatsapp` - Send WhatsApp message
- `GET /notifications/history` - Get notification history
- `POST /notifications/schedule-daily-report` - Schedule reports

### Reports
- `POST /reports/generate` - Generate PDF report
- `GET /reports/history` - Get report history

## 🗄️ Database Structure

### Firestore Collections:
- `users` - User profiles
- `soil_reports` - Soil analysis reports
- `crop_recommendations` - AI crop suggestions
- `crop_health_records` - Crop health checks
- `iot_data` - Sensor readings
- `marketplace` - Product listings
- `notifications` - Notification logs
- `scheduled_notifications` - Scheduled alerts
- `generated_reports` - Report metadata

## 🤖 AI Integration

### Gemini AI
- Soil analysis
- Crop recommendations

### OpenAI GPT-4
- Crop health diagnosis (vision)
- Conversational assistance

### Perplexity
- Government schemes lookup
- Real-time agricultural data

## 📱 IoT Integration

ESP32 sensors send data via HTTP POST:

```json
{
  "field_id": "field_001",
  "device_id": "esp32_001",
  "moisture": 45.5,
  "temperature": 28.3,
  "humidity": 65.2,
  "timestamp": "2025-01-20T10:30:00"
}
```

## 🚀 Deployment

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Render
1. Create new Web Service
2. Connect repository
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Docker
```bash
docker build -t rythu-mitra-backend .
docker run -p 8000:8000 rythu-mitra-backend
```

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Input validation with Pydantic
- Environment variable secrets

## 📝 Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License

## 👥 Support

For issues and questions:
- GitHub Issues
- Email: support@rythumitra.com

---

**Built with ❤️ for Indian Farmers**
