import React, { useState, useEffect, useRef } from 'react';

// Komponen untuk ikon SVG
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
);

const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
        <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
);


// Komponen utama aplikasi
export default function App() {
  // State untuk menyimpan input pengguna, riwayat chat, status loading, dan error
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'model',
      text: 'Halo! Saya adalah asisten AI Anda. Silakan ajukan pertanyaan apa pun.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State untuk manajemen Kunci API
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  // Ref untuk auto-scroll ke pesan terbaru
  const chatEndRef = useRef(null);

  // Cek local storage untuk API Key saat komponen dimuat
  useEffect(() => {
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsApiKeySet(true);
    }
  }, []);

  // Fungsi untuk auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  // Fungsi untuk memanggil Gemini API
  const callGeminiAPI = async (history) => {
    setIsLoading(true);
    setError(null);

    if (!apiKey) {
        setError("Kunci API belum diatur.");
        setIsLoading(false);
        return;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const formattedHistory = history.map(msg => ({
      // Gemini mengharapkan 'user' dan 'model' sebagai peran
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // Menyiapkan payload dengan tool google_search
    const payload = {
        contents: formattedHistory,
        tools: [{ "google_search": {} }],
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Terjadi kesalahan pada server.");
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts[0].text) {
        const botMessage = result.candidates[0].content.parts[0].text;
        setChatHistory(prev => [...prev, { role: 'model', text: botMessage }]);
      } else {
         console.log("Respons dari AI tidak mengandung teks.", result);
         setChatHistory(prev => [...prev, { role: 'model', text: "Maaf, saya tidak menerima respons teks yang valid kali ini." }]);
      }

    } catch (err) {
      console.error("Error calling Gemini API:", err);
      setError(err.message);
      setChatHistory(prev => [...prev, { role: 'model', text: `Maaf, terjadi kesalahan: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menyimpan API Key
  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    if (tempApiKey.trim()) {
        localStorage.setItem('geminiApiKey', tempApiKey);
        setApiKey(tempApiKey);
        setIsApiKeySet(true);
        setTempApiKey('');
    }
  };

  // Fungsi untuk menangani pengiriman pesan
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newUserMessage = { role: 'user', text: userInput };
    const updatedHistory = [...chatHistory, newUserMessage];

    setChatHistory(updatedHistory);
    setUserInput('');

    callGeminiAPI(updatedHistory);
  };

  // Komponen untuk bubble chat
  const ChatBubble = ({ message }) => {
    const isUser = message.role === 'user';
    return (
      <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
               <BotIcon />
            </div>
        )}
        <div
          className={`
            max-w-md md:max-w-xl lg:max-w-4xl px-4 py-3 rounded-2xl shadow
            ${isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}
          `}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
         {isUser && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
               <UserIcon />
            </div>
        )}
      </div>
    );
  };

  // Render form API Key jika belum diatur
  if (!isApiKeySet) {
    return (
        <div className="font-sans h-screen w-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Selamat Datang</h2>
                    <p className="text-gray-500 mt-2">Silakan masukkan kunci API Google Gemini Anda untuk memulai.</p>
                </div>
                <form onSubmit={handleApiKeySubmit} className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyIcon />
                        </div>
                        <input
                            type="password"
                            value={tempApiKey}
                            onChange={(e) => setTempApiKey(e.target.value)}
                            placeholder="Kunci API Gemini Anda"
                            className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        Simpan & Mulai Chat
                    </button>
                </form>
                <p className="text-xs text-center text-gray-400">Kunci API Anda disimpan dengan aman di peramban Anda.</p>
            </div>
        </div>
    );
  }

  // Render UI Chat utama
  return (
    <div className="font-sans h-screen w-screen bg-gray-50 flex flex-col antialiased">
      <header className="bg-white border-b border-gray-200 p-4 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Asisten AI Cerdas</h1>
        <p className="text-sm text-gray-500">Didukung oleh Gemini 2.5 Flash & Google Search</p>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {chatHistory.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
             <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
               <BotIcon />
            </div>
            <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none p-3 shadow">
                <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-500">AI sedang mengetik</span>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>
      <footer className="bg-white border-t border-gray-200 p-2 md:p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ketik pesan Anda di sini..."
            className="flex-1 w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
          >
            <SendIcon />
          </button>
        </form>
      </footer>
    </div>
  );
}
