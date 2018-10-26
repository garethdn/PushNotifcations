self.addEventListener('push', function (event) {
  const payload = event.data.json();

  console.log(payload);

  const title = payload.messageTitle;
  const options = {
      body: payload.message,
      icon: 'images/branding/favicons/android-chrome-192x192.png',
      badge: 'images/branding/favicons/android-chrome-192x192.png',
      image: payload.image,
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
