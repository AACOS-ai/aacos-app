import React, { useEffect, useState } from 'react';
import IntroFlowUI from './components/IntroFlowUI';
import ChatUI from './components/ChatUI';

function App() {
  const [userPrefs, setUserPrefs] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');

  useEffect(() => {
    window.electronAPI.onLoadUserPrefs(({ user, prefs, allUsers }) => {
      setCurrentUser(user);
      setUserPrefs(prefs);
      setAllUsers(allUsers);
    });
  }, []);

  const handleUserSelect = (e) => {
    const user = e.target.value;
    if (user) {
      window.electronAPI.switchUser(user);
    }
  };

  const handleAddUser = () => {
    if (!newUserName.trim()) return;
    window.electronAPI.switchUser(newUserName.trim());
    setNewUserName('');
  };

  if (!currentUser) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Select your profile</h2>
        <select onChange={handleUserSelect} defaultValue="">
          <option value="" disabled>
            -- Choose User --
          </option>
          {allUsers.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
        <div style={{ marginTop: '1rem' }}>
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="New user name"
          />
          <button onClick={handleAddUser} style={{ marginLeft: '0.5rem' }}>
            Add User
          </button>
        </div>
      </div>
    );
  }

  if (userPrefs?.firstTime) {
    return <IntroFlowUI user={currentUser} prefs={userPrefs} />;
  }

  return <ChatUI user={currentUser} prefs={userPrefs} />;
}

export default App;
