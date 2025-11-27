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
      <img src="${course.image}" alt="${course.title}" class="course-card-image" onerror="this.src='assets/img/placeholder-course.jpg'">
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

function renderBooks(books, container) {
  if (books.length === 0) {
    container.innerHTML = '<div class="empty-state"><h3>Δεν βρέθηκαν βιβλία/βίντεο</h3><p>Δοκιμάστε διαφορετικά φίλτρα αναζήτησης.</p></div>';
    return;
  }

  container.innerHTML = books.map(book => `
    <article class="book-card">
      <img src="${book.image}" alt="${book.title}" class="book-card-image" onerror="this.src='assets/img/placeholder-book.jpg'">
      <div class="book-card-content">
        <h3 class="book-card-title">${book.title}</h3>
        <p class="course-card-description">${book.author}</p>
        <p class="book-card-description">${book.description}</p>
        <div class="book-card-meta">
          <span class="meta-item">${book.type === 'book' ? '📖' : '🎥'} ${book.type === 'book' ? book.pages + ' σελ.' : book.duration}</span>
          <span class="meta-item">⭐ ${book.rating}</span>
        </div>
        <div class="tags">
          <span class="tag">${book.category}</span>
          <span class="tag">${book.type === 'book' ? 'Βιβλίο' : 'Βίντεο'}</span>
        </div>
        <a href="course-details.html?id=${book.id}&type=book" class="btn btn-primary">Δες περισσότερα</a>
      </div>
    </article>
  `).join('');
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
    itemImage.onerror = function () {
      this.src = type === 'course' ? 'assets/img/placeholder-course.jpg' : 'assets/img/placeholder-book.jpg';
    };
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
    // Show Subscribe and Add to Favorites buttons for authenticated users
    const subscribeText = type === 'course' ? 'Εγγραφή τώρα' : 'Αγορά τώρα';
    ctaButtonsContainer.innerHTML = `
      <button class="btn btn-primary" style="flex: 1; min-width: 200px;" onclick="handleSubscribe(event)">
        ${subscribeText}
      </button>
      <button class="btn btn-secondary" style="flex: 1; min-width: 200px;" onclick="handleAddToFavorites(event)">
        Προσθήκη στα αγαπημένα
      </button>
    `;
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
 * Handle subscribe/enroll action
 */
function handleSubscribe(event) {
  event.preventDefault();
  showNotification('Η εγγραφή σας ολοκληρώθηκε με επιτυχία!', 'success');
  // Add actual subscription logic here
}

/**
 * Handle add to favorites action
 */
function handleAddToFavorites(event) {
  event.preventDefault();
  showNotification('Προστέθηκε στα αγαπημένα σας!', 'success');
  // Add actual favorites logic here
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
