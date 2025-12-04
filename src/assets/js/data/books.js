const booksData = [
    {
        id: 1,
        title: 'Clean Code',
        author: 'Robert C. Martin',
        description: 'Ένας οδηγός για τη συγγραφή καθαρού, κατανοητού και συντηρήσιμου κώδικα.',
        category: 'Προγραμματισμός',
        type: 'book',
        pages: 464,
        year: 2008,
        rating: 4.9,
        image: 'assets/img/books/clean-code-course.png',
        featured: true,
        topics: ['Best Practices', 'Code Quality', 'Refactoring'],
        price: '35€',
        format: 'PDF, ePub'
    },
    {
        id: 2,
        title: 'Computer Networking: A Top-Down Approach',
        author: 'James Kurose, Keith Ross',
        description: 'Το κλασικό βιβλίο για δίκτυα υπολογιστών με προσέγγιση από την εφαρμογή προς το υλικό.',
        category: 'Δίκτυα',
        type: 'book',
        pages: 864,
        year: 2021,
        rating: 4.8,
        image: 'assets/img/books/networking-course.png',
        featured: true,
        topics: ['Network Protocols', 'Internet Architecture', 'Security'],
        price: '45€',
        format: 'PDF'
    },
    {
        id: 3,
        title: 'Database System Concepts',
        author: 'Abraham Silberschatz',
        description: 'Ολοκληρωμένη εισαγωγή στα συστήματα βάσεων δεδομένων.',
        category: 'Βάσεις Δεδομένων',
        type: 'book',
        pages: 1376,
        year: 2020,
        rating: 4.7,
        image: 'assets/img/books/database-systems.png',
        featured: true,
        topics: ['Relational Databases', 'SQL', 'Transaction Management', 'NoSQL'],
        price: '50€',
        format: 'PDF, ePub'
    },
    {
        id: 4,
        title: 'Python Crash Course',
        author: 'Eric Matthes',
        description: 'Γρήγορη εισαγωγή στην Python με πρακτικά projects.',
        category: 'Προγραμματισμός',
        type: 'book',
        pages: 544,
        year: 2019,
        rating: 4.8,
        image: 'assets/img/books/python-course.png',
        featured: false,
        topics: ['Python Basics', 'Data Visualization', 'Web Applications'],
        price: '30€',
        format: 'PDF, ePub'
    },
    {
        id: 5,
        title: 'Introduction to Algorithms (Video Series)',
        author: 'MIT OpenCourseWare',
        description: 'Σειρά βίντεο διαλέξεων για αλγορίθμους και δομές δεδομένων.',
        category: 'Αλγόριθμοι',
        type: 'video',
        duration: '24 ώρες',
        year: 2020,
        rating: 4.9,
        image: 'assets/img/books/algorithms.png',
        featured: false,
        topics: ['Sorting', 'Graph Algorithms', 'Dynamic Programming', 'Complexity Analysis'],
        price: 'Δωρεάν',
        format: 'Video (MP4)'
    },
    {
        id: 6,
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt, David Thomas',
        description: 'Συμβουλές και τεχνικές για να γίνεις καλύτερος προγραμματιστής.',
        category: 'Προγραμματισμός',
        type: 'book',
        pages: 352,
        year: 2019,
        rating: 4.8,
        image: 'assets/img/books/pragrmatic-programming.png',
        featured: false,
        topics: ['Software Craftsmanship', 'Career Development', 'Tools'],
        price: '32€',
        format: 'PDF, ePub'
    },
    {
        id: 7,
        title: 'Cybersecurity Fundamentals (Video Course)',
        author: 'CompTIA',
        description: 'Βίντεο μαθήματα για τα θεμέλια της κυβερνοασφάλειας.',
        category: 'Ασφάλεια',
        type: 'video',
        duration: '18 ώρες',
        year: 2022,
        rating: 4.7,
        image: 'assets/img/books/cyber-security.png',
        featured: false,
        topics: ['Threat Analysis', 'Security Tools', 'Compliance', 'Risk Management'],
        price: '59€',
        format: 'Video (MP4)'
    },
    {
        id: 8,
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        description: 'Αρχιτεκτονική και σχεδιασμός εφαρμογών με μεγάλο όγκο δεδομένων.',
        category: 'Βάσεις Δεδομένων',
        type: 'book',
        pages: 616,
        year: 2017,
        rating: 4.9,
        image: 'assets/img/books/data-intensive.png',
        featured: false,
        topics: ['Distributed Systems', 'Scalability', 'Reliability', 'Maintainability'],
        price: '42€',
        format: 'PDF, ePub'
    }
];

// Get all books
function getAllBooks() {
    return booksData;
}

// Get featured books
function getFeaturedBooks(limit = 3) {
    return booksData.filter(book => book.featured).slice(0, limit);
}

// Get book by ID
function getBookById(id) {
    return booksData.find(book => book.id === parseInt(id));
}

// Get books by category
function getBooksByCategory(category) {
    if (!category || category === 'all') {
        return booksData;
    }
    return booksData.filter(book => book.category === category);
}

// Get books by type
function getBooksByType(type) {
    if (!type || type === 'all') {
        return booksData;
    }
    return booksData.filter(book => book.type === type);
}

// Get unique categories
function getBookCategories() {
    const categories = [...new Set(booksData.map(book => book.category))];
    return ['all', ...categories];
}

// Search books
function searchBooks(query) {
    const lowerQuery = query.toLowerCase();
    return booksData.filter(book =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.description.toLowerCase().includes(lowerQuery) ||
        book.category.toLowerCase().includes(lowerQuery)
    );
}
