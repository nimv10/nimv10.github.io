// 1. Create a PeerJS peer (uses public PeerServer + Google STUN)
const peer = new Peer(undefined, {
  config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
});

let conn; // DataConnection

// 2. Show your own ID once ready
peer.on('open', id => {
  document.getElementById('my-id').textContent = id;
});

// 3. Handle incoming connections
peer.on('connection', connection => {
  setupConnection(connection);
});

// 4. Hook up “Connect” button
document.getElementById('connect-btn').onclick = () => {
  const peerId = document.getElementById('peer-id-input').value.trim();
  if (!peerId) return;
  conn = peer.connect(peerId);
  setupConnection(conn);
};

// 5. Shared setup for any DataConnection
function setupConnection(connection) {
  conn = connection;

  // Show chat UI
  document.querySelector('.setup').classList.add('hidden');
  document.querySelector('.chat').classList.remove('hidden');

  // When data arrives, render it
  conn.on('data', data => {
    renderMessage(data, 'peer');
  });
}

// 6. Sending messages
document.getElementById('msg-form').onsubmit = e => {
  e.preventDefault();
  const input = document.getElementById('msg-input');
  const text = input.value.trim();
  if (!text || !conn || conn.open === false) return;
  
  conn.send(text);                  // send to peer
  renderMessage(text, 'you');       // render locally
  input.value = '';
};

// Utility: add message bubble
function renderMessage(text, who) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${who}`;
  msgDiv.textContent = text;
  document.getElementById('messages').appendChild(msgDiv);
  msgDiv.scrollIntoView();
}
