# Annapurna — Food Rescue & Redistribution Management System

A web platform connecting donors with surplus perishable food (weddings, banquets, hotels, caterers) to verified NGOs and volunteer courier fleets in real time.

---

## 🚀 Quick Start Guide

### 1. Start the Backend (Spring Boot 3)
You can start the backend in either of two ways:

#### Option A: Directly from your IDE
- Open `backend/src/main/java/com/foodrescue/FoodRescueApplication.java`
- Click the **Run** ▶️ icon or press `F5` / `Ctrl+F5`.

#### Option B: Via Terminal / Script
Double-click `start-backend.bat` in the root folder, or run:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
> The backend runs at: **`http://localhost:8080`**  
> In-memory H2 Console: **`http://localhost:8080/h2-console`** (JDBC URL: `jdbc:h2:mem:foodrescuedb`, User: `sa`, Password: empty)

---

### 2. Start the Frontend (React + Vite)
Double-click `start-frontend.bat` in the root folder, or run:
```powershell
cd frontend
npm run dev
```
> The frontend application runs at: **`http://localhost:5173`**

---

## 👥 Pre-seeded Demo Accounts

| Role | Name | Email | Password | Key PRD Capability |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Platform Manager | `admin@foodrescue.org` | `admin123` | NGO verification, user toggles, CSV report export, metrics |
| **Donor** | Rohit Verma (Wedding Organizer) | `rohit.wedding@lucknow.com` | `password123` | Post surplus food in 2 mins, edit/cancel, track lifecycle |
| **NGO (Verified)** | Hope Foundation | `ngo.hope@foodrescue.org` | `password123` | Browse nearby food, 1-click accept, confirm meals served |
| **NGO (Unverified)**| Care & Share Trust | `ngo.care@foodrescue.org` | `password123` | Demonstrates PRD FR-1.5: requires Admin approval |
| **Volunteer** | Amit Kumar | `amit.volunteer@foodrescue.org` | `password123` | Open tasks, Google Maps navigation, mark collected/delivered |

> **Pro Tip:** In the frontend, use the floating **Quick Role Switcher** bar at the top of the screen to switch between any of these 5 accounts with 1 click!

---

## 🔄 End-to-End Walkthrough (The Lucknow Wedding Example)

1. **Donor (Rohit)**:
   - Click **Donor (Rohit)** on the top switcher.
   - Click **Post Surplus Food** ➔ Click the **Lucknow Wedding Banquet (150 kg)** quick preset ➔ Broadcast.
   - Status: `AVAILABLE` with live ticking countdown timer.

2. **NGO (Hope Foundation)**:
   - Click **NGO (Verified)** on the top switcher.
   - Under Available Food Feed, see Rohit's listing with distance (5.2 km away).
   - Click **Accept & Reserve Food** ➔ Choose **Request Volunteer** ➔ Confirm.
   - Status updates to `ACCEPTED`.

3. **Volunteer (Amit)**:
   - Click **Volunteer (Amit)** on the top switcher.
   - Under **Open Requests**, see the task ➔ Click **Accept This Pickup Task**.
   - Status updates to `ASSIGNED`.
   - Click **Navigate to Pickup (Google Maps)** for turn-by-turn directions.
   - Click **Mark as Collected** ➔ Status moves to `COLLECTED`.
   - Click **Mark as Delivered** ➔ Status moves to `DELIVERED`.

4. **NGO Receipt & Stats**:
   - Switch back to **NGO (Verified)** ➔ Click **Confirm Receipt & Complete Rescue** ➔ Enter actual people served (300).
   - Status updates to `COMPLETED` with celebration confetti!

5. **Admin Impact Monitoring**:
   - Click **Admin** on the top switcher.
   - View updated stats: **Food Rescued: 230 kg**, **People Served: 475**.
   - Download the CSV audit log via **Export Donation Audit Report**.
