if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    console.log('ServiceWorker registration failed: ', err);
  }
  )
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
