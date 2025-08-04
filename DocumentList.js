import React, { useState } from 'react';
import './DocumentList.css';

const DocumentList = ({ documents, onJoinDocument, onCreateDocument }) => {
  const [newDocumentId, setNewDocumentId] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateDocument = (e) => {
    e.preventDefault();
    if (newDocumentId.trim()) {
      onCreateDocument(newDocumentId.trim());
      setNewDocumentId('');
      setShowCreateForm(false);
    }
  };

  return (
    <div className="document-list">
      <div className="document-list-header">
        <h2>Available Documents</h2>
        <button 
          className="create-doc-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Create New Document'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateDocument} className="create-document-form">
          <div className="input-group">
            <label htmlFor="documentId">Document Name:</label>
            <input
              type="text"
              id="documentId"
              value={newDocumentId}
              onChange={(e) => setNewDocumentId(e.target.value)}
              placeholder="Enter document name"
              required
            />
          </div>
          <button type="submit" className="create-btn" disabled={!newDocumentId.trim()}>
            Create Document
          </button>
        </form>
      )}

      <div className="documents-grid">
        {documents.length === 0 ? (
          <div className="no-documents">
            <p>No documents available. Create your first document!</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="document-card">
              <div className="document-info">
                <h3>{doc.id}</h3>
                <p className="user-count">
                  {doc.userCount} {doc.userCount === 1 ? 'user' : 'users'} online
                </p>
              </div>
              <button 
                className="join-btn"
                onClick={() => onJoinDocument(doc.id)}
              >
                Join Document
              </button>
            </div>
          ))
        )}
      </div>

      <div className="document-tips">
        <h3>💡 Tips:</h3>
        <ul>
          <li>Click on any document to join and start collaborating</li>
          <li>Create a new document with a unique name</li>
          <li>Share the document name with others to collaborate</li>
          <li>All changes are saved automatically</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentList; 