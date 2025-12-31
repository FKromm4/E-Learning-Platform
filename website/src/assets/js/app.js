// ============================================
// APP.JS - Main Application Logic
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  // Initialize page-specific functionality
  const currentPage = document.body.dataset.page;

  switch (currentPage) {
    case 'home':
      initHomePage();
      break;
    case 'courses':
      initCoursesPage();
      break;
    case 'books':
      initBooksPage();
      break;
    case 'course-details':
      initDetailsPage();
      break;
    case 'favourites':
      initFavouritesPage();
      break;
  }
});

// ============================================
// HOME PAGE
// ============================================
function initHomePage() {
  // Load featured courses
  const featuredCoursesContainer = document.getElementById('featured-courses');
  if (featuredCoursesContainer) {
    const featuredCourses = getFeaturedCourses(3);
    renderCourses(featuredCourses, featuredCoursesContainer);
  }

  // Load featured books
  const featuredBooksContainer = document.getElementById('featured-books');
  if (featuredBooksContainer) {
    const featuredBooks = getFeaturedBooks(3);
    renderBooks(featuredBooks, featuredBooksContainer);
  }
}

// ============================================
// COURSES PAGE
// ============================================
function initCoursesPage() {
  const coursesContainer = document.getElementById('courses-list');
  const categoryFilter = document.getElementById('category-filter');
  const searchInput = document.getElementById('search-input');

  if (!coursesContainer) return;

  let currentCourses = getAllCourses();

  // Initial render
  renderCourses(currentCourses, coursesContainer);

  // Category filter
  if (categoryFilter) {
    // Populate category options
    const categories = getCategories();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category === 'all' ? 'Όλες οι κατηγορίες' : category;
      categoryFilter.appendChild(option);
    });

    categoryFilter.addEventListener('change', function () {
      const selectedCategory = this.value;
      currentCourses = getCoursesByCategory(selectedCategory);

      // Apply search if active
      if (searchInput && searchInput.value.trim()) {
        currentCourses = filterBySearch(currentCourses, searchInput.value);
      }

      renderCourses(currentCourses, coursesContainer);
    });
  }

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const query = this.value.trim();

      if (query) {
        currentCourses = searchCourses(query);
      } else {
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        currentCourses = getCoursesByCategory(selectedCategory);
      }

      renderCourses(currentCourses, coursesContainer);
    });
  }
}

// ============================================
// BOOKS PAGE
// ============================================
function initBooksPage() {
  const booksContainer = document.getElementById('books-list');
  const categoryFilter = document.getElementById('category-filter');
  const typeFilter = document.getElementById('type-filter');
  const searchInput = document.getElementById('search-input');

  if (!booksContainer) return;

  let currentBooks = getAllBooks();

  // Initial render
  renderBooks(currentBooks, booksContainer);

  // Category filter
  if (categoryFilter) {
    const categories = getBookCategories();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category === 'all' ? 'Όλες οι κατηγορίες' : category;
      categoryFilter.appendChild(option);
    });

    categoryFilter.addEventListener('change', filterBooks);
  }

  // Type filter
  if (typeFilter) {
    typeFilter.addEventListener('change', filterBooks);
  }

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', filterBooks);
  }

  function filterBooks() {
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const selectedType = typeFilter ? typeFilter.value : 'all';
    const query = searchInput ? searchInput.value.trim() : '';

    currentBooks = getAllBooks();

    // Apply category filter
    if (selectedCategory !== 'all') {
      currentBooks = currentBooks.filter(book => book.category === selectedCategory);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      currentBooks = currentBooks.filter(book => book.type === selectedType);
    }

    // Apply search
    if (query) {
      currentBooks = filterBySearch(currentBooks, query);
    }

    renderBooks(currentBooks, booksContainer);
  }
}

