import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

function App() {
  // 1. Dile que aquí ponga TU IP y el puerto 4001
  const [serverUrl, setServerUrl] = useState("http://10.200.30.251:4001"); 
  const [username, setUsername] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Solo conectar cuando el login sea exitoso
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
        // CORREGIDO: Se agregaron las comillas invertidas `` para la URL
        await axios.post(`${serverUrl}/login`, 
            { username }, 
            { withCredentials: true }
        );
        
        // Conectar el socket después del login
        socketRef.current = io(serverUrl, { withCredentials: true });
        setIsLogged(true);
      } catch (err) {
        console.error(err);
        alert("Error en login. ¿Revisaste que la IP y el Puerto sean correctos?");
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
        <h1>Fase 2: Conectar al Servidor de mi Amigo</h1>
        <label>Dirección del Servidor:</label>
        <input 
          placeholder="Ejemplo: http://192.168.1.15:4001" 
          value={serverUrl} 
          onChange={(e) => setServerUrl(e.target.value)} 
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <br />
        <input 
            placeholder="Tu nombre de usuario..." 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={handleLogin} style={{ padding: '8px' }}>Entrar al Chat</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Sesión de: {username}</h2>
      <p style={{ fontSize: '0.8em', color: 'gray' }}>Conectado a: {serverUrl}</p>
      <div style={{ border: '2px solid green', height: '300px', overflowY: 'auto', padding: '10px', background: '#f0f0f0' }}>
        {chat.map((m) => (
          <p key={m.id}><b>{m.user}:</b> {m.text}</p>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: '10px' }}>
        <input 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            style={{ width: '80%', padding: '8px' }}
            placeholder="Escribe un mensaje..."
        />
        <button type="submit" style={{ padding: '8px' }}>Enviar</button>
      </form>
    </div>
  );
}
export default App;