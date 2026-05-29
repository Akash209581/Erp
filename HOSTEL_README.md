# SHAMS ERP - Advanced Hostel Management Module (v2.0)

Welcome to the modernized **Hostel Management Module** for the SHAMS ERP. This version represents a complete architectural overhaul, transitioning from manual tracking to a high-fidelity, student-driven, and audit-ready ecosystem.

---

## 🏰 Module Philosophy
The SHAMS Hostel Module is built on the principle of **"Automated Accountability."** By integrating directly with the `StudentMaster`, `Finance`, and `HR` modules, it eliminates data silos and ensures that every room change, every leave, and every penalty is tracked, authorized, and audited.

---

## 🏗️ Core Architectural Pillars

### 2. Room-Level Allocation Precision
The system operates strictly at the **Room-Level** (no bed-level tracking). This ensures maximum simplicity and performance while maintaining high integrity. Each room tracks its own `capacity` and `currentOccupancy`.

### 3. Concurrency & Transaction Safety
To prevent multiple students from selecting the same room simultaneously, SHAMS implements **Transactional Locking**.
- **Atomic Operations**: All room requests are wrapped in database transactions.
- **Race Condition Protection**: If two students hit "Lock" at the same microsecond, the system ensures only one succeeds, while the other receives an "Already Reserved" notification.

### 4. ⏱️ 5-Minute Lock Expiry Strategy
To prevent "Ghost Blocking" (where a student locks a room but never confirms), the system enforces a strict expiry:
- **Automatic Release**: Every locked room is valid for **5 minutes** only.
- **Fair Access**: If the allocation is not approved or confirmed within the window, the room is automatically released back into the pool.

### 5. 💰 Payment Integration Protocol
The Hostel module **does NOT process payments**.
- **Dues Visibility**: It calculates and displays the required fees.
- **Finance Redirection**: Students are redirected to the **Finance Module** to complete the transaction. The Hostel state only transitions to "Active" once the Finance ledger confirms the payment.

### 3. Integrated Eligibility Guard
- **Strict Compliance**: The `HostelEligibilityGuard` verifies student records in real-time. Only students marked as "Hostel Eligible" in the `StudentMaster` can access the portal.
- **Finance Sync**: Allocations trigger automatic ledger entries in the Finance Module.

---

## 👮 Operational Hubs (Role-Based)

### 🏰 Chief Warden: The Control Tower
*   **Global Executive View**: Real-time HUD for occupancy analytics, system health, and financial dues.
*   **Global Emergency Command**: Push university-wide emergency alerts directly to all student dashboards.
*   **Asset Master Master**: Centralized registry for room resources (ACs, furniture) and infrastructure management.
*   **Universal Audit Log**: A searchable, immutable history of all administrative actions for 100% accountability.

### 👮 Warden: The Operations Hub
*   **Floor-Wise Visual Roll-Call**: A digital map of the hostel for daily attendance tracking.
*   **Leave & Outpass Desk**: Digital approval queue for student requests with parent-alert triggers.
*   **Verified Visitor Protocol**: Secure gate management with digital IDs and verification logs.

### 🎓 Student: The Command Center
*   **Intelligent Onboarding**: State-aware UI that guides students from room selection to final checkout.
*   **Real-time Broadcast Banner**: Instant visibility of block-level and university-wide announcements.
*   **Digital Leave Desk**: Apply for outpasses and track approval status in real-time.

---

## 🛠️ Technology Stack
- **Framework**: NestJS (Node.js) with Modular Architecture.
- **Database**: PostgreSQL with **TypeORM** for strict schema integrity.
- **UI/UX**: React + Tailwind CSS + Lucide Icons (Matte-Slate Design System).
- **Security**: Role-Based Access Control (RBAC) + Custom NestJS Guards.

---

## 📂 Project Structure
```text
Backend/src/hostel/
├── admin/          # Chief Warden "Control Tower" logic
├── warden/         # Warden "Operations Hub" features
├── student/        # Student "Command Center" API
├── entities/       # Relational Schemas (Campus, Hostel, Room, Allocation, etc.)
└── guards/         # Security & Eligibility verification logic

Frontend/src/pages/hostel/
├── admin/          # Executive Analytics & Infrastructure UI
├── warden/         # Attendance, Visitors, & Leave Management
└── student/        # Room Picker & Personal Dashboard
```

---

## 🚀 Recent Implementations
- ✅ **Hierarchical Data Migration**: Transitioned to Campus-aware infrastructure.
- ✅ **Room Picker Component**: High-fidelity visual selection tool.
- ✅ **Real-time Broadcast System**: Instant Warden-to-Student communication.
- ✅ **Digital Audit Trail**: Complete tracking of all allocation changes.
- ✅ **Automated Parental Alerts**: Simulated SMS triggers for attendance anomalies.

---

*“Modernizing campus life through intelligent automation.”*
261FA00002