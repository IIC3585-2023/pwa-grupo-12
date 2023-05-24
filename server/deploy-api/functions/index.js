/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
initializeApp();
const db = getFirestore();
const docRef = db.collection('subscriptions').doc('client');
// obtenido de https://flaviocopes.com/push-api/#in-the-real-world
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys()
// const PUBLIC_KEY = 'publicKeyPWA';
// const PRIVATE_KEY = 'privateKeyPWA';
// const vapidKeys = {
//   publicKey: PUBLIC_KEY,
//   privateKey: PRIVATE_KEY
// }
webpush.setVapidDetails(
  'mailto:my@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// obtenido de https://flaviocopes.com/push-api/#in-the-real-world
const triggerPush = (subscription, dataToSend) => {
  return webpush.sendNotification(subscription, dataToSend)
  .catch((err) => {
    if (err.statusCode === 410) {
      return deleteSubscriptionFromDatabase(subscription._id)
    } else {
      console.log('Subscription is no longer valid: ', err)
    }
  })
}
const getSubscriptionsFromDatabase = async () => {
  const snapshot = await db.collection('subscriptions').get();
  snapshot.forEach((doc) => {
    data = doc.data();
  });
  return [data];
}

// obtenido de https://flaviocopes.com/push-api/#in-the-real-world
const isValidSaveRequest = (req, res) => {
  if (!req.body || !req.body.endpoint) {
    res.status(400)
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({
      error: {
        id: 'no-endpoint',
        message: 'Subscription must have an endpoint'
      }
    }))
    return false
  }
  return true
}
// obtenido de https://flaviocopes.com/push-api/#in-the-real-world
const saveSubscriptionToDatabase = (subscription) => {
  return new Promise((resolve, reject) => {
    docRef.set(subscription);
  });
}

app.use(cors());

// routes
app.get('/test', async (req, res) => {
  console.log('guardando obj');
  obj = {hola: 1}
  console.log('leyendo obj');
  const snapshot = await db.collection('users').get();
  snapshot.forEach((doc) => {
    data = doc.data();
  });
  res.send(data);
});

// obtenido de https://flaviocopes.com/push-api/#in-the-real-world
app.post('/subscription', async (req, res) => {
  if (!isValidSaveRequest(req, res)) {
    return
  }
  let subscription = {
    endpoint: req.body.endpoint
  }
  docRef.set(subscription)
  .then((subscriptionId) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({ data: { success: true } }))
  })
  .catch((err) => {
    res.status(500)
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({
      error: {
        id: 'unable-to-save-subscription',
        message: 'Subscription received but failed to save it'
      }
    }))
  })
  const snapshot = await db.collection('subscriptions').get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
})

// obtenido de https://flaviocopes.com/push-api/#in-the-real-world
app.get('/images', (req, res) => {
  console.log('Get images')
  let dataToSend = {title: '¡Bienvenido/a!', body: 'Esto es lo que te perdiste mientras no estabas.'};
  return getSubscriptionsFromDatabase()
  .then((subscriptions) => {
    let promiseChain = Promise.resolve()
    for (let i = 0; i < subscriptions.length; i++) {
      const subscription = subscriptions[i]
      promiseChain = promiseChain.then(() => {
        return triggerPush(subscription, dataToSend)
      })
    }
    return promiseChain
  })
  .then(() => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({ data: dataToSend }))
  })
  .catch((err) => {
    res.status(500)
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({
      error: {
        id: 'unable-to-send-messages',
        message: `Failed to send the push ${err.message}`
      }
    }))
  })
})

exports.app = functions.https.onRequest(app);