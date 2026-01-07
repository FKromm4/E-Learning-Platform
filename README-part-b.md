# README - Μέρος Β: Συνολική Επισκόπηση

## Περιγραφή Έργου

Η εφαρμογή E-Learning Platform είναι ένα πλήρες client-server σύστημα για διαχείριση online μαθημάτων και βιβλίων. Αποτελείται από:

- **Server (Backend):** REST API με Node.js, Express και MongoDB
- **Client (Frontend):** Web εφαρμογή με HTML, CSS και modular JavaScript

---

## Αρχιτεκτονική

Η εφαρμογή ακολουθεί την αρχιτεκτονική **client-server**:

- Ο **Client** (frontend) τρέχει στον browser του χρήστη και είναι υπεύθυνος για την εμφάνιση της διεπαφής (HTML/CSS) και την αλληλεπίδραση με τον χρήστη (JavaScript).

- Ο **Server** (backend) τρέχει στο `http://localhost:5000` και παρέχει ένα REST API. Δέχεται αιτήματα HTTP από τον client, επεξεργάζεται τα δεδομένα, επικοινωνεί με τη βάση MongoDB, και επιστρέφει απαντήσεις σε μορφή JSON.

- Η επικοινωνία μεταξύ client και server γίνεται μέσω HTTP requests (GET, POST, PUT, DELETE) και οι απαντήσεις είναι πάντα σε μορφή JSON.

---

## Ροή Δεδομένων

### 1. Αυθεντικοποίηση (Login)
Όταν ο χρήστης κάνει σύνδεση, ο client στέλνει το email και τον κωδικό στο endpoint `/api/auth/login`. Ο server αναζητά τον χρήστη στη βάση, ελέγχει αν ο κωδικός είναι σωστός, και αν ναι, επιστρέφει ένα JWT token. Ο client αποθηκεύει αυτό το token στο localStorage και το χρησιμοποιεί σε κάθε επόμενο αίτημα που απαιτεί αυθεντικοποίηση.

### 2. Λήψη Δεδομένων (Μαθήματα/Βιβλία)
Όταν ο χρήστης επισκέπτεται τη σελίδα μαθημάτων ή βιβλίων, ο client στέλνει ένα GET αίτημα στο αντίστοιχο endpoint (π.χ. `/api/courses`). Μπορεί να περιλαμβάνει φίλτρα όπως κατηγορία ή αναζήτηση. Ο server κάνει query στη MongoDB με τα φίλτρα και επιστρέφει τα αποτελέσματα σε JSON. Ο client τα λαμβάνει και τα εμφανίζει στη σελίδα.

### 3. Προστατευμένες Ενέργειες (π.χ. Αγαπημένα)
Για ενέργειες που απαιτούν σύνδεση (όπως προσθήκη στα αγαπημένα), ο client στέλνει το αίτημα μαζί με το JWT token στο header `Authorization`. Ο server επαληθεύει το token, εκτελεί την ενέργεια στη βάση, και επιστρέφει επιβεβαίωση επιτυχίας ή αποτυχίας.

---

## Διαθέσιμα Endpoints

### Authentication
| Endpoint | Method | Περιγραφή |
|----------|--------|-----------|
| `/api/auth/register` | POST | Εγγραφή νέου χρήστη |
| `/api/auth/login` | POST | Σύνδεση και λήψη JWT token |

### Courses
| Endpoint | Method | Περιγραφή |
|----------|--------|-----------|
| `/api/courses` | GET | Λίστα μαθημάτων (φίλτρα: category, level, search) |
| `/api/courses/featured` | GET | Προτεινόμενα μαθήματα |
| `/api/courses/categories` | GET | Διαθέσιμες κατηγορίες |
| `/api/courses/:id` | GET | Λεπτομέρειες μαθήματος |

### Books
| Endpoint | Method | Περιγραφή |
|----------|--------|-----------|
| `/api/books` | GET | Λίστα βιβλίων (φίλτρα: category, type, search) |
| `/api/books/featured` | GET | Προτεινόμενα βιβλία |
| `/api/books/categories` | GET | Διαθέσιμες κατηγορίες |
| `/api/books/:id` | GET | Λεπτομέρειες βιβλίου |

### User (Απαιτεί JWT)
| Endpoint | Method | Περιγραφή |
|----------|--------|-----------|
| `/api/user/profile` | GET | Λήψη προφίλ |
| `/api/user/profile` | PUT | Ενημέρωση προφίλ |
| `/api/user/password` | PUT | Αλλαγή κωδικού |
| `/api/user/favourites` | GET | Λίστα αγαπημένων |
| `/api/user/favourites` | POST | Προσθήκη στα αγαπημένα |
| `/api/user/favourites/:type/:id` | DELETE | Αφαίρεση από αγαπημένα |

### Media ( Απαιτεί JWT)
| Endpoint | Method | Περιγραφή |
|----------|--------|-----------|
| `/api/media/upload` | POST | Ανέβασμα εικόνας |
| `/api/media/:filename` | DELETE | Διαγραφή εικόνας |

---

## Υλοποιημένη Λειτουργικότητα

###  Πλήρως Υλοποιημένα
- [x] Εγγραφή και σύνδεση χρηστών με JWT
- [x] Προβολή λίστας μαθημάτων με φίλτρα (κατηγορία, επίπεδο)
- [x] Αναζήτηση μαθημάτων
- [x] Προβολή λεπτομερειών μαθήματος
- [x] Προβολή λίστας βιβλίων με φίλτρα (κατηγορία, τύπος)
- [x] Αναζήτηση βιβλίων
- [x] Διαχείριση αγαπημένων (προσθήκη/αφαίρεση)
- [x] Προβολή και επεξεργασία προφίλ χρήστη
- [x] Αλλαγή κωδικού πρόσβασης
- [x] Ανέβασμα εικόνας προφίλ
- [x] Προτεινόμενα μαθήματα/βιβλία στην αρχική

###  Δομή Βάσης Δεδομένων

**User Schema:**
- email, password (hashed), firstName, lastName
- favourites: { courses: [], books: [] }
- paymentMethods: []

**Course Schema:**
- title, description, instructor, category, level
- duration, lessons, rating, students, price
- image, isFeatured

**Book Schema:**
- title, author, description, category, type
- pages, rating, price, image, isFeatured

---

## Οδηγίες Εκτέλεσης

### 1. Εκκίνηση MongoDB
```bash
# Windows
mongod

# ή με MongoDB Compass
```

### 2. Εκκίνηση Server
```bash
cd server
npm install
npm run seed  # Εισαγωγή δοκιμαστικών δεδομένων
npm run dev
```
Server URL: **http://localhost:5000**

### 3. Εκκίνηση Client
Ανοίξτε το αρχείο `client/src/index.html` στον browser.

---

## Τεχνολογίες

| Κατηγορία | Τεχνολογία |
|-----------|------------|
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT (jsonwebtoken), bcryptjs |
| Security | Helmet, CORS |
| File Upload | Multer |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| API Service | Custom api.js module |
