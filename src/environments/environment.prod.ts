export const environment = {
  production: true,
  
  // Supabase Configuration
  supabaseUrl: 'https://your-production-project.supabase.co',
  supabaseKey: 'your-production-anon-key',
  
  // Google Maps API
  googleMapsApiKey: 'YOUR_PRODUCTION_GOOGLE_MAPS_API_KEY',
  
  // Payment Providers
  stripe: {
    publishableKey: 'pk_live_your_production_stripe_key',
    secretKey: 'sk_live_your_production_stripe_secret'
  },
  transbank: {
    commerceCode: 'your_production_transbank_commerce_code',
    apiKey: 'your_production_transbank_api_key',
    environment: 'production'
  },
  mercadopago: {
    publicKey: 'APP_USR-your-production-mercadopago-public-key',
    accessToken: 'APP_USR-your-production-mercadopago-access-token'
  },
  
  // Email Services
  resend: {
    apiKey: 're_your_production_resend_api_key'
  },
  sendgrid: {
    apiKey: 'SG.your_production_sendgrid_api_key'
  },
  
  // SMS Services
  twilio: {
    accountSid: 'your_production_twilio_account_sid',
    authToken: 'your_production_twilio_auth_token',
    phoneNumber: '+56912345678'
  },
  
  // Push Notifications
  firebase: {
    apiKey: 'your_production_firebase_api_key',
    authDomain: 'voyalaeropuerto-prod.firebaseapp.com',
    projectId: 'voyalaeropuerto-prod',
    storageBucket: 'voyalaeropuerto-prod.appspot.com',
    messagingSenderId: '987654321',
    appId: 'your_production_firebase_app_id',
    vapidKey: 'your_production_vapid_key'
  },
  
  // Analytics
  googleAnalytics: {
    measurementId: 'G-PRODUCTION-ID'
  },
  
  // External APIs
  apis: {
    weatherApi: 'your_production_weather_api_key',
    currencyExchange: 'your_production_currency_api_key',
    geocoding: 'your_production_geocoding_api_key'
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
    nightSurcharge: 1.5,
    holidaySurcharge: 1.3,
    
    // Commission
    driverCommissionPercent: 80,
    platformFeePercent: 20
  }
};
