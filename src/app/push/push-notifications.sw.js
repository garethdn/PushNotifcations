self.addEventListener('push', function (event) {
  const payload = event.data.json();

  console.log(payload);

  const image = getRandomImage();
  console.log(image);
  const title = payload.messageTitle;
  const options = {
      body: payload.message,
      icon: 'images/branding/favicons/android-chrome-192x192.png',
      badge: 'images/branding/favicons/android-chrome-192x192.png',
      // image: payload.image,
      image: image,
      actions: [
        {
          action: 'panel-action',
          title: 'View Panel'
        },
        {
          action: 'article-action',
          title: 'View Article'
        }
      ]
  };

  const notificationPromise = self.registration.showNotification(title, options);
  event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', function (event) {
  let url = 'https://spike.newswhip.com/';

  event.notification.close();

  if (event.action === 'panel-action') {
    url = 'https://spike.newswhip.com/#/browse?id=23613&timeFrom=1535295418000&content=facebookPosts&youtubeOrderBy=ByYtLikes&Domain=nytimes.com&FacebookPage=The%20New%20York%20Times&InstagramUserName=nytimes&TwitterHandle=nytimes';
  }

  if (event.action === 'article-action') {
    url = 'https://www.nytimes.com/2018/09/03/sports/kaepernick-nike.html?smid=fb-nytimes&smtyp=cur';
  }

  event.waitUntil(
    clients.openWindow(url)
  );
});

