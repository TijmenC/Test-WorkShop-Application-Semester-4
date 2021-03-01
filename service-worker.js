const cacheName="CACHE_V1";
const appFiles=[
	"/manifest.json",
	"/js/scripts.js",
  "/css/stylesheet-offline.css",
  "/images/bb.gif",
  "/index-offline.html",
  "/images/icons/icon-192x192.png",
  "/images/icons/icon-512x512.png"
];
self.addEventListener("install",(installing)=>{
    console.log("Service Worker: I am being installed, hello world!");
  //Put important offline files in cache on installation of the service worker
    installing.waitUntil(
    caches.open(cacheName).then((cache)=>{
    console.log("Service Worker: Caching important offline files");
    return cache.addAll(appFiles);
  })
);
  });
  
  self.addEventListener("activate",(activating)=>{	
    console.log("Service Worker: All systems online, ready to go!");
  });
  
  self.addEventListener("fetch",(fetching)=>{   
    console.log("Service Worker: User threw a ball, I need to fetch it!");
    fetching.respondWith(
      caches.match(fetching.request.url).then((response)=>{
        console.log("Service Worker: Fetching resource "+fetching.request.url);
        return response||fetch(fetching.request).then((response)=>{
          console.log("Service Worker: Resource "+fetching.request.url+" not available in cache");
          return caches.open(cacheName).then((cache)=>{
              console.log("Service Worker: Caching (new) resource "+fetching.request.url);
            //  cache.put(fetching.request,response.clone());
            return response;
          });
        }).catch(function(){      
          console.log("Service Worker: Fetching online failed, HAALLPPPP!!!");
          //Do something else with the request (respond with a different cached file)
          if (fetching.request.mode === "navigate") { 
            return caches.match("/index-offline.html")
          }
        })
      })
    );
  });
  
  self.addEventListener("push",(pushing)=>{
    var icon = "/images/icons/icon-512x512.png"
      console.log("Service Worker: I received some push data, but because I am still very simple I don't know what to do with it :(");
      if(pushing.data){
        pushdata=JSON.parse(pushing.data.text());		
        console.log("Service Worker: I received this:",pushdata);
        if((pushdata["title"]!="")&&(pushdata["message"]!="")){			
          const options={ body:pushdata["message"], icon: "/images/icons/icon-192x192.png", vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: 'vibration-sample' }
          self.registration.showNotification(pushdata["title"],options);
          console.log("Service Worker: I made a notification for the user");
        } else {
          console.log("Service Worker: I didn't make a notification for the user, not all the info was there :(");			
        }
      }
      
  })

  self.addEventListener("notificationclick",function(clicking){
    const pageToOpen="/";
    const promiseChain=clients.openWindow(pageToOpen);
    event.waitUntil(promiseChain);
  });
  