(function () {
  async function loadSiteData() {
    // Cache-bust so свежи промени да се гледаат веднаш после deploy
    const url = "/data/site.json?v=" + Date.now();
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Не можам да ја вчитам /data/site.json");
    return await res.json();
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderServices(data) {
    const list = document.getElementById("services-list");
    if (!list) return;

    const items = Array.isArray(data.services) ? data.services : [];
    list.innerHTML = items
      .map((s) => {
        const name = escapeHtml(s.name);
        const desc = escapeHtml(s.desc).replaceAll("\n", "<br>");
        const price = escapeHtml(s.price);
        return `
          <div class="card">
            <div class="service-name">${name}</div>
            <div class="service-desc">${desc}</div>
            ${price ? `<div class="service-price">${price}</div>` : ``}
          </div>
        `;
      })
      .join("");

    const note = document.getElementById("service-note");
    if (note) {
      const txt = (data.service_note || "").trim();
      note.textContent = txt;
      note.style.display = txt ? "" : "none";
    }
  }

  function renderGallery(data) {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;

    const items = Array.isArray(data.gallery) ? data.gallery : [];
    grid.innerHTML = items
      .map((g) => {
        const src = escapeHtml(g.image);
        const alt = escapeHtml(g.alt || "Nails by Hristina");
        return `
          <button class="gallery-item" type="button" data-src="${src}" aria-label="Отвори слика">
            <img class="gallery-photo" src="${src}" alt="${alt}" loading="lazy" />
          </button>
        `;
      })
      .join("");

    // јави дека галеријата е спремна (за lightbox скриптата)
    window.dispatchEvent(new Event("gallery:rendered"));
  }

  loadSiteData()
    .then((data) => {
      renderServices(data);
      renderGallery(data);
    })
    .catch((err) => {
      console.error(err);
      // Ако нешто затаи, само нека не падне цела страна
    });
})();