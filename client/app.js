const APP_SERVER_KEY = 'XXX';

// Check if Service Workers are supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Register a Service Worker
    navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registration completed with scope: ', registration.scope)
      // Check if the Push API is supported
      if ('PushManager' in window) {
        // Request permission from the user
        askPermission()
        .then(() => {
          const options = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(APP_SERVER_KEY)
          }
          // Subscribe the user
          return registration.pushManager.subscribe(options)
        })
        // Get the PushSubscription object
        .then((pushSubscription) => {
          // Send the PushSubscription object to the server
          const subscription = JSON.stringify(pushSubscription)
          sendToServer(subscription)
        })
      } else {
        console.log('Push Api not supported')
      }
    }, (err) => {
      console.log('Service Worker registration failed', err)
    })
  })
} else {
  console.log('Service Workers not supported')
}

const askPermission = () => {
  return new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission((result) => {
      resolve(result)
    })
    if (permissionResult) {
      permissionResult.then(resolve, reject)
    }
  })
  .then((permissionResult) => {
    if (permissionResult !== 'granted') {
      throw new Error('Permission denied')
    }
  })
}

const sendToServer = (subscription) => {
  return fetch('/subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error('An error occurred')
    }
    return res.json()
  })
  .then((resData) => {
    if (!(resData.data && resData.data.success)) {
      throw new Error('An error occurred')
    }
  })
}

const container = document.querySelector(".pin_container");
const cards = [
  {
    size: "card_small",
    href: "https://i.pinimg.com/564x/be/a6/63/bea66381745b0a1d2c49e04e61b8da22.jpg",
  },
  {
    size: "card_medium",
    href: "https://i.pinimg.com/564x/09/f0/28/09f028217e4d25a3e12580639fe09dee.jpg",
  },
  {
    size: "card_large",
    href: "https://i.pinimg.com/564x/f8/15/3c/f8153cced78cf4e42457a9ae45af45da.jpg",
  },
  {
    size: "card_small",
    href: "https://i.pinimg.com/564x/be/a6/63/bea66381745b0a1d2c49e04e61b8da22.jpg",
  },
  {
    size: "card_medium",
    href: "https://i.pinimg.com/564x/09/f0/28/09f028217e4d25a3e12580639fe09dee.jpg",
  },
  {
    size: "card_large",
    href: "https://i.pinimg.com/564x/f8/15/3c/f8153cced78cf4e42457a9ae45af45da.jpg",
  },
  {
    size: "card_small",
    href: "https://i.pinimg.com/564x/be/a6/63/bea66381745b0a1d2c49e04e61b8da22.jpg",
  },
  {
    size: "card_medium",
    href: "https://i.pinimg.com/564x/09/f0/28/09f028217e4d25a3e12580639fe09dee.jpg",
  },
  {
    size: "card_large",
    href: "https://i.pinimg.com/564x/f8/15/3c/f8153cced78cf4e42457a9ae45af45da.jpg",
  },
  {
    size: "card_small",
    href: "https://i.pinimg.com/564x/be/a6/63/bea66381745b0a1d2c49e04e61b8da22.jpg",
  },
  {
    size: "card_medium",
    href: "https://i.pinimg.com/564x/09/f0/28/09f028217e4d25a3e12580639fe09dee.jpg",
  },
  {
    size: "card_large",
    href: "https://i.pinimg.com/564x/f8/15/3c/f8153cced78cf4e42457a9ae45af45da.jpg",
  },
  {
    size: "card_small",
    href: "https://i.pinimg.com/564x/be/a6/63/bea66381745b0a1d2c49e04e61b8da22.jpg",
  },
  {
    size: "card_medium",
    href: "https://i.pinimg.com/564x/09/f0/28/09f028217e4d25a3e12580639fe09dee.jpg",
  },
  {
    size: "card_large",
    href: "https://i.pinimg.com/564x/f8/15/3c/f8153cced78cf4e42457a9ae45af45da.jpg",
  },
  {
    size: "card_small",
    href: "https://i.pinimg.com/564x/be/a6/63/bea66381745b0a1d2c49e04e61b8da22.jpg",
  },
  {
    size: "card_medium",
    href: "https://i.pinimg.com/564x/09/f0/28/09f028217e4d25a3e12580639fe09dee.jpg",
  },
  {
    size: "card_large",
    href: "https://i.pinimg.com/564x/f8/15/3c/f8153cced78cf4e42457a9ae45af45da.jpg",
  }
];

const showCards = () => {
  let output = "";
  cards
    .sort(() => Math.random() - 0.5)
    .forEach(
      ({ size, href }) =>
        (output += `
               <div class="card ${size}">
                  <img src=${href} />
               </div>
                `)
    );
  container.innerHTML = output;
};

document.addEventListener("DOMContentLoaded", showCards);
