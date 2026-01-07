/**
 * Database Seed Script
 * Populates the database with initial course and book data
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Book = require('../models/Book');

// Course data from frontend
const coursesData = [
    {
        title: 'Python για Αρχάριους',
        description: 'Μάθε τα βασικά της Python από το μηδέν. Ιδανικό για όσους ξεκινούν τον προγραμματισμό.',
        category: 'Προγραμματισμός',
        instructor: 'Δρ. Μαρία Παπαδοπούλου',
        duration: '8 εβδομάδες',
        level: 'Αρχάριο',
        students: 1250,
        rating: 4.8,
        image: 'assets/img/courses/python-basics.jpg',
        featured: true,
        topics: ['Μεταβλητές', 'Συναρτήσεις', 'Loops', 'OOP'],
        price: 'Δωρεάν'
    },
    {
        title: 'JavaScript & React',
        description: 'Κατασκευή σύγχρονων web εφαρμογών με JavaScript και React framework.',
        category: 'Προγραμματισμός',
        instructor: 'Γιώργος Νικολάου',
        duration: '10 εβδομάδες',
        level: 'Μεσαίο',
        students: 980,
        rating: 4.9,
        image: 'assets/img/courses/javascript-react.jpg',
        featured: true,
        topics: ['ES6+', 'React Hooks', 'State Management', 'API Integration'],
        price: '49€'
    },
    {
        title: 'Δίκτυα Υπολογιστών',
        description: 'Κατανόηση πρωτοκόλλων TCP/IP, routing, switching και ασφάλειας δικτύων.',
        category: 'Δίκτυα',
        instructor: 'Καθηγ. Κώστας Αντωνίου',
        duration: '12 εβδομάδες',
        level: 'Μεσαίο',
        students: 750,
        rating: 4.7,
        image: 'assets/img/courses/networking.jpg',
        featured: true,
        topics: ['TCP/IP', 'Routing', 'VLANs', 'Network Security'],
        price: '79€'
    },
    {
        title: 'SQL & Βάσεις Δεδομένων',
        description: 'Μάθε να σχεδιάζεις και να διαχειρίζεσαι σχεσιακές βάσεις δεδομένων.',
        category: 'Βάσεις Δεδομένων',
        instructor: 'Ελένη Γεωργίου',
        duration: '6 εβδομάδες',
        level: 'Αρχάριο',
        students: 1100,
        rating: 4.6,
        image: 'assets/img/courses/sql-databases.jpg',
        featured: false,
        topics: ['SQL Queries', 'Normalization', 'Indexes', 'Transactions'],
        price: 'Δωρεάν'
    },
    {
        title: 'Κυβερνοασφάλεια',
        description: 'Προστασία συστημάτων και δεδομένων από κυβερνοεπιθέσεις.',
        category: 'Ασφάλεια',
        instructor: 'Δημήτρης Βασιλείου',
        duration: '10 εβδομάδες',
        level: 'Προχωρημένο',
        students: 620,
        rating: 4.9,
        image: 'assets/img/courses/cybersecurity.jpg',
        featured: false,
        topics: ['Penetration Testing', 'Encryption', 'Firewalls', 'Incident Response'],
        price: '99€'
    },
    {
        title: 'Java Programming',
        description: 'Ολοκληρωμένο μάθημα Java από τα βασικά έως προχωρημένα θέματα.',
        category: 'Προγραμματισμός',
        instructor: 'Αλέξανδρος Μιχαηλίδης',
        duration: '14 εβδομάδες',
        level: 'Μεσαίο',
        students: 890,
        rating: 4.7,
        image: 'assets/img/courses/java-programming.png',
        featured: false,
        topics: ['OOP', 'Collections', 'Multithreading', 'Spring Framework'],
        price: '69€'
    },
    {
        title: 'Cloud Computing με AWS',
        description: 'Μάθε να χρησιμοποιείς τις υπηρεσίες του Amazon Web Services.',
        category: 'Cloud',
        instructor: 'Σοφία Κωνσταντίνου',
        duration: '8 εβδομάδες',
        level: 'Μεσαίο',
        students: 540,
        rating: 4.8,
        image: 'assets/img/courses/aws-cloud.png',
        featured: false,
        topics: ['EC2', 'S3', 'Lambda', 'RDS'],
        price: '89€'
    },
    {
        title: 'Machine Learning Basics',
        description: 'Εισαγωγή στη Μηχανική Μάθηση με Python και scikit-learn.',
        category: 'AI/ML',
        instructor: 'Δρ. Νίκος Παπαδάκης',
        duration: '12 εβδομάδες',
        level: 'Προχωρημένο',
        students: 710,
        rating: 4.9,
        image: 'assets/img/courses/machine-learning.png',
        featured: false,
        topics: ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Model Evaluation'],
        price: '129€'
    },
    {
        title: 'Docker & Kubernetes',
        description: 'Containerization και orchestration για σύγχρονες εφαρμογές.',
        category: 'DevOps',
        instructor: 'Παναγιώτης Ιωάννου',
        duration: '6 εβδομάδες',
        level: 'Προχωρημένο',
        students: 480,
        rating: 4.7,
        image: 'assets/img/courses/docker-kubernetes.png',
        featured: false,
        topics: ['Docker Containers', 'Docker Compose', 'Kubernetes Clusters', 'Deployment Strategies'],
        price: '79€'
    }
];

// Book data from frontend
const booksData = [
    {
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

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Course.deleteMany({});
        await Book.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Insert courses
        const courses = await Course.insertMany(coursesData);
        console.log(`📚 Inserted ${courses.length} courses`);

        // Insert books
        const books = await Book.insertMany(booksData);
        console.log(`📖 Inserted ${books.length} books`);

        console.log('');
        console.log('✨ Database seeded successfully!');
        console.log('');
        console.log('Course IDs:');
        courses.forEach((course, i) => {
            console.log(`  ${i + 1}. ${course.title}: ${course._id}`);
        });
        console.log('');
        console.log('Book IDs:');
        books.forEach((book, i) => {
            console.log(`  ${i + 1}. ${book.title}: ${book._id}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
