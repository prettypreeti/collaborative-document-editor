import React from 'react';
import './UserList.css';

const UserList = ({ users, currentUser }) => {
  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3>👥 Online Users ({users.length})</h3>
      </div>
      
      <div className="users-container">
        {users.length === 0 ? (
          <div className="no-users">
            <p>No other users online</p>
          </div>
        ) : (
          users.map((user, index) => (
            <div 
              key={index} 
              className={`user-item ${user === currentUser ? 'current-user' : ''}`}
            >
              <div className="user-avatar">
                {user === currentUser ? '👤' : '👥'}
              </div>
              <div className="user-info">
                <span className="username">
                  {user}
                  {user === currentUser && <span className="you-badge"> (You)</span>}
                </span>
                <span className="user-status">
                  {user === currentUser ? 'Active' : 'Online'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="user-list-footer">
        <div className="collaboration-tips">
          <h4>💡 Collaboration Tips:</h4>
          <ul>
            <li>See who's currently editing</li>
            <li>Changes sync in real-time</li>
            <li>Share the document name with others</li>
            <li>All users can edit simultaneously</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserList; 