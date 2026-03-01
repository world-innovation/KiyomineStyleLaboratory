(() => {
  const tabs = document.querySelectorAll(".tab");
  const joinForm = document.getElementById("join-form");
  const createForm = document.getElementById("create-form");
  const joinError = document.getElementById("join-error");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      if (tab.dataset.tab === "join") {
        joinForm.classList.add("active");
        createForm.classList.remove("active");
      } else {
        createForm.classList.add("active");
        joinForm.classList.remove("active");
      }
    });
  });

  joinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const code = document.getElementById("join-code").value.trim();
    const name = document.getElementById("join-name").value.trim();
    if (!code || !name) return;

    joinError.classList.add("hidden");

    const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/exists`);
    const data = await res.json();
    if (!data.exists) {
      joinError.textContent = "ルームが見つかりません。招待コードを確認してください。";
      joinError.classList.remove("hidden");
      return;
    }

    window.location.href = `/chat.html?room=${encodeURIComponent(code)}&name=${encodeURIComponent(name)}`;
  });

  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("create-name").value.trim();
    if (!name) return;

    const res = await fetch("/api/rooms", { method: "POST" });
    const data = await res.json();
    window.location.href = `/chat.html?room=${encodeURIComponent(data.inviteCode)}&name=${encodeURIComponent(name)}`;
  });
})();