let images = [
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fcdn.theatlantic.com%2Fassets%2Fmedia%2Fimg%2Fmt%2F2018%2F10%2FRTX6GF1U%2Ffacebook.jpg%3F1540569244&width=150&height=150&d=-xtK0YvXSUXULQzyehvAA1Z2M-4h7DTUcbhS3n27TJM",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=http%3A%2F%2Fpoliticalnewswire.org%2Fwp-content%2Fuploads%2F2018%2F10%2Fyelltrump88aga-1000x600.jpg&width=150&height=150&d=o31VMYyeHV7eC-a-enb3SbcVXDw9MW-XGmQZRWhFXjY",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2F6.viki.io%2Fimage%2F5bbc0b01712d4b9fb53150ed4c7fdcc4.jpeg%3Fs%3D900x600%26e%3Dt&width=150&height=150&d=KH8aNgq-armDo6kKzFz5G0ET6J6_N6tZ2gjmhL8NCXA",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fichef.bbci.co.uk%2Fnews%2F1024%2Fbranded_news%2F5CF1%2Fproduction%2F_104039732_capture.jpg&width=150&height=150&d=T8SB8NyJ8YdgobkswiDhOGmatc3Ct9v-rB68YK8R7HA",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=http%3A%2F%2Fphotos.motogp.com%2F2018%2F10%2F26%2F35-cal-crutchlow-eng_lg54268.big.jpg&width=150&height=150&d=TRPyTcgnIFYh9LAetmrKjQkVgYx7EaJYUVNdPTBAahc",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fwww.bdcrictime.com%2Fwp-content%2Fuploads%2F2018%2F10%2FAB-de-Villiers-min-1024x576.jpg&width=150&height=150&d=qJxPd4V2vu8F1qU1ULszk5DNJiDOSqNMFS938ZJIbEA",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=http%3A%2F%2Fwww.metalinjection.net%2Fwp-content%2Fuploads%2F2018%2F08%2FAug-9-Heavy-Day-2-44-750x501.jpg&width=150&height=150&d=R5KBqVW5UVT0z8t2ktTVqRVdnXEbeGItNsNMh7VscSY",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fwww.louderwithcrowder.com%2Fwp-content%2Fuploads%2F2018%2F10%2FCesarSoyac-1200x630.jpg&width=150&height=150&d=SfHVP7WQtdLp2Q9XGc_cSMlsAIKUdt7CFNg91aGR-eY",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fwww.arsenal.com%2Fsites%2Fdefault%2Ffiles%2Fimages%2Fnacho_5.jpg&width=150&height=150&d=nVJZdp6RNjimynSSh8Ji_bR6a5AVff5I6FvNowqVuJQ",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Ftheintercept.imgix.net%2Fwp-uploads%2Fsites%2F1%2F2018%2F10%2F26-10-2018-foto-censurado-1540573947.jpg%3Fauto%3Dcompress%252Cformat%26q%3D90%26fit%3Dcrop%26w%3D1200%26h%3D800&width=150&height=150&d=n-TgRcwRCaHiVoMRoyZbMrNEM1YT45lUnmPQ9ZIKnKk",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fwm-pull-zone-jrgifofmw0p2vcg.netdna-ssl.com%2Fwp-content%2Fuploads%2F2018%2F10%2FScreenshot-2018-10-26-07.24.45.png&width=150&height=150&d=F7IeXp-TYWDhlu1SM3tzAazbkn0Ccdf1mhFyONAO-wo",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fwww.thisisanfield.com%2Fwp-content%2Fuploads%2FP180901-054-Leicester_Liverpool-e1535804947297.jpg&width=150&height=150&d=dsI0a49vHNfXGgZqImDKMSqTnaK4PWjq5ZJGB3naqCw",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fmetrouk2.files.wordpress.com%2F2018%2F10%2Fsei_36954958-c75e3.jpg%3Fquality%3D80%26strip%3Dall%26w%3D1200%26h%3D630%26crop%3D1%26resize%3D1200%252C630%26zoom%3D1&width=150&height=150&d=YvkWF62PnKVbjDitkNFMA64AIeNK-6tZTYC4XEzDVG0",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Ftimedotcom.files.wordpress.com%2F2018%2F10%2F69mustang_boss429.jpg%3Fquality%3D85&width=150&height=150&d=_1H2ABgnt-fSijd1bCxaqKmIexyk4e0o7Jd9SYenD4M",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fi.guim.co.uk%2Fimg%2Fmedia%2F0a421f075f5e0b2bd93f11ac365d61d6a096772a%2F0_216_4000_2399%2Fmaster%2F4000.jpg%3Fwidth%3D1200%26height%3D630%26quality%3D85%26auto%3Dformat%26fit%3Dcrop%26overlay-align%3Dbottom%252Cleft%26overlay-width%3D100p%26overlay-base64%3DL2ltZy9zdGF0aWMvb3ZlcmxheXMvdGctb3BpbmlvbnMucG5n%26s%3D2fb6849521e092b7585b5d974158eb61&width=150&height=150&d=hKAfYMjrJP6lnGu3TRPvwXtEFZzpUz7mzbE_S2zPGao",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fcheesecake.articleassets.meaww.com%2F26124%2Fuploads%2F2ff9dc3e26ee7d344167c6bdde0a4aa6_800_420.jpeg&width=150&height=150&d=kXCkS42OIPpsoNxM3v_lyyOacb2mVYveTj4vfMhIwKw",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fvideo-images.vice.com%2Farticles%2F5bd342cb595ea8000612676a%2Flede%2F1540572021954-Screen-Shot-2018-10-26-at-123950-PM.png%3Fcrop%3D1xw%3A0.8386889460154242xh%3Bcenter%2Ccenter&width=150&height=150&d=7V1CenSRC47lDsYQv6LCjdBz62tz4Eu73BUq7O21oNQ",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Filovemydogsomuch.tv%2Fwp-content%2Fuploads%2F2018%2F10%2Fhomeless-pup-feat.png&width=150&height=150&d=QQvDZtBN8BXOIKHAsx8S7A7PIulf8uqZri9F-bT05a0",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fimage-cdn.hypb.st%2Fhttps%253A%252F%252Fhypebeast.com%252Fimage%252F2018%252F10%252Funiqlo-kaws-sesame-street-second-collection-tw.jpg%3Fw%3D960%26cbr%3D1%26q%3D90%26fit%3Dmax&width=150&height=150&d=vg1j5V8RzlI7lcC1b1dE2d_86PtuHtZkhYQWhINKoPI",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fimages.tmz.com%2F2018%2F10%2F26%2F1026-ronnie-jen-harley-tmz-insta-01-1200x630.jpg&width=150&height=150&d=2-2qei1B_wdntVJjIqdNrystvCy2ifLxwiIwb-86XeA",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fsa.kapamilya.com%2Fabsnews%2Fabscbnnews%2Fmedia%2F2017%2Flogos%2Fsmart-logo-2017.jpg&width=150&height=150&d=OzYh3IujMD4m6PC9__8bWZRiDWwc-dqujwKy6KMKDmY",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=http%3A%2F%2Fbeta.ems.ladbiblegroup.com%2Fs3%2Fcontent%2F808x455%2F4c2506755bd3cf09e37109a97e1bb67a.png&width=150&height=150&d=2-NkBNldoJWvkqj0VFuvE71PmZEaPUE_Nk-YnlTdHNU",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fwww.showbiztrends.net%2Fwp-content%2Fuploads%2F2018%2F10%2F26%2FPH05_THUMB.jpg&width=150&height=150&d=WNV45XPGTgCnasjiwrZpJqNTLfcV-d5W2LZy9fKk7us",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fsa.kapamilya.com%2Fabsnews%2Fabscbnnews%2Fmedia%2F2018%2Fnews%2F10%2F26%2F20181026-joliibee.jpg%3Fext%3D.jpg&width=150&height=150&d=rh4Y_5BESK6Nb7sApva5l-EHyet9OTYE56O6C_1cTHw",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fwww.dailywire.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fopen_graph%2Fpublic%2Fuploads%2F2018%2F10%2Fct.jpg%3Fitok%3D1BT_mtF7&width=150&height=150&d=PKrzokPC5U_w1gRcHpgZtPMmi3fRw0HiFn-0rbLBtVU",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fnetstorage-kami.akamaized.net%2Fimages%2Fb549a2cd2be5340f.jpg&width=150&height=150&d=pPz-NQLRrubi994jgR5KglKWPAHKs-oPwIQDLby_dRo",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fwww.rollingstone.com%2Fwp-content%2Fuploads%2F2018%2F10%2Fshutterstock_9939444bg.jpg&width=150&height=150&d=sGfPjZCY390eIMSFUSe79dL7Kw8MDRT5ax42kqv-WXQ",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fwww.greaterkashmir.com%2Fcms%2Fgall_content%2F2018%2F10%2F2018_10%24largeimg226_Oct_2018_174434200.jpg&width=150&height=150&d=6-ZsoEbocwlM0M9CL7oav9CCRZVqCmXlDaar6aAt2GQ",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Ffilmfare.wwmindia.com%2Fcontent%2F2018%2Foct%2Fso1540550035.jpg&width=150&height=150&d=v5bF3Vakr2h7AleBLnzDvnQ_gEe78lz1sVLDh_dGDFk",
  "https://d20v9nqgtkp2t3.cloudfront.net/safeImage?url=https%3A%2F%2Fstatic.toiimg.com%2Fthumb%2Fmsid-66383387%2Cwidth-1070%2Cheight-580%2Cimgsize-1304909%2Cresizemode-6%2Coverlay-toi_sw%2Cpt-32%2Cy_pad-40%2Fphoto.jpg&width=150&height=150&d=nhR0sbcJKCZ25PJEoAyf7cjOe3hL5jDeakY0vpB_P1w"
];

function getRandomImage() {
  return images[Math.floor(Math.random()*items.length)];
}
