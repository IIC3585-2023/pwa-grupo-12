const urlParams = new URLSearchParams(window.location.search);
const page = urlParams.get('page') || 100;

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
            applicationServerKey: "BAjli4g8IZem-J1I-ha1zJJJqB_2t-Q3TPVQ9kCFzaHTUN2vUEskKurGhq7XB_rNwRRtKGtrln6tdsjmEgEg-mI"
          }
          // Subscribe the user
          return registration.pushManager.subscribe(options)
        })
        // Get the PushSubscription object
        .then((pushSubscription) => {
          // Send the PushSubscription object to the server
          const stringSubscription = JSON.stringify(pushSubscription);
          const objSubscription = JSON.parse(stringSubscription);

          console.log('string subscription:', stringSubscription);
          console.log('obj subscription:', objSubscription);
          sendToServer(JSON.stringify(objSubscription)).then(() => {
            console.log('fetch');
            fetchImages();
          });
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

const sendToServer = async (subscription) => {
  let reqBody = subscription;
  console.log("body:", reqBody);
  return fetch('https://iic3585-pwa-c4306.web.app/subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: reqBody,

  })
  // .then((res) => {
  //   console.info("res:", res);
  //   if (!res.ok) {
  //     throw new Error('An error occurred')
  //   }
  //   return res.json()
  // })
  // .then((resData) => {
  //   if (!(resData.data && resData.data.success)) {
  //     throw new Error('An error occurred')
  //   }
  // })
}

const container = document.querySelector(".pin_container");

// const showCards = (data) => {
//   let output = "";
//   data
//     .sort(() => Math.random() - 0.5)
//     .forEach(
//       ({ size, href }) =>
//         (output += `
//                <div class="card ${size}">
//                   <img src=${href} />
//                </div>
//                 `)
//     );
//   container.innerHTML = output;
// };

// fetch("https://mocki.io/v1/9b37c079-20e2-4168-b469-f00b63a4762e")
//   .then((response) => response.json())
//   .then((data) =>
//     document.addEventListener("DOMContentLoaded", showCards(data))

const fetchImages = () => {
  console.log('fetch images');
  fetch("https://iic3585-pwa-c4306.web.app/images")
    .then((response) => response.json())
    .then((data) => console.info(data));
    document.addEventListener("DOMContentLoaded", ShowImg());
}

const ShowImg = () => {

  let output = "";
  for (let i = 0; i < page; i++) {
    const size = ["card_small", "card_medium", "card_large"].sort(() => Math.random() - 0.5).slice(0, 1);
    const element = `https://picsum.photos/id/${i}/200/300`;
    output += `
                <div class="card ${size}">
                    <img src=${element} />
                </div>
                  `;
    
  }
  container.innerHTML = output;
}



