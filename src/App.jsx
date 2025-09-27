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

// Komponen untuk bubble chat
const ChatBubble = ({ role, text, isLoading = false }) => {
  const isUser = role === 'user';

  if (isLoading) {
    return (
      <div className="flex justify-start items-center space-x-4 p-2">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
          <BotIcon />
        </div>
        <div className="bg-gray-200 rounded-lg p-3 max-w-md md:max-w-xl lg:max-w-4xl">
          <div className="animate-pulse flex space-x-2">
            <div className="rounded-full bg-gray-400 h-2 w-2"></div>
            <div className="rounded-full bg-gray-400 h-2 w-2"></div>
            <div className="rounded-full bg-gray-400 h-2 w-2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-4 p-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
          <BotIcon />
        </div>
      )}
      <div className={`px-4 py-3 rounded-2xl max-w-md md:max-w-xl lg:max-w-4xl ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

// Komponen untuk input API Key
const ApiKeyInput = ({ tempApiKey, setTempApiKey, handleApiKeySubmit }) => {
  return (
    <div className="font-sans h-screen w-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Masukkan Kunci API Gemini</h2>
          <p className="text-gray-500 mt-2">Anda memerlukan kunci API untuk memulai.</p>
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
              placeholder="Masukkan Kunci API Anda di sini"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 transition-all duration-200"
            disabled={!tempApiKey.trim()}
          >
            Simpan & Mulai Chat
          </button>
        </form>
      </div>
    </div>
  );
};


// Komponen utama aplikasi
export default function App() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'model',
      text: 'Halo! Saya adalah asisten AI Anda. Silakan ajukan pertanyaan apa pun.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsApiKeySet(true);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

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
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

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

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    if (tempApiKey.trim()) {
        localStorage.setItem('geminiApiKey', tempApiKey);
        setApiKey(tempApiKey);
        setIsApiKeySet(true);
        setTempApiKey('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newUserMessage = { role: 'user', text: input };
    const updatedHistory = [...chatHistory, newUserMessage];

    setChatHistory(updatedHistory);
    setInput('');

    callGeminiAPI(updatedHistory);
  };

  if (!isApiKeySet) {
    return (
      <ApiKeyInput 
        tempApiKey={tempApiKey}
        setTempApiKey={setTempApiKey}
        handleApiKeySubmit={handleApiKeySubmit}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="p-4 text-center border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">Asisten AI Cerdas</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto pb-32">
        {chatHistory.map((chat, index) => (
          <ChatBubble key={index} role={chat.role} text={chat.text} />
        ))}
        {isLoading && <ChatBubble role="model" isLoading={true} />}
        <div ref={chatEndRef} /> 
      </main>

      <div className="fixed bottom-0 left-0 right-0 w-full p-4 bg-white border-t border-gray-200 z-50">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan Anda..."
            className="flex-grow px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:bg-gray-100"
            disabled={isLoading}
            autoFocus
            style={{ WebkitUserSelect: 'text' }}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 transition-all duration-200"
            disabled={isLoading || !input.trim()}
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
}

