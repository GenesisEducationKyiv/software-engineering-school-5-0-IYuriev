# 🌦 Weather Subscription Service

Welcome to the Weather Subscription Service! Stay ahead of the forecast with real-time weather updates for your chosen city, delivered straight to your inbox. Built with modern technologies, this project is perfect for weather enthusiasts and developers alike! 🚀

## ✨ Features

- **Real-Time Weather Data**: Fetch current temperature, humidity, and weather conditions for any city.
- **Email Subscriptions**: Subscribe to receive weather updates via email for your selected city.
- **Customizable Updates**: Choose hourly or daily weather notifications.
- **Secure Subscription Flow**: Confirm subscriptions with a secure email link.
- **One-Click Unsubscribe**: Easily opt out with a single click from any email.
- **Responsive UI**: Intuitive web interface with seamless error handling.

## 🖥 Demo UI

Access a user-friendly web interface to:

- Check real-time weather by entering a city name.
- Subscribe to weather updates with your email, city, and preferred frequency.
- Confirm or unsubscribe via secure email links.
- Enjoy responsive notifications for a smooth user experience.

🔗 **Try it live**: [Weather Subscription Service](https://weather-subscription-service.vercel.app)

## 🛠 API Endpoints

| Method | Endpoint                    | Description                                      |
|--------|-----------------------------|--------------------------------------------------|
| GET    | `/api/weather?city={city}`  | Retrieve current weather data for a city.        |
| POST   | `/api/subscribe`            | Subscribe an email for weather updates.          |
| GET    | `/api/confirm/{token}`      | Confirm subscription via secure token.           |
| GET    | `/api/unsubscribe/{token}`  | Unsubscribe from weather updates via token.      |

### Example: Get Weather

```http
GET http://localhost:3000/api/weather?city=London
```

Response:

```json
{
  "temperature": 21,
  "humidity": 60,
  "description": "Partly cloudy"
}
```

### Example: Subscribe

```http
POST http://localhost:3000/api/subscribe

{
  "email": "user@example.com",
  "city": "London",
  "frequency": "daily"
}
```

Response:

```json
{
  "message": "Subscription successful. Please check your email to confirm."
}
```

## 📦 Tech Stack

- **Backend**: Node.js, NestJS, Redis (for caching and performance)
- **Database**: PostgreSQL with Prisma ORM
- **Email Service**: Nodemailer for reliable email delivery
- **Weather Data**: WeatherAPI.com for accurate forecasts
- **Frontend**: HTML, CSS, JavaScript (lightweight and responsive)
- **Deployment**: Vercel for seamless hosting

## ⚙️ CI/CD Pipeline

This project includes a GitHub Actions-based **CI/CD pipeline** that automatically runs linting, tests, and builds the application on every push or pull request to the `main` branch. This ensures code quality and prevents regressions before deployment.

## 🚀 Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/IYuriev/weather-subscription-service.git
cd weather-subscription-service
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy `env.example` to `.env.*`, `env.test.example` to `.env.test` and add your configuration:

```bash 
# Email
cp apps/email/env.example apps/email/.env.email
cp apps/email/env.test.example apps/email/.env.test

# Gateway
cp apps/gateway/env.example apps/gateway/.env
cp apps/gateway/env.test.example apps/gateway/.env.test

# Subscription
cp apps/subscription/env.example apps/subscription/.env.gateway
cp apps/subscription/env.test.example apps/subscription/.env.test

# Weather
cp apps/weather/env.example apps/weather/.env.weather
cp apps/weather/env.test.example apps/weather/.env.test

# Notification
cp apps/notification/env.example apps/notification/.env.notification
cp apps/notification/env.test.example apps/notification/.env.test
```

## 🔑 How to Fill Environment Variables

To get the project running smoothly, you’ll need to populate the `.env` and `.env.test` files with the following secrets:

- `API_KEY` – Get your free Weather API key at [weatherapi.com](https://www.weatherapi.com/).
- `EMAIL_USER` and `EMAIL_PASS` – Use a Gmail account and generate an [App Password](https://support.google.com/accounts/answer/185833) to enable secure email sending via Nodemailer.

> ✅ Make sure **"Less secure app access" is disabled** and **2FA is enabled** for Gmail App Passwords to work.

4. Run the application:

```bash
docker-compose up --build
```

5. Access the UI:

Visit the live demo: [Weather Subscription Service](https://weather-subscription-service.vercel.app)

## ✅ Testing

The project includes comprehensive test coverage using **Jest** and **Supertest** with unit, integration, and architecture tests.

For detailed testing instructions and commands, please refer to [testing.md](testing.md).

## 📨 Email Templates

- **Confirmation Email**: Contains a secure link to verify your subscription.
- **Weather Update**: Displays current weather details with an unsubscribe link.
- **Unsubscribe Confirmation**: Confirms successful unsubscription with a friendly message.

## 🛡 Security & Validation

- Input Validation: Ensures city, email, and frequency inputs are valid.
- Secure Tokens: Uses cryptographically secure tokens for subscription confirmation and unsubscription.
- Rate Limiting: Prevents abuse of API endpoints.
- Error Handling: Comprehensive logging and user-friendly error messages.
- Data Privacy: No personal data is stored beyond what’s necessary for functionality.

---

**Enjoy staying weather-ready!** 🌈

---
## 👤 Author
**Illia Yuriev**  
Telegram: [@ilya_yuriev](https://t.me/ilya_yuriev)  
Email: ilya.yuriev.s@gmail.com
