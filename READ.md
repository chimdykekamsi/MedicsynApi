# MedicSyn API - Rebuild

MedicSyn is a medical adherence app designed to help users stay on track with their medications through reminders, tracking, and notifications. This repository contains the API backend for the app, originally developed during a hackathon and now being rebuilt to improve performance, scalability, and features.

## Features

- User authentication and authorization
- Medication scheduling and reminders
- Secure API endpoints
- Email notifications for adherence tracking
- Token-based verification system

## Technologies Used

- **Node.js** with **Express** for the backend
- **MongoDB** for the database
- **JWT** for authentication
- **TypeScript** for robust and maintainable code
- **Postman** for API testing

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/medicsyn-api.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and configure the following variables:
   ```env
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/medicsyn
   ACCESS_TOKEN_PRIVATE_KEY=your_access_token_key
   REFRESH_TOKEN_PRIVATE_KEY=your_refresh_token_key
   CLIENT_URL=http://localhost:3000
   EMAIL_SERVICE_PROVIDER=your_email_service
   EMAIL_SERVICE_API_KEY=your_email_service_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

The API is documented using swagger:
**Swagger URL:** [http://localhost:3000/api-docs]

## Roadmap

- [ ] Add advanced scheduling features
- [ ] Implement push notifications
- [ ] Enhance analytics for user adherence tracking
- [ ] Integrate with external health services

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the [MIT License](LICENSE).