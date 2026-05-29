# SHAMS ERP - Hostel Module Development Strategy & QA

## 💎 1. Cross-Module Integration (MOST IMPORTANT)
*This is what makes it a real ERP module.*

👉 **Student Module**
*   **Auto-fetch:** The Hostel module will automatically pull data (Name, Branch, Semester, Gender) from the `StudentMaster` table using the `registerno`.
*   **No Redundancy:** We will not store duplicate student data inside the Hostel tables. We only store the `registerno` as a reference.

👉 **Finance Module**
*   **Fee Sync:** When a room is allocated, the system automatically triggers a "Hostel Fee" entry in the student's ledger.
*   **Categories:** Tracking for **Hostel Fee**, **Mess Fee**, and **Laundry Fee**.
*   **In-Dashboard Payment:** Students will have a **"Pay Now"** button directly on their Hostel Dashboard. No separate finance page is needed for hostel-related payments.
*   **Dues & Penalties:** Any penalties (damage, late fees) are automatically synced to the Finance module for payment collection.

👉 **HR Module**
*   **Staff Mapping:** All Wardens and Hostel staff are linked directly to their **Employee Records** in the HR module. 
*   **Role Management:** If a staff member leaves the university (marked in HR), their access to the Hostel portal is automatically revoked.

👉 **Leave / Outpass Management**
*   **Digital Application:** Students apply for leaves or outpasses directly through the portal.
*   **Approval Workflow:** The assigned Warden reviews the request and either **Approves** or **Rejects** it.
*   **Real-time Tracking:** Students can track the status of their outpass and show the digital approval at the gate.

---

## 🏗️ Phase 1: Data Integrity & Authorized Access

### **Problem: The "Isolated Module" Bug**
**Question:** Why can a student (e.g., `261FA00001`) access the Hostel Portal and view data even if their master record says `Hostel: no`?
**Answer:** Currently, the Hostel module operates independently of the main Student Master database. It only checks for internal `Allocation` records. If the main ERP says a student is not registered for a hostel, the module doesn't know it.

**Solution:**
*   **Integration:** Inject `StudentsService` into the `HostelModule`.
*   **Validation:** Every request to the Hostel Portal will first verify the `StudentMaster` table. If `Hostel === 'no'`, the system will block access.
*   **Example:** 
    *   *Request:* Student `261FA00001` clicks "My Hostel".
    *   *System Check:* `SELECT Hostel FROM student_master WHERE registerno = '261FA00001'`
    *   *Result:* If 'no', show "Registration Required" screen.

---

## 🛏️ Phase 2: Room Allocation Workflow

### **Problem: Inefficient Manual Allocation**
**Question:** Should the Chief Warden manually enter every student into a room?
**Answer:** No. That is prone to errors and slow. We are implementing a **Student-Driven Selection** model with **Administrative Oversight**.

**The "Lock & Approve" Solution:**
1.  **Discovery:** Student browses available rooms in a visual floor-plan.
2.  **The Lock:** Student selects a room and clicks "Lock Room".
3.  **The State:** The system creates a `Pending` allocation. The room is temporarily reserved.
4.  **The Approval:** The Chief Warden reviews the pending list and clicks "Approve".
5.  **Finalization:** The allocation becomes `Active`, and the room's `currentOccupancy` increases.

**Example:**
*   Student `261FA00001` locks **Room 102 (Block A)**.
*   Room 102 status shows as "Reserved" for others.
*   Admin clicks "Approve" after verifying fee payment.
*   Student is officially a resident of Room 102.

---

## 📜 Phase 3: Accountability & Audit Logs

### **Problem: Who did what?**
**Question:** How do we track who approved a leave, who edited a complaint, or who overrode a room allocation?
**Answer:** We will implement a centralized **Audit Log** system.

**Solution:**
*   Every state-changing action (Approve/Reject/Edit) will be recorded in an `AuditLog` table.
*   **Format:** `[Timestamp] | [Admin ID] | [Action] | [Target Student/Room] | [Details]`
*   **Example:** `2026-05-03 10:30 PM | warden_01 | APPROVED_LEAVE | student_261FA00001 | Reason: Medical`

