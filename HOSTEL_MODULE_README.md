# SHAMS ERP - Hostel Management Module

## What is this Module?
The SHAMS ERP Hostel Management Module is a centralized digital system designed to automate and manage all operations related to student housing. It eliminates manual paperwork, enabling a modern, BookMyShow-style experience for student room allocations while giving the administration real-time oversight of hostel occupancy, attendance, fee statuses, and facility maintenance.

Built directly into the core ERP, this module connects seamlessly with the Finance system (for fee verification), HR system (for staff details), and the Central User Database (for student profiles).

---

## How It Works
The system operates on a role-based architecture, offering tailored dashboards and capabilities for three primary user types:

1. **Students**: Access a dedicated "Command Center" where they can select their rooms, view their daily/monthly attendance, check their fee ledger, raise maintenance complaints, and request visitor passes.
2. **Wardens**: Utilize an "Operations Hub" to mark room-wise digital roll-call, review maintenance tickets, approve/reject digital leave requests, and manage day-to-day hostel activities.
3. **Chief Wardens**: Oversee the entire campus with an administrative dashboard. They can create hostels, map blocks to specific genders, define room capacities, and have final approval authority over all student room requests based on eligibility and fee status.

---

## Key Use Cases

* **Self-Service Room Allocation**: Students browse available rooms, see their capacity, and lock a bed. The system automatically prevents overbooking using a transactional lock.
* **Smart Attendance Tracking**: Wardens perform daily roll-calls using a room-wise digital grid instead of messy paper registers, instantly calculating student attendance percentages.
* **Digital Issue Ticketing**: Students report room issues (plumbing, electrical, etc.) directly to the warden, who can track, assign, and mark these tickets as resolved.
* **Secure Visitor & Leave Management**: Students request digital gate passes for guests or personal leaves. Wardens track when students leave and return, improving campus security.
* **Fee Verification Gate**: A strict integration that restricts students with pending hostel dues from officially locking a room until their fee ledger is cleared.

---

## Operational Workflow

### 1. Initialization (Admin Phase)
* The Chief Warden logs into the system and maps out the physical infrastructure.
* They create a **Hostel** (e.g., "Boys Hostel A"), add **Blocks/Wings**, and generate **Rooms** with specific bed capacities.

### 2. Room Booking (Student Phase)
* A student logs into their portal. If unallocated, they are presented with a visual room picker.
* The student selects an available room. The system checks their fee status; if cleared, it places a temporary 5-minute "Pending" lock on the bed.

### 3. Verification (Chief Warden Phase)
* The Chief Warden reviews the pending request.
* Upon confirming eligibility, they click **Approve**, converting the student's status to "Active" and officially assigning them to the room.

### 4. Day-to-Day Operations (Warden & Student Phase)
* **Attendance**: At curfew, the Warden opens the dashboard, views students grouped by room, and marks them Present or Absent.
* **Complaints/Visitors**: The student uses their dashboard buttons to raise issues or request visitor passes. The Warden receives these requests in real-time and updates their status (Approved/Resolved).
* **Communication**: The Warden can broadcast digital notices to specific blocks or the entire hostel, appearing instantly on the students' portals.

---

## Functions and Features

### 🏢 Infrastructure Management
* Create and manage multiple Hostels, Blocks, and Rooms.
* Define and restrict block occupancy by gender and define individual bed capacities per room.

### 🛏️ Allocation Engine
* Visual, BookMyShow-style bed selection for students.
* Pessimistic database locking to prevent double-booking of beds.
* Automated expiry of unapproved room reservations.

### 🛡️ Security & Administration
* Strict fee-verification gate restricting access for students with unpaid dues.
* Chief Warden oversight for all final room assignments.
* Action auditing to track who approved or rejected requests.

### 📅 Daily Operations
* **Attendance System**: Room-by-room digital roll-call with visual UI and automated metric calculation.
* **Leave Management**: Students can apply for leave; wardens can approve, automatically updating their operational status.
* **Visitor Passes**: Digital guest logs with check-in/check-out timestamps and relationship tracking.
* **Maintenance Ticketing**: Integrated complaint portal categorized by issue type (e.g., Electrical, Plumbing).

---

## Tech Stack

**Frontend Architecture**
* **Framework**: React.js (Vite)
* **Styling**: Tailwind CSS
* **Design System**: Custom "Matte-Slate" Glassmorphism UI
* **Icons**: Lucide React
* **Routing**: React Router DOM

**Backend Architecture**
* **Framework**: NestJS (Node.js)
* **Database**: PostgreSQL (Neon Cloud)
* **ORM**: TypeORM
* **Authentication**: JWT & Passport-based Role Guards
* **Concurrency**: Transaction-based pessimistic write locking for bed allocations
