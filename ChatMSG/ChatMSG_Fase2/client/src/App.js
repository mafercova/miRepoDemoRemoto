import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

function App() {
  const [serverUrl, setServerUrl] = useState("http://192.168.8.47:4003");
  const [username, setUsername] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (isLogged && socketRef.current) {
      socketRef.current.on('server_history', (h) => setChat(h));
      socketRef.current.on('server_message', (m) => setChat(prev => [...prev, m]));
      return () => {
        socketRef.current.off('server_history');
        socketRef.current.off('server_message');
      };
    }
  }, [isLogged]);

  const handleLogin = async () => {
    if (username && serverUrl) {
      try {
        await axios.post(`${serverUrl}/login`, 
            { username }, 
            { withCredentials: true }
        );
        socketRef.current = io(serverUrl, { withCredentials: true });
        setIsLogged(true);
      } catch (err) {
        alert("Error en login");
      }
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socketRef.current) {
      socketRef.current.emit('client_message', { user: username, text: message });
      setMessage("");
    }
  };

  if (!isLogged) {
    return (
      <div style={{ padding: '50px' }}>
        <h1>Fase 2: Redis + Cookies Seguro</h1>
        <input 
          placeholder="URL del servidor..." 
          value={serverUrl} 
          onChange={(e) => setServerUrl(e.target.value)} 
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <br />
        <input placeholder="Usuario..." onChange={(e) => setUsername(e.target.value)} />
        <button onClick={handleLogin}>Login Seguro</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Bienvenido {username}</h2>
      <div style={{ border: '2px solid green', height: '300px', overflowY: 'auto', padding: '10px' }}>
        {chat.map((m) => (
          <p key={m.id}><b>{m.user}:</b> {m.text}</p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
export default App;