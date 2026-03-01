(() => {
  const params = new URLSearchParams(window.location.search);
  const roomCode = params.get("room");
  const username = params.get("name");

  if (!roomCode || !username) {
    window.location.href = "/";
    return;
  }

  const socket = io();
  const messagesEl = document.getElementById("messages");
  const messageForm = document.getElementById("message-form");
  const messageInput = document.getElementById("message-input");
  const memberList = document.getElementById("member-list");
  const memberCount = document.getElementById("member-count");
  const headerMemberCount = document.getElementById("header-member-count");
  const roomCodeEl = document.getElementById("room-code");
  const headerRoomCode = document.getElementById("header-room-code");
  const copyCodeBtn = document.getElementById("copy-code");
  const leaveBtn = document.getElementById("leave-btn");
  const typingIndicator = document.getElementById("typing-indicator");
  const typingNames = document.getElementById("typing-names");
  const sidebar = document.getElementById("sidebar");
  const toggleSidebar = document.getElementById("toggle-sidebar");

  roomCodeEl.textContent = roomCode;
  headerRoomCode.textContent = `ルーム: ${roomCode}`;

  // --- Join ---
  socket.emit("join-room", { inviteCode: roomCode, username }, (res) => {
    if (!res.ok) {
      alert(res.error);
      window.location.href = "/";
      return;
    }
    res.history.forEach((msg) => appendMessage(msg));
    scrollToBottom();
  });

  // --- Messages ---
  socket.on("chat-message", (msg) => {
    appendMessage(msg);
    scrollToBottom();
  });

  socket.on("system-message", (msg) => {
    appendSystemMessage(msg.text);
    scrollToBottom();
  });

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;
    socket.emit("chat-message", { text });
    messageInput.value = "";
    socket.emit("stop-typing");
  });

  // --- Typing indicator ---
  const typingUsers = new Set();
  let typingTimeout = null;

  messageInput.addEventListener("input", () => {
    socket.emit("typing");
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => socket.emit("stop-typing"), 2000);
  });

  socket.on("typing", ({ username: name }) => {
    typingUsers.add(name);
    updateTypingUI();
  });

  socket.on("stop-typing", ({ username: name }) => {
    typingUsers.delete(name);
    updateTypingUI();
  });

  function updateTypingUI() {
    if (typingUsers.size === 0) {
      typingIndicator.classList.add("hidden");
    } else {
      typingNames.textContent = [...typingUsers].join(", ");
      typingIndicator.classList.remove("hidden");
    }
  }

  // --- Members ---
  socket.on("members-updated", (members) => {
    memberList.innerHTML = "";
    members.forEach((name) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="member-dot"></span>${escapeHtml(name)}`;
      if (name === username) li.classList.add("me");
      memberList.appendChild(li);
    });
    memberCount.textContent = members.length;
    headerMemberCount.textContent = `${members.length}人`;
  });

  // --- UI helpers ---
  function appendMessage(msg) {
    const welcome = messagesEl.querySelector(".welcome-message");
    if (welcome) welcome.remove();

    const div = document.createElement("div");
    const isMe = msg.sender === username;
    div.className = `message ${isMe ? "me" : "other"}`;
    div.innerHTML = `
      <div class="message-sender">${escapeHtml(msg.sender)}</div>
      <div class="message-bubble">
        <span class="message-text">${escapeHtml(msg.text)}</span>
        <span class="message-time">${formatTime(msg.timestamp)}</span>
      </div>
    `;
    messagesEl.appendChild(div);
  }

  function appendSystemMessage(text) {
    const div = document.createElement("div");
    div.className = "system-message";
    div.textContent = text;
    messagesEl.appendChild(div);
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Copy invite code ---
  copyCodeBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      copyCodeBtn.textContent = "✅";
      setTimeout(() => (copyCodeBtn.textContent = "📋"), 1500);
    });
  });

  // --- Leave ---
  leaveBtn.addEventListener("click", () => {
    window.location.href = "/";
  });

  // --- Mobile sidebar toggle ---
  toggleSidebar.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
})();
