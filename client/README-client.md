# README - Client (Frontend)

## Περιγραφή

Ο client είναι μια web εφαρμογή βασισμένη σε **HTML**, **CSS** και **JavaScript**. Χρησιμοποιεί modular JavaScript για την οργάνωση του κώδικα και επικοινωνεί με το backend μέσω REST API.

---

## Εγκατάσταση & Εκκίνηση

### Μέθοδος 1: Απευθείας Άνοιγμα

Ανοίξτε το αρχείο `client/src/index.html` απευθείας στον browser.

> ⚠️ Ορισμένες λειτουργίες (CORS) μπορεί να μη δουλεύουν σωστά χωρίς HTTP server.

### Μέθοδος 2: Με HTTP Server

```bash
cd client

# Χρήση npx serve
npx serve src

# Ή με Python
python -m http.server 8080 --directory src


## Σύνδεση με το Backend

Ο client επικοινωνεί με το backend μέσω του αρχείου `api.js`:

```javascript
// Ρύθμιση σε: client/src/assets/js/api.js
const API_CONFIG = {
    baseUrl: 'http://localhost:5000',  // URL του backend
    tokenKey: 'elearning_token'
};
```

### Προϋποθέσεις
1. Ο **server πρέπει να τρέχει** στο `http://localhost:5000`
2. Η **MongoDB πρέπει να τρέχει** για τη βάση δεδομένων

---

## Δομή Φακέλου

```
client/
└── src/
    ├── assets/
    │   ├── css/          # Στυλ
    │   ├── images/       # Εικόνες
    │   └── js/           # JavaScript modules
    │       ├── api.js        # Κεντρικό API service
    │       ├── auth.js       # Αυθεντικοποίηση
    │       ├── courses.js    # Λογική μαθημάτων
    │       ├── books.js      # Λογική βιβλίων
    │       └── favourites.js # Λογική αγαπημένων
    ├── index.html        # Αρχική σελίδα
    ├── courses.html      # Σελίδα μαθημάτων
    ├── course-details.html
    ├── books.html        # Σελίδα βιβλίων
    ├── login.html        # Σελίδα σύνδεσης
    ├── register.html     # Σελίδα εγγραφής
    ├── account.html      # Σελίδα λογαριασμού
    ├── favourites.html   # Σελίδα αγαπημένων
    └── about.html        # Σελίδα πληροφοριών
```

---

## Σελίδες Εφαρμογής

| Σελίδα | Αρχείο | Περιγραφή |
|--------|--------|-----------|
| Αρχική | `index.html` | Κεντρική σελίδα με προτεινόμενα μαθήματα |
| Μαθήματα | `courses.html` | Λίστα μαθημάτων με φίλτρα και αναζήτηση |
| Λεπτομέρειες | `course-details.html` | Πλήρεις πληροφορίες μαθήματος |
| Βιβλία | `books.html` | Λίστα βιβλίων με φίλτρα και αναζήτηση |
| Εγγραφή | `register.html` | Φόρμα δημιουργίας λογαριασμού |
| Σύνδεση | `login.html` | Φόρμα σύνδεσης |
| Λογαριασμός | `account.html` | Διαχείριση προφίλ χρήστη |
| Αγαπημένα | `favourites.html` | Αγαπημένα μαθήματα και βιβλία |
| Σχετικά | `about.html` | Πληροφορίες για την πλατφόρμα |

---

## API Service (api.js)

Το αρχείο `api.js` κεντρικοποιεί όλες τις κλήσεις προς το REST API:

```javascript
// Παράδειγμα χρήσης
const result = await api.get('/api/courses');          // GET
const result = await api.post('/api/auth/login', data); // POST
const result = await api.put('/api/user/profile', data); // PUT
const result = await api.delete('/api/user/favourites/course/123'); // DELETE
```

Η υπόλοιπη εφαρμογή δε χρειάζεται να γνωρίζει λεπτομέρειες URL ή headers - όλα τα διαχειρίζεται το `api.js`.

---

## Γρήγορη Εκκίνηση

```bash
# 1. Εκκινήστε πρώτα τον server (σε άλλο terminal)
cd server
npm run dev

# 2. Ανοίξτε τον client
cd client
npx serve src

# 3. Ανοίξτε στον browser: http://localhost:3000
```
