// src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import VideoCall from './VideoCall';
import { auth, signInWithGoogle, signOut } from './firebase';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {user ? (
        <>
          <button onClick={signOut}>Sign Out</button>
          <VideoCall user={user} />
        </>
      ) : (
        <button onClick={signInWithGoogle}>Sign In with Google</button>
      )}
    </div>
  );
}

export default App;
