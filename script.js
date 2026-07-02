(() => {
  const PRODUCTS = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  const WHATSAPP_PHONE = "5514981105058";
  const PLACEHOLDER = "assets/produto-placeholder.svg";

  const state = {
    query: "",
    category: "todos",
    sort: "original",
    activeProduct: null
  };

  const grid = document.getElementById("productGrid");
  const countEl = document.getElementById("productCount");
  const categoryFilter = document.getElementById("categoryFilter");
  const categoryPills = document.getElementById("categoryPills");
  const searchInput = document.getElementById("productSearch");
  const sortFilter = document.getElementById("sortFilter");
  const clearFilters = document.getElementById("clearFilters");
  const template = document.getElementById("productCardTemplate");

  const modal = document.getElementById("productModal");
  const modalClose = document.getElementById("modalClose");
  const modalImage = document.getElementById("modalImage");
  const modalThumbs = document.getElementById("modalThumbs");
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");
  const modalCategory = document.getElementById("modalCategory");
  const modalDescription = document.getElementById("modalDescription");
  const modalWhatsapp = document.getElementById("modalWhatsapp");
  const copyProduct = document.getElementById("copyProduct");

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function productWhatsApp(product) {
    const message = `Olá! Tenho interesse no produto: ${product.title}. Pode me passar preço e disponibilidade?`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  }

  function descriptionPreview(product) {
    const text = (product.description || []).slice(0, 2).join(" ");
    return text.length > 135 ? text.slice(0, 132).trim() + "..." : text;
  }

  function setImage(img, src, alt = "") {
    img.src = src || PLACEHOLDER;
    img.alt = alt;
    img.onerror = () => {
      img.onerror = null;
      img.src = PLACEHOLDER;
    };
  }

  function categories() {
    return [...new Set(PRODUCTS.map(p => p.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }

  function setupCategories() {
    const cats = categories();

    cats.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });

    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.textContent = `Todas (${PRODUCTS.length})`;
    allBtn.dataset.category = "todos";
    allBtn.className = "active";
    categoryPills.appendChild(allBtn);

    cats.forEach(category => {
      const amount = PRODUCTS.filter(p => p.category === category).length;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = `${category} (${amount})`;
      btn.dataset.category = category;
      categoryPills.appendChild(btn);
    });

    categoryPills.addEventListener("click", event => {
      const btn = event.target.closest("button[data-category]");
      if (!btn) return;
      state.category = btn.dataset.category;
      categoryFilter.value = state.category;
      render();
    });
  }

  function filteredProducts() {
    const q = normalize(state.query);
    let list = PRODUCTS.filter(product => {
      const haystack = normalize([
        product.title,
        product.subtitle,
        product.category,
        product.brand,
        ...(product.description || [])
      ].join(" "));
      const matchesQuery = !q || haystack.includes(q);
      const matchesCategory = state.category === "todos" || product.category === state.category;
      return matchesQuery && matchesCategory;
    });

    if (state.sort === "az") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    }

    if (state.sort === "za") {
      list = [...list].sort((a, b) => b.title.localeCompare(a.title, "pt-BR"));
    }

    return list;
  }

  function renderPills() {
    [...categoryPills.querySelectorAll("button")].forEach(btn => {
      btn.classList.toggle("active", btn.dataset.category === state.category);
    });
  }

  function render() {
    const list = filteredProducts();
    grid.innerHTML = "";
    countEl.textContent = String(list.length);
    renderPills();

    if (!list.length) {
      const empty = document.createElement("div");
      empty.className = "no-results";
      empty.innerHTML = "<h3>Nenhum produto encontrado</h3><p>Tente remover filtros ou buscar por outro termo.</p>";
      grid.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();

    list.forEach(product => {
      const node = template.content.cloneNode(true);
      const card = node.querySelector(".product-card");
      const img = node.querySelector(".product-image");
      const title = node.querySelector("h3");
      const subtitle = node.querySelector(".product-subtitle");
      const category = node.querySelector(".product-category");
      const preview = node.querySelector(".product-description-preview");
      const details = node.querySelector(".details-button");
      const imageButton = node.querySelector(".product-image-button");
      const whats = node.querySelector(".whatsapp-button");

      card.dataset.slug = product.slug;
      setImage(img, product.thumbnail || product.images?.[0], product.title);
      title.textContent = product.title;
      subtitle.textContent = product.subtitle || "Consulte detalhes pelo WhatsApp";
      category.textContent = product.category || "Produto";
      preview.textContent = descriptionPreview(product) || "Produto disponível para consulta.";
      whats.href = productWhatsApp(product);

      details.addEventListener("click", () => openProduct(product));
      imageButton.addEventListener("click", () => openProduct(product));

      fragment.appendChild(node);
    });

    grid.appendChild(fragment);
  }

  function openProduct(product) {
    state.activeProduct = product;

    modalTitle.textContent = product.title;
    modalSubtitle.textContent = product.subtitle || "Produto disponível para consulta";
    modalCategory.textContent = product.category || "Produto";
    modalWhatsapp.href = productWhatsApp(product);

    const items = product.description || [];
    modalDescription.innerHTML = items.length
      ? `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      : "<p>Consulte a Musical Pirambóia para obter mais detalhes sobre este produto.</p>";

    const images = product.images?.length ? product.images : [product.thumbnail || PLACEHOLDER];
    setImage(modalImage, images[0], product.title);
    modalThumbs.innerHTML = "";

    images.forEach((src, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = index === 0 ? "active" : "";
      const thumb = document.createElement("img");
      setImage(thumb, src, `${product.title} - imagem ${index + 1}`);
      btn.appendChild(thumb);
      btn.addEventListener("click", () => {
        setImage(modalImage, src, product.title);
        [...modalThumbs.querySelectorAll("button")].forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
      modalThumbs.appendChild(btn);
    });

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }

  function closeProduct() {
    modal.hidden = true;
    document.body.style.overflow = "";
    state.activeProduct = null;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setupEvents() {
    searchInput.addEventListener("input", event => {
      state.query = event.target.value;
      render();
    });

    categoryFilter.addEventListener("change", event => {
      state.category = event.target.value;
      render();
    });

    sortFilter.addEventListener("change", event => {
      state.sort = event.target.value;
      render();
    });

    clearFilters.addEventListener("click", () => {
      state.query = "";
      state.category = "todos";
      state.sort = "original";
      searchInput.value = "";
      categoryFilter.value = "todos";
      sortFilter.value = "original";
      render();
    });

    modalClose.addEventListener("click", closeProduct);
    modal.addEventListener("click", event => {
      if (event.target === modal) closeProduct();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !modal.hidden) closeProduct();
    });

    copyProduct.addEventListener("click", async () => {
      if (!state.activeProduct) return;
      try {
        await navigator.clipboard.writeText(state.activeProduct.title);
        copyProduct.textContent = "Copiado";
        setTimeout(() => (copyProduct.textContent = "Copiar nome"), 1200);
      } catch {
        copyProduct.textContent = "Copie manualmente";
      }
    });

    document.getElementById("floatingWhatsapp").addEventListener("click", () => {
      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Olá! Vim pelo site da Musical Pirambóia.")}`, "_blank", "noopener");
    });

    const menuButton = document.querySelector(".menu-button");
    const navMenu = document.querySelector(".nav-menu");
    menuButton.addEventListener("click", () => {
      const open = navMenu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });

    navMenu.addEventListener("click", event => {
      if (event.target.closest("a")) {
        navMenu.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  setupCategories();
  setupEvents();
  render();
})();
