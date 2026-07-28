# Education ERP — Department Management Portal

A full-stack HOD & Faculty portal for managing students, faculty, activities, and timetables across all semesters.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Tailwind CSS, Zustand, Axios |
| Backend | Node.js, Express, Prisma ORM |
| Database | PostgreSQL |

---

## Prerequisites

Make sure you have these installed before starting:

- [Node.js](https://nodejs.org/) v18 or higher
- [PostgreSQL](https://www.postgresql.org/) v14 or higher
- npm v9 or higher

---

## Getting Started

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd Education_ERP
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Copy the example env file and fill in your values:

```bash
copy .env.example .env
```

Open `backend/.env` and set:

```env
DATABASE_URL="postgresql://<your_user>:<your_password>@localhost:<port>/<db_name>"
JWT_SECRET="any-long-random-string-32-chars-min"
JWT_REFRESH_SECRET="another-long-random-string"
```

> Default PostgreSQL port is `5432`. The `.env.example` uses `5050` — change it to match your setup.

### 3. Set up the database

Run migrations to create all tables:

```bash
npm run db:migrate
```

Seed all data (run all three in order):

```bash
# 1. Faculty list + HOD accounts (main portal)
npm run db:seed

# 2. Student list module — semesters, subjects, timetables, students (all 8 sems × 4 sections)
npm run db:seed:studentlist

# 3. Activities — hackathons, sports, industry projects, etc.
npm run db:seed:activities
```

### 4. Start the backend

```bash
npm run dev
```

Backend runs at **http://localhost:5000**

### 5. Set up and start the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs at **http://localhost:3000**

---

## Login Credentials

### HOD Portal (main login)

| Department | Username | Password |
|---|---|---|
| CSE | `hod_cse` | `hod@cse123` |
| ECE | `hod_ece` | `hod@ece123` |

> On the login page, select your department code (CSE or ECE), enter the username and password above.

### Faculty (main portal)

All faculty share the password `faculty@123`. Usernames: `sathyaseelan`, `priya_dharshini`, `karthikeyan_r`, etc.

---

## What Gets Seeded

After running all three seed commands:

| Data | Count |
|---|---|
| Semesters | 8 (1–8) |
| Sections per semester | 4 (A, B, C, D) |
| Subjects | 5 per semester (40 total) |
| Timetable slots | 30 per section (960 total) |
| Students | 12 per section (384 total) |
| Faculty (main portal) | 10 (CSE + ECE) |
| Hackathons | 15 records |
| Sports activities | 14 records |
| Industry projects | 5 projects |
| Other curricular | 18 records |

Navigate to **Student List → any semester → any section** to see the subject-faculty assignment table, timetable grid, and student list.

---

## Project Structure

```
Education_ERP/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   ├── seed.js                # Faculty & HOD accounts
│   │   ├── seedStudentList.js     # All student list data
│   │   └── seedActivities.js      # Student activities
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── routes/
│       ├── middlewares/
│       └── utils/
└── frontend/
    └── src/
        ├── pages/hod/             # HOD portal pages
        ├── components/            # Reusable UI components
        ├── services/              # API call layer
        └── context/               # Zustand auth store
```

---

## Common Issues

**`EADDRINUSE: port 5000`** — another process is using port 5000. Find and kill it:
```bash
netstat -ano | findstr :5000
taskkill /PID <pid> /F
```
Or change `PORT=5001` in `backend/.env`.

**`cross-env is not recognized`** — run `npm install` in the frontend folder first.

**`Access denied. HOD role required.`** — make sure you're logged in with an HOD account (`hod_cse` / `hod@cse123`), not a faculty account.

**Blank student list / timetable** — the seed for that semester/section hasn't run. Run `npm run db:seed:studentlist` from the backend folder.
