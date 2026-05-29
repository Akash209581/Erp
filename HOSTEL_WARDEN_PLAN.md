# SHAMS ERP - Hostel Warden Operations Hub

This document outlines the specialized tools and workflows designed for the **Hostel Warden** and **Chief Warden** roles. While the student dashboard is a "Command Center," the Warden interface is an **"Operations Hub"** focused on management, safety, and accountability.

---

## 🏗️ 1. The Warden Command Center (Dashboard Layout)

The Warden dashboard is a high-visibility interface that prioritizes urgent tasks and real-time student status.

| Widget | Purpose |
| :--- | :--- |
| **Pending Approvals** | A scrolling list of Outpass and Leave requests needing immediate action. |
| **"Who's Still Out?"** | A real-time list of students who haven't checked back in past the curfew. |
| **Open Complaints** | A status board for room repairs and maintenance issues in their assigned block. |
| **Quick Broadcast** | A text area to send immediate alerts to all students (e.g., "Meeting in 10 mins"). |

---

## 📋 2. Daily Operations & Attendance

### **Visual Roll-Call (Floor-Wise)**
*   **Interface:** A digital map of the hostel. Tapping **Floor 1** → **Room 101** shows the students' photos.
*   **Smart Attendance:** 
    *   Students with approved outpasses are **pre-marked** as "On Leave."
    *   Warden only taps "Absent" for missing students.
    *   **Timestamped Logs:** Every roll-call is saved with the Warden's ID for audit.

### **Leave & Outpass Desk**
*   **Verification View:** Before approving a leave, the Warden can see:
    1.  Student's current Attendance %.
    2.  Parent/Guardian approval status (if 3-way sync is active).
    3.  Previous leave history.
*   **Action:** One-click Approve/Reject with a text box for "Reason for Rejection."

---

## 🛠️ 3. Infrastructure & Asset Management

### **Maintenance Queue**
*   **Tracking:** Complaints are sorted by urgency (e.g., "Electricity Outage" = High, "Torn Mattress" = Low).
*   **Closure:** Warden can upload a photo of the completed repair to "Resolve" the ticket.

### **The "Check-Out" Audit**
*   When a student vacates a room, the Warden is prompted to perform an **Asset Audit**.
*   **Digital Checklist:** "Bed? Yes. Fan? Yes. Table? Damaged."
*   **Penalty Trigger:** If the Warden marks an item as damaged, the system automatically calculates the fine and sends it to the **Finance Module**.

---

## 🔐 4. Safety & Security Protocols

### **Parental Alert Trigger**
*   If a student is marked "Absent" during the 10:00 PM roll-call, the Warden's dashboard shows a **"Trigger Parent Alert"** button.
*   **Automated SMS:** Sends the pre-configured alert to the parent immediately.

### **Emergency Broadcast**
*   Warden can select: **[All Students]** or **[Block A Only]**.
*   Sends a push notification and SMS to all residents instantly.

### **Verified Visitor Approval**
*   When a visitor arrives at the gate with their **Digital ID**, the Warden receives a notification to "Acknowledge" the visit if it exceeds the standard visiting hours.

---

## 📈 5. Warden Search & Profiles

*   **Quick Search:** Search by Name, Register No, or Room No.
*   **The "Student Snapshot":**
    *   Photo & Department.
    *   Parent Contact (Direct Call button).
    *   **Medical Info:** Critical allergies or health conditions pulled from StudentMaster.

---

---

## 🔄 6. The Real-Time Interaction Layer (Warden ↔ Student)

The Warden's actions are directly connected to the Student's "Command Center" dashboard. There is no delay between action and visibility.

| Warden Action | Student Impact |
| :--- | :--- |
| **Mark Attendance** | Student's monthly calendar updates with a Green/Red/Blue dot immediately. |
| **Send Broadcast** | A banner appears at the very top of the Student Dashboard instantly. |
| **Update Complaint** | Status changes from "Open" to "In-Progress" or "Resolved" in the student's view. |
| **Approve Leave** | Student's outpass status turns "Approved," and they can now exit the gate. |
| **Log Penalty** | A new entry appears in the student's Finance Widget with the "Pay Now" button. |

---

## 💡 Key Operations Logic
1.  **Assigned Jurisdiction:** A Warden can only see and manage the Blocks/Hostels assigned to them in the **HR Module**.
2.  **Chief Warden Oversight:** The Chief Warden has a "Global View" and can override any Warden's decision or view the **Audit Logs** of all Warden actions.
3.  **Finance Sync:** Wardens do not handle cash. All penalties or fees they log are handled by the Finance Module's ledger.
