// ============================================
// COURSES.JS - Sample Course Data
// ============================================

const coursesData = [
    {
        id: 1,
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
        id: 2,
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
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 6,
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
        id: 7,
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
        id: 8,
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
        id: 9,
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

// Get all courses
function getAllCourses() {
    return coursesData;
}

// Get featured courses
function getFeaturedCourses(limit = 3) {
    return coursesData.filter(course => course.featured).slice(0, limit);
}

// Get course by ID
function getCourseById(id) {
    return coursesData.find(course => course.id === parseInt(id));
}

// Get courses by category
function getCoursesByCategory(category) {
    if (!category || category === 'all') {
        return coursesData;
    }
    return coursesData.filter(course => course.category === category);
}

// Get unique categories
function getCategories() {
    const categories = [...new Set(coursesData.map(course => course.category))];
    return ['all', ...categories];
}

// Search courses
function searchCourses(query) {
    const lowerQuery = query.toLowerCase();
    return coursesData.filter(course =>
        course.title.toLowerCase().includes(lowerQuery) ||
        course.description.toLowerCase().includes(lowerQuery) ||
        course.category.toLowerCase().includes(lowerQuery)
    );
}