// ============================================
// FAVOURITES PAGE
// ============================================
function initFavouritesPage() {
  const favouritesContainer = document.getElementById('favourites-list');
  const filterTabs = document.querySelectorAll('.filter-tab');

  if (!favouritesContainer) return;

  // Initial load
  loadAndRenderFavourites('all');

  // Filter tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter content
      const filter = tab.dataset.filter;
      loadAndRenderFavourites(filter);
    });
  });

  function loadAndRenderFavourites(filter) {
    // Check authentication
    if (!authService.isAuthenticated()) {
      window.location.href = 'login.html?redirect=favourites.html';
      return;
    }

    const allFavourites = favouritesService.getAllFavouriteItems();
    let itemsToShow = [];

    // Update counts
    document.getElementById('count-all').textContent = allFavourites.courses.length + allFavourites.books.length;
    document.getElementById('count-courses').textContent = allFavourites.courses.length;
    document.getElementById('count-books').textContent = allFavourites.books.length;

    // Filter items
    if (filter === 'all') {
      itemsToShow = [...allFavourites.courses, ...allFavourites.books];
    } else if (filter === 'courses') {
      itemsToShow = allFavourites.courses;
    } else if (filter === 'books') {
      itemsToShow = allFavourites.books;
    }

    // Render
    if (itemsToShow.length === 0) {
      favouritesContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: var(--space-8);">
          <div style="font-size: 4rem; margin-bottom: var(--space-4);">❤️</div>
          <h3>Δεν έχετε προσθέσει αγαπημένα ακόμα</h3>
          <p>Περιηγηθείτε στα μαθήματα και τα βιβλία και πατήστε το κουμπί "Προσθήκη στα αγαπημένα" για να τα δείτε εδώ.</p>
          <div style="margin-top: var(--space-4); display: flex; gap: var(--space-4); justify-content: center;">
            <a href="courses.html" class="btn btn-primary">Μαθήματα</a>
            <a href="books.html" class="btn btn-secondary">Βιβλία</a>
          </div>
        </div>
      `;
      return;
    }

    favouritesContainer.innerHTML = itemsToShow.map(item => {
      const isCourse = item.instructor !== undefined;
      const type = isCourse ? 'course' : 'book';
      const typeLabel = isCourse ? 'Μάθημα' : (item.type === 'book' ? 'Βιβλίο' : 'Βίντεο');
      const url = `course-details.html?id=${item.id}&type=${type}`;

      return `
        <article class="course-card">
          <img src="${item.image}" alt="${item.title}" class="course-card-image">
          <div class="course-card-content">
            <h3 class="course-card-title">${item.title}</h3>
            <div class="course-card-meta">
              <span class="meta-item">${isCourse ? '👤 ' + item.instructor : '✍️ ' + item.author}</span>
              <span class="meta-item">⭐ ${item.rating}</span>
            </div>
            <div class="tags" style="margin: var(--space-2) 0;">
              <span class="tag">${item.category}</span>
              <span class="tag">${typeLabel}</span>
            </div>
            <div style="display: flex; gap: var(--space-2); margin-top: auto;">
              <a href="${url}" class="btn btn-primary" style="flex: 1;">Προβολή</a>
              <button class="btn btn-icon btn-danger remove-fav-btn" data-id="${item.id}" data-type="${type}" title="Αφαίρεση από τα αγαπημένα">
                🗑️
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Add event listeners to remove buttons
    favouritesContainer.querySelectorAll('.remove-fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.dataset.id;
        const type = btn.dataset.type;

        if (favouritesService.removeFavourite(id, type)) {
          showNotification('Αφαιρέθηκε από τα αγαπημένα', 'success');
          // Re-render
          loadAndRenderFavourites(document.querySelector('.filter-tab.active').dataset.filter);
        }
      });
    });
  }
}

// ============================================
// DETAILS PAGE
// ============================================
function initDetailsPage() {
  // Get item ID and type from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('id');
  const itemType = urlParams.get('type') || 'course';

  if (!itemId) {
    window.location.href = 'index.html';
    return;
  }

  let item;
  if (itemType === 'course') {
    item = getCourseById(itemId);
  } else {
    item = getBookById(itemId);
  }

  if (!item) {
    window.location.href = 'index.html';
    return;
  }

  renderDetailsPage(item, itemType);
}

// ============================================
// RENDER FUNCTIONS
// ============================================
function renderCourses(courses, container) {
  if (courses.length === 0) {
    container.innerHTML = '<div class="empty-state"><h3>Δεν βρέθηκαν μαθήματα</h3><p>Δοκιμάστε διαφορετικά φίλτρα αναζήτησης.</p></div>';
    return;
  }

  container.innerHTML = courses.map(course => `
    <article class="course-card">
      <img src="${course.image}" alt="${course.title}" class="course-card-image">
      <div class="course-card-content">
        <h3 class="course-card-title">${course.title}</h3>
        <p class="course-card-description">${course.description}</p>
        <div class="course-card-meta">
          <span class="meta-item">👤 ${course.instructor}</span>
          <span class="meta-item">⏱️ ${course.duration}</span>
          <span class="meta-item">⭐ ${course.rating}</span>
        </div>
        <div class="tags">
          <span class="tag">${course.category}</span>
          <span class="tag">${course.level}</span>
        </div>
        <a href="course-details.html?id=${course.id}&type=course" class="btn btn-primary">Δες περισσότερα</a>
      </div>
    </article>
  `).join('');
}

