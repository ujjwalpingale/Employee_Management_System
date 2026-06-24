# Employee Management System

Welcome to the **Employee Management System**! This is a simple, easy-to-use web application designed to help administrators keep track of company departments and employees. 

## 🌟 Features
* **Admin Dashboard:** A central hub to view important statistics and navigation links.
* **Manage Departments:** Create new departments (e.g., "Engineering", "HR") and delete them when they are no longer needed.
* **Manage Employees:** Add new employees, assign them to a specific department, set their salaries, and manage their records.
* **Search & Filter:** Easily search for employees by name or filter them by their department ID and designation.
* **Secure Authentication:** Secure sign-up and login system. 

> **Note:** This application is strictly an **Admin Dashboard**. Anyone who registers an account is automatically given administrative access to perform all actions.

---

## 🛠️ Technology Stack
This project is built using modern web development tools:

**Frontend:**
* **React** & **Vite**: For a lightning-fast and interactive user interface.
* **TypeScript**: To ensure code reliability.
* **Zustand**: For simple and effective state management (keeping track of who is logged in).

**Backend:**
* **FastAPI (Python)**: A high-performance web framework for building the APIs.
* **MySQL & SQLAlchemy**: To safely store and manage all application data.
* **JWT & bcrypt**: For secure login tokens and password hashing.

---

## 🚀 How to Run the Project Locally

Follow these simple steps to get the project running on your own computer.

### Step 1: Database Setup
1. Make sure you have **MySQL** installed and running on your computer.
2. Open the `.env` file in the root folder of this project.
3. Update the `DATABASE_URL` with your own MySQL username and password. By default, the application expects a database named `employee_management`. 

### Step 2: Start the Backend (FastAPI)
1. Open your terminal and navigate to the project's root directory.
2. Activate your virtual environment (if you are using one):
   ```bash
   .\venv\Scripts\activate
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The backend will now be running at `http://localhost:8000`.*

### Step 3: Start the Frontend (React)
1. Open a **new** terminal window (leave the backend running) and go into the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the necessary Node packages (you only need to do this once):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will now be accessible at `http://localhost:5173`.*

---

## 🎉 You're all set!
Open `http://localhost:5173` in your web browser. Click **"Sign up"** to create a new account, and you can start adding departments and employees right away!