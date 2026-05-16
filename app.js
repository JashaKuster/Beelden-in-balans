(() => {
  const gallery = document.getElementById("gallery");
  const status = document.getElementById("status");
  const modal = document.getElementById("modal");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalImage = document.getElementById("modal-image");
  const photoCounter = document.getElementById("photo-counter");
  const closeModalButton = document.getElementById("close-modal");
  const prevPhotoButton = document.getElementById("prev-photo");
  const nextPhotoButton = document.getElementById("next-photo");

  let sculptures = [];
  let activeSculpture = null;
  let activePhotoIndex = 0;

  const setStatus = (message) => {
    status.textContent = message;
  };

  const prettifyName = (value) =>
    value
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const renderGallery = () => {
    gallery.textContent = "";

    if (!sculptures.length) {
      setStatus(
        "Nog geen beelden gevonden. Voeg een map toe in /beelden met minimaal één foto.",
      );
      return;
    }

    setStatus("");

    for (const sculpture of sculptures) {
      const card = document.createElement("article");
      card.className = "card";

      const button = document.createElement("button");
      button.type = "button";
      button.dataset.id = sculpture.id;
      button.setAttribute("aria-label", `${sculpture.title} openen`);

      const preview = document.createElement("img");
      preview.src = sculpture.images[0];
      preview.alt = `Voorbeeld van ${sculpture.title}`;
      preview.loading = "lazy";

      const body = document.createElement("div");
      body.className = "card-body";

      const title = document.createElement("h2");
      title.className = "card-title";
      title.textContent = sculpture.title || prettifyName(sculpture.id);

      const meta = document.createElement("p");
      meta.className = "card-meta";
      meta.textContent = `${sculpture.images.length} foto${sculpture.images.length > 1 ? "'s" : ""}`;

      body.append(title, meta);
      button.append(preview, body);
      card.append(button);
      gallery.append(card);

      button.addEventListener("click", () => openModal(sculpture.id));
    }
  };

  const updateModalImage = () => {
    if (!activeSculpture) {
      return;
    }

    const maxIndex = activeSculpture.images.length - 1;
    if (activePhotoIndex < 0) {
      activePhotoIndex = maxIndex;
    }
    if (activePhotoIndex > maxIndex) {
      activePhotoIndex = 0;
    }

    modalTitle.textContent = activeSculpture.title;
    modalImage.src = activeSculpture.images[activePhotoIndex];
    modalImage.alt = `${activeSculpture.title} foto ${activePhotoIndex + 1}`;
    photoCounter.textContent = `${activePhotoIndex + 1} / ${activeSculpture.images.length}`;
  };

  const openModal = (sculptureId) => {
    const found = sculptures.find((item) => item.id === sculptureId);
    if (!found || !found.images.length) {
      return;
    }

    activeSculpture = found;
    activePhotoIndex = 0;
    updateModalImage();

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    closeModalButton.focus();
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    activeSculpture = null;
    activePhotoIndex = 0;
    modalImage.src = "";
    photoCounter.textContent = "";
  };

  const goToPrevious = () => {
    if (!activeSculpture) {
      return;
    }
    activePhotoIndex -= 1;
    updateModalImage();
  };

  const goToNext = () => {
    if (!activeSculpture) {
      return;
    }
    activePhotoIndex += 1;
    updateModalImage();
  };

  closeModalButton.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);
  prevPhotoButton.addEventListener("click", goToPrevious);
  nextPhotoButton.addEventListener("click", goToNext);

  document.addEventListener("keydown", (event) => {
    const modalOpen = !modal.classList.contains("hidden");
    if (!modalOpen) {
      return;
    }

    if (event.key === "Escape") {
      closeModal();
    } else if (event.key === "ArrowLeft") {
      goToPrevious();
    } else if (event.key === "ArrowRight") {
      goToNext();
    }
  });

  const loadSculptures = async () => {
    setStatus("Beelden laden...");
    try {
      const response = await fetch("/api/sculptures", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      sculptures = Array.isArray(data.sculptures) ? data.sculptures : [];
      renderGallery();
    } catch (_error) {
      setStatus(
        "Er ging iets mis bij het laden van de beelden. Controleer of de server draait via node server.js.",
      );
    }
  };

  loadSculptures();
})();