function renderBooks(books, container, showBuyButton = false) {
  if (books.length === 0) {
    container.innerHTML = '<div class="empty-state"><h3>Δεν βρέθηκαν βιβλία/βίντεο</h3><p>Δοκιμάστε διαφορετικά φίλτρα αναζήτησης.</p></div>';
    return;
  }

  container.innerHTML = books.map(book => {
    const purchased = typeof isPurchased === 'function' && isPurchased(book.id);
    const inCart = typeof isInCart === 'function' && isInCart(book.id);

    return `
    <article class="book-card">
      <img src="${book.image}" alt="${book.title}" class="book-card-image">
      <div class="book-card-content">
        <h3 class="book-card-title">${book.title}</h3>
        <p class="course-card-description">${book.author}</p>
        <p class="book-card-description">${book.description}</p>
        <div class="book-card-meta">
          <span class="meta-item">${book.type === 'book' ? '📖' : '🎥'} ${book.type === 'book' ? book.pages + ' σελ.' : book.duration}</span>
          <span class="meta-item">⭐ ${book.rating}</span>
          <span class="meta-item">💰 ${book.price}</span>
        </div>
        <div class="tags">
          <span class="tag">${book.category}</span>
          <span class="tag">${book.type === 'book' ? 'Βιβλίο' : 'Βίντεο'}</span>
        </div>
        ${purchased && showBuyButton ? '<div class="already-bought-badge">✓ Έχει αγοραστεί</div>' : ''}
        <div style="display: flex; gap: var(--space-2); margin-top: var(--space-3);">
          <a href="course-details.html?id=${book.id}&type=book" class="btn ${showBuyButton ? 'btn-secondary' : 'btn-primary'}" style="flex: 1;">Δες περισσότερα</a>
          ${showBuyButton && !purchased ? `
            <button 
              class="btn btn-primary buy-now-btn" 
              data-book-id="${book.id}" 
              style="flex: 1;"
              ${inCart ? 'disabled' : ''}
            >
              ${inCart ? 'Στο καλάθι' : 'Αγορά τώρα'}
            </button>
          ` : ''}
        </div>
      </div>
    </article>
  `;
  }).join('');

  // Add event listeners to Buy Now buttons
  container.querySelectorAll('.buy-now-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const bookId = btn.getAttribute('data-book-id');
      if (typeof addToCart === 'function') {
        addToCart(bookId);
      }
    });
  });
}


function renderDetailsPage(item, type) {
  const pageTitle = document.getElementById('page-title');
  const itemImage = document.getElementById('item-image');
  const itemTitle = document.getElementById('item-title');
  const itemMeta = document.getElementById('item-meta');
  const itemDescription = document.getElementById('item-description');
  const itemTopics = document.getElementById('item-topics');
  const itemInfo = document.getElementById('item-info');

  if (pageTitle) pageTitle.textContent = item.title;
  if (itemImage) {
    itemImage.src = item.image;
    itemImage.alt = item.title;
  }
  if (itemTitle) itemTitle.textContent = item.title;

  if (itemMeta && type === 'course') {
    itemMeta.innerHTML = `
      <span class="meta-item">👤 ${item.instructor}</span>
      <span class="meta-item">⏱️ ${item.duration}</span>
      <span class="meta-item">📊 ${item.level}</span>
      <span class="meta-item">👥 ${item.students} φοιτητές</span>
      <span class="meta-item">⭐ ${item.rating}/5</span>
    `;
  } else if (itemMeta && type === 'book') {
    itemMeta.innerHTML = `
      <span class="meta-item">✍️ ${item.author}</span>
      <span class="meta-item">${item.type === 'book' ? '📖 ' + item.pages + ' σελ.' : '🎥 ' + item.duration}</span>
      <span class="meta-item">📅 ${item.year}</span>
      <span class="meta-item">⭐ ${item.rating}/5</span>
    `;
  }

  if (itemDescription) itemDescription.textContent = item.description;

  if (itemTopics && item.topics) {
    itemTopics.innerHTML = item.topics.map(topic => `<span class="tag">${topic}</span>`).join('');
  }

  if (itemInfo && type === 'course') {
    itemInfo.innerHTML = `
      <div class="info-item">
        <div class="info-label">Κατηγορία</div>
        <div class="info-value">${item.category}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Επίπεδο</div>
        <div class="info-value">${item.level}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Διάρκεια</div>
        <div class="info-value">${item.duration}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Τιμή</div>
        <div class="info-value">${item.price}</div>
      </div>
    `;
  } else if (itemInfo && type === 'book') {
    itemInfo.innerHTML = `
      <div class="info-item">
        <div class="info-label">Κατηγορία</div>
        <div class="info-value">${item.category}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Τύπος</div>
        <div class="info-value">${item.type === 'book' ? 'Βιβλίο' : 'Βίντεο'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Μορφή</div>
        <div class="info-value">${item.format}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Τιμή</div>
        <div class="info-value">${item.price}</div>
      </div>
    `;
  }

  // Render CTA buttons based on authentication state
  renderCTAButtons(type);
}

/**
 * Render CTA buttons based on authentication state
 * Shows Subscribe/Favorite buttons if authenticated, or Sign In button if not
 */
