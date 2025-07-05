// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "your_firebase_api_key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your_firebase_app_id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'Voy al Aeropuerto';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.icon || '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    image: payload.notification?.image,
    data: payload.data || {},
    actions: getNotificationActions(payload.data?.type),
    requireInteraction: shouldRequireInteraction(payload.data?.type),
    tag: payload.data?.type || 'general',
    timestamp: Date.now()
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  // Handle different actions
  switch (action) {
    case 'call':
      handleCallAction(data);
      break;
    case 'message':
      handleMessageAction(data);
      break;
    case 'accept':
      handleAcceptBooking(data);
      break;
    case 'decline':
      handleDeclineBooking(data);
      break;
    case 'rate':
      handleRateTrip(data);
      break;
    case 'book':
      handleBookNow(data);
      break;
    case 'reschedule':
      handleReschedule(data);
      break;
    case 'locate':
      handleShowLocation(data);
      break;
    case 'ready':
      handlePassengerReady(data);
      break;
    case 'receipt':
      handleShowReceipt(data);
      break;
    case 'contact':
      handleContactSupport(data);
      break;
    default:
      // Default action - open the app
      openApp(data);
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  
  // Track notification dismissal analytics
  trackNotificationDismissal(event.notification.data);
});

// Helper functions
function getNotificationActions(type) {
  switch (type) {
    case 'driver_assigned':
      return [
        { action: 'call', title: '📞 Llamar', icon: '/assets/icons/call.png' },
        { action: 'message', title: '💬 Mensaje', icon: '/assets/icons/message.png' }
      ];
    case 'driver_arriving':
      return [
        { action: 'ready', title: '✅ Estoy Listo', icon: '/assets/icons/ready.png' }
      ];
    case 'driver_arrived':
      return [
        { action: 'locate', title: '📍 Ver Ubicación', icon: '/assets/icons/location.png' },
        { action: 'call', title: '📞 Llamar', icon: '/assets/icons/call.png' }
      ];
    case 'trip_completed':
      return [
        { action: 'rate', title: '⭐ Calificar', icon: '/assets/icons/star.png' },
        { action: 'receipt', title: '🧾 Recibo', icon: '/assets/icons/receipt.png' }
      ];
    case 'new_booking':
      return [
        { action: 'accept', title: '✅ Aceptar', icon: '/assets/icons/accept.png' },
        { action: 'decline', title: '❌ Rechazar', icon: '/assets/icons/decline.png' }
      ];
    case 'promotion':
      return [
        { action: 'book', title: '🚗 Reservar Ahora', icon: '/assets/icons/book.png' }
      ];
    case 'flight_delay':
      return [
        { action: 'reschedule', title: '📅 Reprogramar', icon: '/assets/icons/reschedule.png' },
        { action: 'contact', title: '📞 Contactar', icon: '/assets/icons/contact.png' }
      ];
    default:
      return [];
  }
}

function shouldRequireInteraction(type) {
  const interactiveTypes = [
    'driver_assigned',
    'driver_arriving', 
    'driver_arrived',
    'trip_completed',
    'new_booking',
    'promotion',
    'flight_delay'
  ];
  
  return interactiveTypes.includes(type);
}

function handleCallAction(data) {
  if (data.driverPhone) {
    openApp({ action: 'call', phone: data.driverPhone });
  }
}

function handleMessageAction(data) {
  if (data.driverPhone) {
    openApp({ action: 'sms', phone: data.driverPhone });
  }
}

function handleAcceptBooking(data) {
  openApp({ action: 'accept_booking', ...data });
}

function handleDeclineBooking(data) {
  openApp({ action: 'decline_booking', ...data });
}

function handleRateTrip(data) {
  openApp({ action: 'rate_trip', ...data });
}

function handleBookNow(data) {
  openApp({ action: 'book_now', ...data });
}

function handleReschedule(data) {
  openApp({ action: 'reschedule', ...data });
}

function handleShowLocation(data) {
  openApp({ action: 'show_location', ...data });
}

function handlePassengerReady(data) {
  openApp({ action: 'passenger_ready', ...data });
  
  // Also send status update to driver
  fetch('/api/passenger-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'ready', ...data })
  });
}

function handleShowReceipt(data) {
  openApp({ action: 'show_receipt', ...data });
}

function handleContactSupport(data) {
  openApp({ action: 'contact_support', ...data });
}

function openApp(data = {}) {
  const urlToOpen = new URL('/', self.location.origin);
  
  // Add action data as URL parameters
  if (data.action) {
    urlToOpen.searchParams.set('action', data.action);
    
    Object.keys(data).forEach(key => {
      if (key !== 'action') {
        urlToOpen.searchParams.set(key, data[key]);
      }
    });
  }
  
  // Check if the app is already open
  return clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((clientList) => {
    // Find existing window
    for (let i = 0; i < clientList.length; i++) {
      const client = clientList[i];
      if (client.url.startsWith(self.location.origin) && 'focus' in client) {
        // Post message to existing window
        client.postMessage({
          type: 'NOTIFICATION_ACTION',
          data: data
        });
        return client.focus();
      }
    }
    
    // Open new window if none exists
    return clients.openWindow(urlToOpen.toString());
  });
}

function trackNotificationDismissal(data) {
  // Send analytics event for notification dismissal
  if (data && data.type) {
    fetch('/api/analytics/notification-dismissed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: data.type,
        timestamp: Date.now()
      })
    }).catch(err => console.log('Analytics error:', err));
  }
}

// Periodic background sync for notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-notifications') {
    event.waitUntil(processScheduledNotifications());
  }
});

async function processScheduledNotifications() {
  try {
    // Check for scheduled notifications in IndexedDB
    const scheduledNotifications = await getScheduledNotifications();
    const now = Date.now();
    
    for (const notification of scheduledNotifications) {
      if (notification.scheduledTime <= now) {
        // Show the notification
        await self.registration.showNotification(
          notification.title,
          {
            body: notification.body,
            icon: notification.icon,
            badge: notification.badge,
            data: notification.data,
            actions: notification.actions,
            requireInteraction: notification.requireInteraction,
            tag: notification.tag
          }
        );
        
        // Remove from scheduled notifications
        await removeScheduledNotification(notification.id);
      }
    }
  } catch (error) {
    console.error('Error processing scheduled notifications:', error);
  }
}

// IndexedDB operations for scheduled notifications
async function getScheduledNotifications() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VoyAlAeropuertoNotifications', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['notifications'], 'readonly');
      const store = transaction.objectStore('notifications');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('notifications')) {
        const store = db.createObjectStore('notifications', { keyPath: 'id' });
        store.createIndex('scheduledTime', 'scheduledTime', { unique: false });
      }
    };
  });
}

async function removeScheduledNotification(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VoyAlAeropuertoNotifications', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['notifications'], 'readwrite');
      const store = transaction.objectStore('notifications');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Handle push events (for when app is closed)
self.addEventListener('push', (event) => {
  console.log('Push received:', event);
  
  let data = {};
  
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    console.error('Error parsing push data:', error);
  }
  
  const title = data.title || 'Voy al Aeropuerto';
  const options = {
    body: data.body || '',
    icon: data.icon || '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    image: data.image,
    data: data.data || data,
    actions: getNotificationActions(data.type),
    requireInteraction: shouldRequireInteraction(data.type),
    tag: data.type || 'general',
    timestamp: Date.now()
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
