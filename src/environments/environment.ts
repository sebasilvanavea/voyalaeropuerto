export const environment = {
  production: false,
  
  // Supabase Configuration
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseKey: 'your-anon-key',
  
  // API Configuration
  apiUrl: 'http://localhost:3000/api',
  appUrl: 'http://localhost:4200',
  
  // Google Maps API
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  
  // Payment Providers
  stripe: {
    publishableKey: 'pk_test_your_stripe_key',
    secretKey: 'sk_test_your_stripe_secret'
  },
  stripePublishableKey: 'pk_test_your_stripe_key', // Legacy compatibility
  
  transbank: {
    commerceCode: 'your_transbank_commerce_code',
    apiKey: 'your_transbank_api_key',
    environment: 'integration' // 'integration' or 'production'
  },
  mercadopago: {
    publicKey: 'TEST-your-mercadopago-public-key',
    accessToken: 'TEST-your-mercadopago-access-token'
  },
  
  // Email Services
  resend: {
    apiKey: 're_your_resend_api_key'
  },
  sendgrid: {
    apiKey: 'SG.your_sendgrid_api_key'
  },
  
  // SMS Services
  twilio: {
    accountSid: 'your_twilio_account_sid',
    authToken: 'your_twilio_auth_token',
    phoneNumber: '+1234567890'
  },
  
  // Push Notifications
  firebase: {
    apiKey: 'your_firebase_api_key',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '123456789',
    appId: 'your_firebase_app_id',
    vapidKey: 'your_vapid_key'
  },
  
  // Analytics
  googleAnalytics: {
    measurementId: 'G-XXXXXXXXXX'
  },
  
  // External APIs
  apis: {
    weatherApi: 'your_weather_api_key',
    currencyExchange: 'your_currency_api_key',
    geocoding: 'your_geocoding_api_key'
  },
  
  // Application Settings
  app: {
    name: 'Voy al Aeropuerto',
    version: '1.0.0',
    supportEmail: 'support@voyalaeropuerto.com',
    supportPhone: '+56912345678',
    defaultLanguage: 'es',
    defaultCurrency: 'CLP',
    timezone: 'America/Santiago',
    
    // Business Rules
    maxAdvanceBookingDays: 30,
    cancellationWindowHours: 2,
    driverRadiusKm: 50,
    maxPassengers: 8,
    
    // Pricing
    baseFare: 5000,
    perKmRate: 800,
    airportSurcharge: 2000,
    nightSurcharge: 1.5, // multiplier
    holidaySurcharge: 1.3, // multiplier
    
    // Commission
    driverCommissionPercent: 80,
    platformFeePercent: 20
  }
};