function renderCTAButtons(type) {
  const ctaButtonsContainer = document.getElementById('cta-buttons');
  if (!ctaButtonsContainer) return;

  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    // For books, check if already in cart or purchased
    if (type === 'book') {
      const urlParams = new URLSearchParams(window.location.search);
      const bookId = urlParams.get('id');
      const inCart = typeof isInCart === 'function' && isInCart(bookId);
      const purchased = typeof isPurchased === 'function' && isPurchased(bookId);
      const isFav = favouritesService.isFavourite(bookId, 'book');
      const favBtnText = isFav ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα';
      const favBtnClass = isFav ? 'btn-danger' : 'btn-secondary';

      if (purchased) {
        ctaButtonsContainer.innerHTML = `
          <div class="already-bought-badge" style="flex: 1; text-align: center; padding: var(--space-4);">✓ Έχει αγοραστεί</div>
          <button class="btn ${favBtnClass}" style="flex: 1; min-width: 200px;" onclick="handleAddToFavorites(event, '${bookId}', 'book')">
            ${favBtnText}
          </button>
        `;
      } else {
        ctaButtonsContainer.innerHTML = `
          <button id="buy-now-btn" class="btn btn-primary" style="flex: 1; min-width: 200px;" data-book-id="${bookId}" ${inCart ? 'disabled' : ''}>
            ${inCart ? 'Ήδη στο καλάθι' : 'Αγορά τώρα'}
          </button>
          <button class="btn ${favBtnClass}" style="flex: 1; min-width: 200px;" onclick="handleAddToFavorites(event, '${bookId}', 'book')">
            ${favBtnText}
          </button>
        `;

        // Add event listener to buy button
        const buyBtn = document.getElementById('buy-now-btn');
        if (buyBtn && !inCart) {
          buyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof addToCart === 'function') {
              addToCart(bookId);
              // Update button state
              buyBtn.textContent = 'Ήδη στο καλάθι';
              buyBtn.disabled = true;
            }
          });
        }
      }
    } else {
      // For courses, show subscribe button
      // Get course ID
      const urlParams = new URLSearchParams(window.location.search);
      const courseId = urlParams.get('id');
      const isFav = favouritesService.isFavourite(courseId, 'course');
      const favBtnText = isFav ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα';
      const favBtnClass = isFav ? 'btn-danger' : 'btn-secondary';

      const isSubscribed = subscriptionService.isSubscribed(courseId);
      const subBtnText = isSubscribed ? 'Απεγγραφή' : 'Εγγραφή τώρα';
      const subBtnClass = isSubscribed ? 'btn-danger' : 'btn-primary'; // Or outline
      const subBtnAction = isSubscribed ? 'handleToggleSubscription(event)' : 'handleToggleSubscription(event)';

      ctaButtonsContainer.innerHTML = `
        <button class="btn ${subBtnClass}" style="flex: 1; min-width: 200px;" onclick="handleToggleSubscription(event)">
          ${subBtnText}
        </button>
        <button class="btn ${favBtnClass}" style="flex: 1; min-width: 200px;" onclick="handleAddToFavorites(event, '${courseId}', 'course')">
          ${favBtnText}
        </button>
      `;
    }
  } else {
    // Show Sign In / Sign Up button for non-authenticated users
    ctaButtonsContainer.innerHTML = `
      <a href="login.html" class="btn btn-primary" style="flex: 1; text-align: center;">
        Σύνδεση / Εγγραφή για συνέχεια
      </a>
    `;
  }
}

/**
 * Handle subscribe/unsubscribe action
 */
function handleToggleSubscription(event) {
  event.preventDefault();

  // Get ID from URL since we know we are on course page (or pass as arg if needed, but context helps)
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id');
  if (!courseId) return;

  if (subscriptionService.toggleSubscription(courseId)) {
    showNotification('Η εγγραφή σας ολοκληρώθηκε με επιτυχία!', 'success');
  } else {
    showNotification('Η απεγγραφή ολοκληρώθηκε.', 'info');
  }

  // Re-render buttons
  renderCTAButtons('course');
}

/**
 * Handle add to favorites action
 */
function handleAddToFavorites(event, id, type) {
  event.preventDefault();

  if (!favouritesService.toggleFavourite(id, type)) {
    showNotification('Αφαιρέθηκε από τα αγαπημένα', 'info');
  } else {
    showNotification('Προστέθηκε στα αγαπημένα σας!', 'success');
  }

  // Re-render buttons to reflect new state
  renderCTAButtons(type);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function filterBySearch(items, query) {
  const lowerQuery = query.toLowerCase();
  return items.filter(item =>
    item.title.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    (item.author && item.author.toLowerCase().includes(lowerQuery)) ||
    (item.instructor && item.instructor.toLowerCase().includes(lowerQuery))
  );
}
