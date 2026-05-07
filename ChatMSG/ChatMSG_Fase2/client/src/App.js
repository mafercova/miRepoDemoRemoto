import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4002';

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn && !socketRef.current) {
      socketRef.current = io(API_URL, {
        withCredentials: true
      });

      socketRef.current.on('server_history', (history) => {
        setMessages(history);
      });

      socketRef.current.on('server_message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      socketRef.current.on('auth_error', (error) => {
        alert(error);
        setIsLoggedIn(false);
        setUsername('');
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isLoggedIn, API_URL]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      await axios.post(`${API_URL}/login`, { username }, { withCredentials: true });
      setIsLoggedIn(true);
    } catch (err) {
      alert('Error al iniciar sesión');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit('client_message', { text: newMessage });
    setNewMessage('');
  };

  if (!isLoggedIn) {
    return (
      <div className="App">
        <div className="join-container">
          <form onSubmit={handleLogin}>
            <h1>Chat MSG</h1>
            <input
              type="text"
              placeholder="Ingresa tu nombre"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-main">
          <div className="messages">
            {messages.map((msg) => (
              <div
                key={msg.id ?? `${msg.user}-${msg.time}-${msg.text}`}
                className={`message ${msg.user === username ? 'own' : ''}`}
              >
                <span className="message-user">{msg.user}</span>
                <span className="message-text">{msg.text}</span>
                <span className="message-time">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;