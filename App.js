import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import DocumentList from './components/DocumentList';
import TextEditor from './components/TextEditor';
import UserList from './components/UserList';
import LoginModal from './components/LoginModal';

const SOCKET_SERVER_URL = 'http://localhost:5000';

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [currentDocument, setCurrentDocument] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);
  const [showLogin, setShowLogin] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
      setShowLogin(false);
    }
  }, []);

  useEffect(() => {
    if (!showLogin) {
      const newSocket = io(SOCKET_SERVER_URL);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
        newSocket.emit('get-documents');
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('document-list', (documentList) => {
        setDocuments(documentList);
      });

      newSocket.on('document-added', (newDoc) => {
        setDocuments(prev => [...prev, newDoc]);
      });

      return () => {
        newSocket.close();
      };
    }
  }, [showLogin]);

  const handleLogin = (user) => {
    setUsername(user);
    localStorage.setItem('username', user);
    setShowLogin(false);
  };

  const handleJoinDocument = (documentId) => {
    if (socket) {
      socket.emit('join-document', { documentId, username });
      setCurrentDocument(documentId);
    }
  };

  const handleCreateDocument = (documentId) => {
    if (socket) {
      socket.emit('create-document', { documentId, username });
      handleJoinDocument(documentId);
    }
  };

  const handleLeaveDocument = () => {
    setCurrentDocument(null);
    setUsers([]);
  };

  return (
    <div className="App">
      {showLogin ? (
        <LoginModal onLogin={handleLogin} />
      ) : (
        <div className="editor-container">
          <header className="app-header">
            <h1>Collaborative Text Editor</h1>
            <div className="user-info">
              <span className="username">Welcome, {username}!</span>
              <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </span>
            </div>
          </header>

          <div className="main-content">
            {!currentDocument ? (
              <DocumentList 
                documents={documents}
                onJoinDocument={handleJoinDocument}
                onCreateDocument={handleCreateDocument}
              />
            ) : (
              <div className="editor-section">
                <div className="editor-header">
                  <button className="back-btn" onClick={handleLeaveDocument}>
                    ← Back to Documents
                  </button>
                  <h2>Document: {currentDocument}</h2>
                </div>
                <div className="editor-layout">
                  <TextEditor 
                    socket={socket}
                    documentId={currentDocument}
                    username={username}
                    onUsersUpdate={setUsers}
                  />
                  <UserList users={users} currentUser={username} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
