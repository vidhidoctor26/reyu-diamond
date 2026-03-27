importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAXqs2wsbRqhoLToXSeS9isqIvrfPd_ub4",
  authDomain: "reyu-diamond-app-bf9f0.firebaseapp.com",
  projectId: "reyu-diamond-app-bf9f0",
  storageBucket: "reyu-diamond-app-bf9f0.firebasestorage.app",
  messagingSenderId: "649004543118",
  appId: "1:649004543118:web:b69ca0ce51f2841f7c6ddf"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
    data: payload.data 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data;
  
  let url = '/user/notifications';
  if (data?.type === 'CHAT') url = `/user/messages?id=${data.conversationId}`;
  if (data?.type === 'DEAL') url = `/user/deals/${data.dealId}`;

  event.waitUntil(
    clients.openWindow(url)
  );
});