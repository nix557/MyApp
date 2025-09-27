// Nama cache
const CACHE_NAME = 'asisten-ai-cache-v1';
// Daftar file yang akan di-cache (app shell)
const urlsToCache = [
  '/',
  '/index.html',
  // Tambahkan path ke aset utama Anda di sini (misal: /assets/index-....js, /assets/index-....css)
  // Vite akan menghasilkan nama file dengan hash, jadi ini perlu disesuaikan setelah build.
  // Untuk kesederhanaan, kita akan cache halaman utama saja saat install.
];

// Event 'install': Menyimpan aset ke cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event 'fetch': Menyajikan aset dari cache jika tersedia
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika aset ditemukan di cache, kembalikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak, ambil dari jaringan
        return fetch(event.request);
      })
  );
});
