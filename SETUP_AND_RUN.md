# MentorBridge — Setup & Run Guide (One Command)

This project lives inside the **`mentorbridge/`** folder.

If you see an error like **“Could not read package.json”**, you are almost always in the wrong directory.

---

## 1) Troubleshooting: Make sure you are in the correct folder

### Windows (PowerShell / CMD)
Run:
```bash
dir
```

You should see a `package.json` file in the output.

If you **do not** see `package.json`, change into the project folder:
```bash
cd mentorbridge
```

### macOS / Linux
Run:
```bash
ls
```

You should see a `package.json` file.

If you **do not** see `package.json`, change into the project folder:
```bash
cd mentorbridge
```

---

## 2) The Magic Command (installs + seeds + starts)

From the folder that contains `package.json`, run:

```bash
npm run setup
```

What it does automatically:
- Creates `.env.local` (from `.env.example` if needed)
- Fills in default local environment values
- Installs dependencies
- Seeds MongoDB with demo data
- Starts the Next.js dev server

Then open:
- http://localhost:3000

---

## 3) Demo Login Details

### Admin
- **Email:** `admin@example.com`
- **Password:** `Test@123`

---

## 4) Common Commands

Run these from the folder that contains `package.json`:

- **Normal start (no install/seed automation):**
  ```bash
  npm run dev
  ```

- **Seed database only (reset demo data):**
  ```bash
  npm run seed
  ```

- **Lint:**
  ```bash
  npm run lint
  ```

- **Build + run production mode:**
  ```bash
  npm run build
  npm run start
  ```

---

## 5) Quick sanity checks

- If `npm run setup` fails, confirm:
  - MongoDB is running locally (or `MONGODB_URI` points to a reachable Mongo instance)
  - You are inside the correct folder (you can see `package.json`)
