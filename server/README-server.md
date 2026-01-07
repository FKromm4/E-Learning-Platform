# README - Server (Backend API)

## Περιγραφή

Ο server είναι ένα REST API βασισμένο σε **Node.js** και **Express**, με βάση δεδομένων **MongoDB**. Χειρίζεται την αυθεντικοποίηση χρηστών, τη διαχείριση μαθημάτων και βιβλίων, καθώς και το ανέβασμα αρχείων.

---

## Εγκατάσταση Dependencies

```bash
cd server
npm install
```

---

## Ρύθμιση Περιβάλλοντος (.env)

Δημιουργήστε ένα αρχείο `.env` στον φάκελο `server/` με τα εξής:

```env
# Ρυθμίσεις Server
PORT=5000
NODE_ENV=development

# Σύνδεση MongoDB
MONGODB_URI=mongodb://localhost:27017/elearning

# Ρυθμίσεις JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Μέγιστο μέγεθος αρχείου (5MB)
MAX_FILE_SIZE=5242880
```

>  **Σημαντικό:** Αλλάξτε το `JWT_SECRET` σε production!

---

## Εντολές Εκκίνησης

| Εντολή | Περιγραφή |
|--------|-----------|
| `npm run dev` | Εκκίνηση σε development mode (με nodemon για auto-restart) |
| `npm start` | Εκκίνηση σε production mode |
| `npm run seed` | Εισαγωγή δοκιμαστικών δεδομένων στη βάση |

### Γρήγορη Εκκίνηση

```bash
# 1. Βεβαιωθείτε ότι τρέχει η MongoDB
# 2. Εγκαταστήστε τα dependencies
npm install

# 3. (Προαιρετικά) Γεμίστε τη βάση με δεδομένα
npm run seed

# 4. Εκκινήστε τον server
npm run dev
```

Ο server θα τρέξει στο: **http://localhost:5000**

---

## Βασικά API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Περιγραφή |
|--------|----------|-----------|
| POST | `/api/auth/register` | Εγγραφή νέου χρήστη |
| POST | `/api/auth/login` | Σύνδεση χρήστη |

### Courses (`/api/courses`)
| Method | Endpoint | Περιγραφή |
|--------|----------|-----------|
| GET | `/api/courses` | Λίστα μαθημάτων (με φίλτρα & αναζήτηση) |
| GET | `/api/courses/featured` | Προτεινόμενα μαθήματα |
| GET | `/api/courses/categories` | Κατηγορίες μαθημάτων |
| GET | `/api/courses/:id` | Λεπτομέρειες μαθήματος |

### Books (`/api/books`)
| Method | Endpoint | Περιγραφή |
|--------|----------|-----------|
| GET | `/api/books` | Λίστα βιβλίων (με φίλτρα & αναζήτηση) |
| GET | `/api/books/featured` | Προτεινόμενα βιβλία |
| GET | `/api/books/categories` | Κατηγορίες βιβλίων |
| GET | `/api/books/:id` | Λεπτομέρειες βιβλίου |

### User (`/api/user`) - Απαιτεί Αυθεντικοποίηση
| Method | Endpoint | Περιγραφή |
|--------|----------|-----------|
| GET | `/api/user/profile` | Προβολή προφίλ |
| PUT | `/api/user/profile` | Ενημέρωση προφίλ |
| PUT | `/api/user/password` | Αλλαγή κωδικού |
| GET | `/api/user/favourites` | Λίστα αγαπημένων |
| POST | `/api/user/favourites` | Προσθήκη στα αγαπημένα |
| DELETE | `/api/user/favourites/:type/:id` | Αφαίρεση από αγαπημένα |

### Media (`/api/media`) - Απαιτεί Αυθεντικοποίηση
| Method | Endpoint | Περιγραφή |
|--------|----------|-----------|
| POST | `/api/media/upload` | Ανέβασμα εικόνας |
| DELETE | `/api/media/:filename` | Διαγραφή εικόνας |

### Utility
| Method | Endpoint | Περιγραφή |
|--------|----------|-----------|
| GET | `/api` | Πληροφορίες API |
| GET | `/api/health` | Health check |

---

## Δομή Φακέλου

```
server/
├── src/
│   ├── config/          # Ρυθμίσεις (database)
│   ├── controllers/     # Λογική endpoints
│   ├── middleware/      # Auth, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Ορισμός routes
│   ├── scripts/         # Seed script
│   └── index.js         # Entry point
├── uploads/             # Ανεβασμένα αρχεία
├── .env                 # Μεταβλητές περιβάλλοντος
└── package.json
```