---

## 🚀 Phase 4: Scalability & Hierarchy

### **Problem: Multi-Campus Support**
**Question:** What happens if the University opens a new campus or adds 5 more hostels?
**Answer:** The database schema must be hierarchical, not flat.

**The Scalable Hierarchy:**
`University` → `Campus` → `Hostel` → `Block` → `Room`

**Solution:**
*   Introduce a `Hostel` entity that belongs to a `Campus`.
*   Blocks belong to Hostels.
*   This allows a Chief Warden to filter and manage multiple buildings from a single dashboard.

---

## 🛠️ Current Implementation Status

| Feature | Status | Note |
| :--- | :--- | :--- |
| **Basic CRUD** | ✅ Done | Hostels, Blocks, Rooms, Complaints entities created. |
| **Auth Roles** | ✅ Done | Admin, Warden, and Student roles defined. |
| **Master Sync** | 🔄 Planned | Linking `StudentMaster` to Hostel queries. |
| **Room Selection** | 🔄 Planned | UI for students to pick and lock rooms. |
| **Approval Flow** | 🔄 Planned | Admin dashboard for pending allocations. |
| **Audit Logs** | 🔄 Planned | NestJS Interceptor for automated logging. |

---

## 💡 Key Decisions Summary
*   **Source of Truth:** All student data must come from `StudentMaster`.
*   **Process:** Student initiates (Locking), Admin finalizes (Approving).
*   **Finance:** Every approved allocation should trigger a transaction in the Finance Module.

---

## 🚀 Phase 4: Scalability & Hierarchy

### **Problem: Multi-Campus Support**
**Question:** What happens if the University opens a new campus or adds 5 more hostels?
**Answer:** The database schema must be hierarchical.

**The Scalable Hierarchy:**
`University` → `Campus` → `Hostel` → `Block` → `Room`

**Solution:**
*   Implement a **5-Level Hierarchy** to support multiple locations.
*   **Multi-Tenancy:** A Warden assigned to "Campus A" cannot see or manage allocations in "Campus B".

---

## 🛠️ System Configuration

### **Database Connection**
*   **Type:** PostgreSQL (Neon Serverless)
*   **URL:** `postgresql://neondb_owner:npg_ksvN8mJq3rTV@ep-lively-breeze-amj53vn6-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require`

### **Role Definitions**
*   **Student:** Can request/lock rooms, file complaints, and view dues.
*   **Warden:** Can approve/reject leaves, manage attendance, and report penalties.
*   **Chief Warden (Admin):** Can approve room allocations, manage infrastructure, and view global audit logs.

---

## 📝 Final Q&A Summary

**Q: Can a student "Finalize" their own room?**
**A:** No. They can only **Lock** (Request) it. An Admin must **Approve** it to make it official.

**Q: What happens if two students lock the same room?**
**A:** The system implements a "First-Lock" reservation. Once a room is requested, it is hidden or marked as "Pending" for others until the Admin makes a final decision.

**Q: Is the system ready for multiple campuses?**
**A:** The logic is being built to support it by adding `campusId` and `hostelId` to every building entity.

---

## 🛡️ Critical Edge Cases & Loopholes (Risk Assessment)

Before we write a single line of code, we must address these potential failures:

1.  **The "Double-Click" Race Condition:**
    *   *Risk:* Two students select the same bed simultaneously.
    *   *Solution:* We will use **PostgreSQL Row-Level Locking** (`SELECT ... FOR UPDATE`) during the "Locking" phase to ensure that only one transaction succeeds per room slot.

2.  **The "Ghost Resident" Problem:**
    *   *Risk:* A student is vacated from a room but their bill keeps running, or vice versa.
    *   *Solution:* We will implement **Database Triggers**. Any change in `Allocation` status (Active $\rightarrow$ Vacated) will automatically send a signal to the Finance module to stop the billing cycle.

