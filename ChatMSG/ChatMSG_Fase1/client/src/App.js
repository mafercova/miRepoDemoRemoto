import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3001');

function App() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [users, setUsers] = useState([]);
  const messagesEnd = useRef(null);

  useEffect(() => {
    socket.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('messageHistory', (history) => {
      setMessages(history);
    });

    socket.on('systemMessage', (msg) => {
      setMessages((prev) => [...prev, { id: Date.now(), text: msg, system: true }]);
    });

    socket.on('userList', (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off('chatMessage');
      socket.off('messageHistory');
      socket.off('systemMessage');
      socket.off('userList');
    };
  }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('join', username);
      setJoined(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMsg.trim()) {
      socket.emit('chatMessage', inputMsg);
      setInputMsg('');
    }
  };

  if (!joined) {
    return (
      <div className="App">
        <div className="join-container">
          <h1>Chat en Vivo - Fase 1</h1>
          <form onSubmit={handleJoin}>
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
        <div className="sidebar">
          <h3>Usuarios ({users.length})</h3>
          <ul>
            {users.map((user, idx) => (
              <li key={idx}>{user}</li>
            ))}
          </ul>
        </div>
        <div className="chat-main">
          <div className="messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.system ? 'system' : msg.user === username ? 'own' : ''}`}
              >
                {!msg.system && <span className="message-user">{msg.user}: </span>}
                {msg.text}
              </div>
            ))}
            <div ref={messagesEnd} />
          </div>
          <form className="message-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Escribe un mensaje"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;