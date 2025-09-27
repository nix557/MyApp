import React, { useState, useEffect, useRef } from 'react';

// Komponen utama aplikasi
export default function App() {
  // --- State Management (Tidak ada perubahan) ---
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Halo! Saya adalah asisten AI dengan antarmuka baru. Silakan ajukan pertanyaan Anda.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);
  const chatEndRef = useRef(null);

  // --- Efek Samping (Tidak ada perubahan) ---
  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setShowApiModal(true);
    }

    // --- Kode PWA (tetap sama) ---
    const serviceWorkerCode = `
      const CACHE_NAME = 'gemini-ai-assistant-cache-v1';
      const urlsToCache = ['/', '/index.html'];
      self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache))); });
      self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); });
    `;

    if ('serviceWorker' in navigator) {
      const swBlob = new Blob([serviceWorkerCode], { type: 'application/javascript' });
      const swUrl = URL.createObjectURL(swBlob);
      navigator.serviceWorker.register(swUrl).then(reg => console.log('SW registered:', reg)).catch(err => console.log('SW registration failed:', err));
    }

    const manifest = {
      "name": "Asisten AI Gemini", "short_name": "Asisten AI", "start_url": ".", "display": "standalone",
      "background_color": "#f3f4f6", "theme_color": "#ffffff", "description": "Asisten AI Web menggunakan Gemini 2.5 Flash.",
      "icons": [
        {"src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik05NiAzMkM1OS4xNTggMzIgMjggNjMuMTU4IDI4IDExNEMyOCA0OS4zODUgOTYgMzIgOTYgMzJaIiBmaWxsPSIjNzdFNUZGIi8+CjxwYXRoIGQ9Ik0xNjQgODBDMTY0IDExNi44NDIgMTMzLjg0MiAxNDggOTcgMTQ4QzE3Mi42MTUgMTQ4IDE2NCA4MCAxNjQgODBaIiBmaWxsPSIjNzdFNUZGIi8+CjxwYXRoIGQ9Ik05Ni41IDE2MEMxMzMuMzQyIDE2MCAxNjQuNSAxMjguODQyIDE2NC41IDc4QzE2NC41IDE3NC42MTUgOTYuNSAxNjAgOTYuNSAxNjBaIiBmaWxsPSIjNzcxN0U1Ii8+CjxwYXRoIGQ9Ik0yOCAxMDRDNDQuNTk2IDExMy44NjEgNjcuNjQyIDExOS41IDk2IDExOS41QzEwMi42NzUgMTE5LjUgMTA5LjE0OCAxMTguOTA0IDExNS4zNDcgMTE3Ljk4NkMyOC44NjMgMTE4LjUgMjggMTA0IDI4IDEwNFoiIGZpbGw9IiM3NzE3RTUiLz4KPC9zdmc+Cg==", "sizes": "192x192", "type": "image/svg+xml"},
        {"src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiAceliklebmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNTYgODVDMTU3Ljc1NiA4NSA4MCAxNjEuNzU2IDgwIDMwNEM4MCAxMzEuNjkzIDI1NiA4NSAyNTYgODVaIiBmaWxsPSIjNzdFNUZGIi8+CjxwYXRoIGQ9Ik00MzcuMzMzIDIxMy4zMzNDNDM3LjMzMyAzMTAuOTM5IDM1Ni45MzkgMzkyIDI1OC42NjcgMzkyQzQ2MC4zMDcgMzkyIDQzNy4zMzMgMjEzLjMzMyA0MzsuMzMzIDIxMy4zMzNaIiBmaWxsPSIjNzdFNUZGIi8+CjxwYXRoIGQ9Ik0yNTcuMzMzIDQyNi42NjdDNDU2LjkwOCA0MjYuNjY3IDQzOC42NjcgMzQxLjk3MyA0MzguNjY3IDIwOEM0MzguNjY3IDQ2NS42NDMgMjU3LjMzMyA0MjYuNjY3IDI1JULzMzMyA0MjYuNjY3WiIgZmlsbD0iIzc3MTdFNSIv+CjxwYXRoIGQ9Ik04MCAyNzcuMzMzQzExOC45MjMgMjkxLjg5NiAxNzguNzggMzA1LjMzMyAyNTYgMzA1LjMzM0MyNzMuODAxIDMwNS4zMzMgMjkxLjA2MSAzMDMuNzQ0IDMwNy41OTIgMzAwLjc2M0M3Ni45NjggMzAyIDgwIDI3Ny4zMzMgODAgMjc3LjMzM1oiIGZpbGw9IiM3NzE3RTUiLz4KPC9zdmc+Cg==", "sizes": "512x512", "type": "image/svg+xml"}
      ]
    };
    const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const manifestUrl = URL.createObjectURL(manifestBlob);

    if (!document.querySelector('link[rel="manifest"]')) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = manifestUrl;
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // --- Logika Inti (Tidak ada perubahan) ---
  const callGeminiAPI = async (prompt) => {
    if (!apiKey) {
      setError("API Key tidak ditemukan. Silakan masukkan API Key Anda.");
      setShowApiModal(true);
      setIsLoading(false);
      return;
    }
    setError(null);
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: "Kamu adalah Ai Asisten yang Profesional dan handal serta friendly seperti manusia" }] },
      tools: [{ "google_search": {} }],
    };
    try {
      const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`); }
      const data = await response.json();

      const candidate = data.candidates && data.candidates[0];
      const modelResponse = candidate?.content?.parts?.[0]?.text;

      if (modelResponse) { 
        setMessages(prev => [...prev, { role: 'model', text: modelResponse }]); 
      } else { 
        console.error("Struktur respons tidak valid:", data);
        throw new Error("Gagal mendapatkan teks respons dari model."); 
      }
    } catch (e) {
      console.error(e);
      setError(`Terjadi kesalahan: ${e.message}`);
      setMessages(prev => [...prev, { role: 'model', text: `Maaf, terjadi kesalahan: ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !apiKey) return;
    setMessages(prev => [...prev, { role: 'user', text: userInput }]);
    setIsLoading(true);
    callGeminiAPI(userInput);
    setUserInput('');
  };

  // --- Komponen UI (Tidak ada perubahan) ---
  const ApiKeyModal = () => {
    const [localApiKey, setLocalApiKey] = useState('');
    const handleSaveKey = () => {
      if (!localApiKey.trim()) { alert("API Key tidak boleh kosong."); return; }
      setApiKey(localApiKey);
      localStorage.setItem('gemini-api-key', localApiKey);
      setShowApiModal(false);
      setMessages([{ role: 'model', text: 'API Key berhasil disimpan! Anda bisa memulai percakapan.' }]);
    };
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Masukkan API Key Gemini</h2>
          <p className="text-gray-600 mb-6">Anda bisa mendapatkan API Key dari Google AI Studio.</p>
          <input type="password" value={localApiKey} onChange={(e) => setLocalApiKey(e.target.value)} placeholder="AIza..." className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <button onClick={handleSaveKey} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300">Simpan & Mulai</button>
        </div>
      </div>
    );
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-2xl px-5 py-3 rounded-2xl ${isUser ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-white text-gray-800 shadow-sm rounded-bl-lg'}`}>
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    );
  };

  // --- Render (Tidak ada perubahan) ---
  return (
    <div className="font-sans h-full w-full bg-gray-100 grid grid-rows-[auto_1fr_auto] antialiased">
      {showApiModal && <ApiKeyModal />}

      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 p-4 shadow-sm z-10">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center">Asisten AI Gemini</h1>
      </header>

      <main className="overflow-y-auto p-4 md:p-6 smooth-scroll">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, index) => (<MessageBubble key={index} message={msg} />))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs md:max-w-md lg:max-w-2xl px-5 py-3 rounded-2xl bg-white text-gray-800 shadow-sm flex items-center space-x-2">
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-lg p-4 md:p-6 border-t border-gray-200 z-10">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="relative flex items-center">
            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={!apiKey ? "Masukkan API Key terlebih dahulu..." : (isLoading ? "Sedang menunggu respons..." : "Ketik pesan Anda...")} className="flex-1 w-full px-5 py-3 pr-14 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition" disabled={isLoading || !apiKey}/>
            <button type="submit" disabled={isLoading || !userInput.trim() || !apiKey} className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300">
              {/* PERBAIKAN: Kode SVG yang sudah benar dan tidak duplikat */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}