3.  **Leave vs. Mess Reduction:**
    *   *Risk:* Students on approved leave for 10 days shouldn't be charged for mess meals.
    *   *Solution:* Link the **Outpass Module** to the **Mess Billing logic**. If a student has an approved leave $> 3$ days, the system calculates a "Mess Reduction" discount on the next bill.

4.  **Unauthorized Overrides:**
    *   *Risk:* A Warden might try to allocate a room to their relative without Chief Warden approval.
    *   *Solution:* All allocation endpoints will be protected by **Role-Based Guards**. Even if a Warden has access to the dashboard, only a `chief_warden` role can trigger the `APPROVE` function.

---

## 🌎 Phase 5: World-Class Enterprise Features (Benchmarking)

To match global standards (SAP, Oracle), we are adding these "Future-Proof" capabilities:

### **1. Room Asset Registry**
*   **Problem:** Rooms get damaged, and the university loses money on furniture.
*   **Solution:** Every `Room` will have an `assets` list (e.g., *2 Beds, 1 AC, 2 Study Tables*).
*   **Action:** During "Check-Out," the Warden must verify the assets before the student is officially cleared.

### **2. Parental Communication Gateway**
*   **Problem:** Parents need to be kept in the loop regarding their child's safety and finances.
*   **Solution:** Trigger automatic **SMS/Email alerts** for:
    *   Outpass/Leave Approval.
    *   Penalty/Fine generation.
    *   Unexcused absence from the hostel.

### **3. Formal "Clearance" Protocol**
*   **Problem:** Students vacating rooms without proper handover.
*   **Solution:** A 3-step Vacation process:
    1.  Student requests "Vacation".
    2.  Warden performs "Asset Audit".
    3.  Finance module confirms "No Dues" and clears the security deposit.

### **4. Warden-Verified Mobile Attendance**
*   **The Workflow:** Instead of complex hardware, Wardens use a **Mobile-Optimized Roll Call** interface. 
    *   They browse by Floor/Room.
    *   **Auto-Exclusion:** Students with an approved "Outpass" for that date are automatically marked as "On Leave."
    *   **One-Tap Logging:** Warden simply toggles "Present" or "Absent" for the remaining students.
*   **Data Storage:** 
    *   Stored in `hostel_attendance` table with `registerno`, `date`, `status`, and `wardenId`.
*   **Student Dashboard:**
    *   A **Monthly Attendance Calendar** view showing "Present" (Green), "Absent" (Red), and "On Leave" (Blue) status.
*   **Parent Notifications:**
    *   **Automatic Alert Trigger:** Any student marked as **Absent** (without an approved Outpass) triggers an immediate SMS/WhatsApp to the parent's mobile number stored in `StudentMaster`.
    *   **Message Example:** *"SHAMS Alert: Student [Name] was not present in the hostel during the night roll-call on [Date]."*

---

## 🌟 Final Polish: Quality of Life Features

To ensure the system is truly "complete" and user-friendly, we are adding these final touches:

1.  **"My Roommates" Portal:**
    *   Once allocated, students can view a tab showing their roommates' names, departments, and years. This builds a sense of community before they even move in.

2.  **Mess Feedback & Menu:**
    *   **Menu View:** Students can check the daily/weekly menu from their dashboard.
    *   **Rating System:** A simple 5-star rating for meals, giving the Chief Warden data on the quality of the mess service.

3.  **Warden Emergency Broadcast:**
    *   A "Panic Button" or "Broadcast" tool for Wardens to send an immediate push notification/alert to all students in their specific block (e.g., for Fire Drills or urgent announcements).

4.  **Asset Replacement Request:**
    *   Beyond repairs (Complaints), students can request extra assets (like an additional mattress or study lamp) which follows a mini-approval flow.

---

## 🎨 Phase 6: The "Command Center" Dashboard & Onboarding UX

To deliver a premium, high-efficiency experience, we are implementing a unique onboarding flow and a single-page dashboard layout.

### **1. Conditional Onboarding Workflow**
*   **The "New Student" State:** 
    *   When a student first joins or has no approved room, the Hostel dropdown contains **ONLY** one page: `Room Allocation`.
    *   All other features (Attendance, Complaints, Mess, etc.) are **hidden** to prevent data errors.
