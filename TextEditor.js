import React, { useState, useEffect, useRef } from 'react';
import './TextEditor.css';

const TextEditor = ({ socket, documentId, username, onUsersUpdate }) => {
  const [content, setContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Listen for document content updates
    socket.on('document-content', ({ content: docContent, users }) => {
      setContent(docContent);
      onUsersUpdate(users);
    });

    // Listen for text updates from other users
    socket.on('text-updated', ({ content: newContent, userId }) => {
      if (userId !== socket.id) {
        setContent(newContent);
      }
    });

    // Listen for user join/leave events
    socket.on('user-joined', ({ username: newUser, users }) => {
      onUsersUpdate(users);
      console.log(`${newUser} joined the document`);
    });

    socket.on('user-left', ({ username: leftUser, users }) => {
      onUsersUpdate(users);
      console.log(`${leftUser} left the document`);
    });

    return () => {
      socket.off('document-content');
      socket.off('text-updated');
      socket.off('user-joined');
      socket.off('user-left');
    };
  }, [socket, onUsersUpdate]);

  const handleTextChange = (e) => {
    const newContent = e.target.value;
    const newCursorPosition = e.target.selectionStart;
    
    setContent(newContent);
    setCursorPosition(newCursorPosition);
    setIsTyping(true);

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout for debouncing
    const timeout = setTimeout(() => {
      setIsTyping(false);
      if (socket) {
        socket.emit('text-change', {
          documentId,
          content: newContent,
          cursorPosition: newCursorPosition
        });
      }
    }, 300);

    setTypingTimeout(timeout);
  };

  const handleCursorMove = (e) => {
    const newPosition = e.target.selectionStart;
    setCursorPosition(newPosition);
    
    if (socket) {
      socket.emit('cursor-move', {
        documentId,
        cursorPosition: newPosition,
        username
      });
    }
  };

  const handleKeyDown = (e) => {
    // Handle special key combinations
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          // Auto-save is handled by the server
          console.log('Document saved automatically');
          break;
        case 'z':
          // Let the browser handle undo
          break;
        case 'y':
          // Let the browser handle redo
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="text-editor">
      <div className="editor-header">
        <div className="editor-info">
          <span className="document-name">{documentId}</span>
          {isTyping && <span className="typing-indicator">Typing...</span>}
        </div>
        <div className="editor-actions">
          <button 
            className="save-btn"
            onClick={() => console.log('Document saved automatically')}
            title="Document is saved automatically"
          >
            💾 Auto-saved
          </button>
        </div>
      </div>

      <div className="editor-container">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleTextChange}
          onSelect={handleCursorMove}
          onKeyDown={handleKeyDown}
          placeholder="Start typing to collaborate with others..."
          className="editor-textarea"
          autoFocus
        />
      </div>

      <div className="editor-footer">
        <div className="editor-stats">
          <span className="char-count">{content.length} characters</span>
          <span className="word-count">
            {content.trim() ? content.trim().split(/\s+/).length : 0} words
          </span>
        </div>
        <div className="editor-help">
          <span>💡 Tip: All changes are synchronized in real-time</span>
        </div>
      </div>
    </div>
  );
};

export default TextEditor; 