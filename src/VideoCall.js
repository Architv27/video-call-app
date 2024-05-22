// src/VideoCall.js

import React, { useRef, useEffect, useState } from 'react';
import SimplePeer from 'simple-peer';
import { database, ref, set, get, onValue, remove, update } from './firebase';
import './Videocall.css';

const VideoCall = ({ user }) => {
  const [myID, setMyID] = useState('');
  const [peerID, setPeerID] = useState('');
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [peer, setPeer] = useState(null);
  const [meetingID, setMeetingID] = useState('');
  const myVideo = useRef();
  const peerVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myVideo.current.srcObject = stream;

        const myPeer = new SimplePeer({
          initiator: window.location.hash === '#init',
          trickle: false,
          stream: stream,
        });

        myPeer.on('signal', (data) => {
          setMyID(JSON.stringify(data));
        });

        myPeer.on('stream', (stream) => {
          peerVideo.current.srcObject = stream;
        });

        setPeer(myPeer);
      })
      .catch((err) => {
        console.error('Error accessing media devices.', err);
      });
  }, []);

  const createMeeting = () => {
    const id = Math.random().toString(36).substring(2, 15);
    setMeetingID(id);
    const meetingRef = ref(database, 'meetings/' + id);
    set(meetingRef, {
      host: user.uid,
      hostSignal: myID,
      userCount: 1,
    });
  };

  const joinMeeting = () => {
    const meetingRef = ref(database, 'meetings/' + meetingID);
    get(meetingRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setPeerID(data.hostSignal);
        const peerData = JSON.parse(data.hostSignal);
        peer.signal(peerData);
        update(meetingRef, { userCount: data.userCount + 1 });
        setIsCallAccepted(true);

        // Listen for user count changes
        onValue(meetingRef, (snapshot) => {
          const data = snapshot.val();
          if (data.userCount === 0) {
            remove(meetingRef);
          }
        });
      } else {
        console.log('No such meeting!');
      }
    });
  };

  const handleCall = () => {
    try {
      const peerData = JSON.parse(peerID);
      peer.signal(peerData);
      setIsCallAccepted(true);
    } catch (error) {
      console.error('Invalid peer ID:', error);
    }
  };

  const handleAnswer = () => {
    try {
      const peerData = JSON.parse(peerID);
      peer.signal(peerData);
    } catch (error) {
      console.error('Invalid peer ID:', error);
    }
  };

  return (
    <div className="video-call-container">
      <div className="video-container">
        <video playsInline muted ref={myVideo} autoPlay className="video" />
        <video playsInline ref={peerVideo} autoPlay className="video" />
      </div>
      <div className="controls">
        {meetingID ? (
          <div>
            <p>Meeting ID: {meetingID}</p>
            <button onClick={joinMeeting}>Join Meeting</button>
          </div>
        ) : (
          <button onClick={createMeeting}>Create Meeting</button>
        )}
        {isCallAccepted ? (
          <button onClick={handleAnswer}>Answer</button>
        ) : (
          <div>
            <textarea
              value={peerID}
              onChange={(e) => setPeerID(e.target.value)}
              placeholder="Paste ID here"
            />
            <button onClick={handleCall}>Call</button>
          </div>
        )}
      </div>
      <div className="my-id">
        <textarea value={myID} readOnly />
      </div>
    </div>
  );
};

export default VideoCall;