*   **The "Approved" State:**
    *   The moment the Chief Warden approves the room request, the system unlocks the full Dashboard. The `Room Allocation` page is replaced by the `Hostel Command Center`.

### **2. The "Command Center" Layout (Single-Page Dashboard)**
We will use a widget-based grid to avoid multiple page navigations:

| Position | Component | Details |
| :--- | :--- | :--- |
| **Top (Header)** | **Emergency Broadcast** | Warden alerts/announcements visible at a glance. |
| **Middle Left** | **Residence & Tracking** | Room details, Warden contact, and **Attendance** (Weekly/Monthly toggle). |
| **Middle Right** | **Roommates Desk** | Names, Departments, and Years of all residents in the same room. |
| **Bottom Left** | **Finance Ledger** | Breakdown of Hostel, Mess, and Laundry fees with a **"Pay Now"** button. |
| **Bottom Right** | **Smart Mess Widget** | *Before Meal:* Shows today's menu. *After Meal:* Automatically switches to a Feedback form. |

---

## 🧠 Phase 7: Intelligent Allocation & Advanced Security

To handle high-volume registration periods and ensure student safety, we are implementing an intelligent selection engine.

### **1. Identity-Aware Filtering**
*   **Strict Gender Isolation:** The system cross-references `StudentMaster.gender`.
    *   **Boys:** View only "Boys" category hostels.
    *   **Girls:** View only "Girls" category hostels.
*   **Academic Year Restrictions:** Specific Hostels or Blocks can be designated for certain years (e.g., *1st Year Only*). The system will filter options based on the student's current year.

### **2. The "Tactical Booking Lock" (BookMyShow Style)**
*   **Temporary Reservation:** When a student clicks a specific bed/room, it is marked as **"Locked"** in the database.
*   **5-Minute Countdown:** The student has exactly **5 minutes** to complete their confirmation.
*   **Auto-Release Logic:** If the 5-minute timer expires without a "Confirm Request" action, the lock is automatically released, making the room available for other students.

### **3. "Verified Visitor" Digital ID Protocol**
*   **Pre-Registration:** Students must pre-register frequent visitors (Parents/Siblings) by uploading their **ID Document** and a **Recent Photo** to the portal.
*   **Digital Pass Generation:** The system generates a **Digital Visitor ID Card** (similar to an Aadhaar card layout) featuring the visitor's photo and the student's register number.
*   **Gate Verification:** The security guard checks this digital pass on the visitor's phone. Because the photo was uploaded/verified by the student, the guard can instantly confirm the visitor's identity without manual logbooks.

---

## 🔄 System Transition Roadmap (How we change it)

### **Step 1: The Infrastructure Layer (Week 0)**
*   **Action:** Run a migration to add `campusId` and `hostelId` to all entities.
*   **Action:** Run the **Seeding Script** to populate the university's physical structure (Grand Residency, etc.).

### **Step 2: The "Golden Thread" Integration**
*   **Action:** Update `HostelModule` to import `StudentsModule` and `FinanceModule`.
*   **Action:** Implement the **Eligibility Guard** (Checking `StudentMaster.Hostel === 'yes'`).

### **Step 3: The Workflows**
*   **Action:** Build the `POST /request-room` and `POST /approve-allocation` APIs.
*   **Action:** Implement the **Audit Log Interceptor** to record these actions.

### **Step 4: The Visual Experience**
*   **Action:** Build the **Visual Room Picker** (Grid layout).
*   **Action:** Add the **"Pay Now"** button to the Student Dashboard with a direct link to the Finance checkout.

---

## ✅ Final Checklist Before Coding
- [ ] Database Connection: **Neon PostgreSQL** (Verified)
- [ ] Role Hierarchy: **Student < Warden < Chief Warden** (Verified)
- [ ] Integration Points: **StudentMaster, Finance Ledger, HR EmployeeID** (Mapped)
- [ ] Safety: **Transactions & Guards** (Planned)
