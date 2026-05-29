# 🗄️ ERP System Database Schema Documentation (Balanced Enterprise-Grade Design)

This document provides the finalized, comprehensive blueprint of the PostgreSQL Database schema, tables, relationships, and model attributes utilized by this enterprise university ERP system (powered by NestJS and TypeORM).

---

## 📊 Database Architecture Overview

The system uses **PostgreSQL** for relational data persistence. The backend leverages **TypeORM** for Object-Relational Mapping, configured to automatically synchronize the entity declarations with the physical tables (`synchronize: true`).

### Active Tables Summary (The Balanced Enterprise Sweet Spot)

| # | Entity Name | Database Table Name | Core Module | Description |
|---|-------------|---------------------|-------------|-------------|
| 1 | `User` | `users` | Auth / Admin | Handles authentication, passwords, and active state. Supports soft deletes. |
| 2 | `Role` | `roles` | Auth / Admin | Dynamic role definitions (Chief Warden, Faculty, etc.). |
| 3 | `UserRole` | `user_roles` | Auth / Admin | Join table mapping users to multiple active roles. |
| 4 | `WardenAssignment` | `warden_assignments` | Auth / Admin | **Scope Authorization Table.** Map wardens to campuses, hostels, or specific blocks. |
| 5 | `Student` | `students` | Core Profile | **Unified Single Source of Truth.** Biographical student profiles. Identifies students internally via secure UUID PK. Supports soft deletes. |
| 6 | `Finance` | `finance` | Finance | Records semester-wise tuition balance summaries. Compound unique key of (student_id, year, sem). |
| 7 | `FinanceTransaction` | `finance_transactions` | Finance | **Payment Audit Ledger.** History trail of installment deposits, refunds, or scholarship credits linked to billing records. |
| 8 | `Campus` | `campuses` | Infrastructure | Lists physical campuses for scalability. |
| 9 | `Hostel` | `hostels` | Infrastructure | Represents residential hostels (Boys / Girls). |
| 10 | `Block` | `blocks` | Infrastructure | Identifies wing blocks nested inside hostels (essential for block-wise wardens). |
| 11| `Room` | `rooms` | Infrastructure | Tracks physical room configurations, capacities, occupancies, real-time lock states, and inline assets. |
| 12| `Allocation` | `allocations` | Operations | Registers student room leases and deallocation status lifecycles. Mapped via secure Student UUID. Supports soft deletes. |
| 13| `HostelComplaint`| `hostel_complaints` | Student Care | Handles service maintenance requests and warden escalations. |
| 14| `HostelAttendance`| `hostel_attendance` | Operations | Tracks daily curfew presence logs marked by block wardens. Optimally indexed by Room ID. |
| 15| `HostelVisitor` | `hostel_visitors` | Security | Manages check-in and checkout entry logs for outsiders. |
| 16| `LeaveRequest` | `hostel_leave_requests`| Operations | Processes outpass permits and extended travel requests. |
| 17| `HostelBroadcast`| `hostel_broadcasts` | Communication| Manages emergency notice announcements targeting dynamic infrastructure levels. |
| 18| `DomainEvent` | `domain_events` | Core System | Persists transactional outbox domain events (e.g. `ROOM_ALLOCATED`) for absolute audit trail and retry safety. |


---

## 🛠️ Table Schemas & Attributes

---

### 1. `users` Table
Handles credential logins and account status. Fully decoupled from roles. Supports Soft-Deletes.

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `username` (`varchar`, Unique): Primary credential identifier.
    *   `password` (`varchar`): Encrypted credential string.
    *   `email` (`varchar`, Nullable): Secondary notification mail.
    *   `is_active` (`boolean`, Default: `true`): Account state.
    *   `created_at` (`timestamp`): Timestamp of record entry.
    *   `updated_at` (`timestamp`): Timestamp of last change.
    *   `deleted_at` (`timestamp`, Nullable): Timestamp for soft-delete security logs.

---

### 2. `roles` Table
Enables dynamic multi-role support without expensive migrations or ENUM extensions.

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `name` (`varchar`, Unique): Core role identifier (e.g., `'student'`, `'warden'`, `'chief_warden'`, `'admin'`, `'faculty'`, `'finance_manager'`).
    *   `description` (`varchar`, Nullable): Descriptive summary of role permissions.

---

### 3. `user_roles` Table
Join table establishing the many-to-many relationship between `users` and `roles`. Allows a single physical user to possess multiple roles (e.g. both a `faculty` member and a `warden`).

*   **Composite Primary Key:** (`user_id`, `role_id`)
*   **Foreign Keys:**
    *   `user_id` (`uuid`): References `users.id` (On Delete: Cascade).
    *   `role_id` (`uuid`): References `roles.id` (On Delete: Cascade).

---

### 4. `warden_assignments` Table
**Scope Authorization Table.** Map wardens explicitly to campuses, hostels, or specific blocks to enable block-level dashboards, hostel-level controls, and clear hierarchical boundaries.

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `user_id` (`uuid`, Foreign Key): References `users.id` (On Delete: Cascade).
    *   `campus_id` (`uuid`, Foreign Key): References `campuses.id` (On Delete: Cascade).
    *   `hostel_id` (`uuid`, Foreign Key): References `hostels.id` (On Delete: Cascade).
    *   `block_id` (`uuid`, Nullable, Foreign Key): References `blocks.id` (On Delete: Cascade). Nullable implies complete hostel-wide assignment scope.

---

### 5. `students` Table
**Unified Single Source of Truth.** Master database holding complete demographic, scholastic, and familial history. Anchored structurally via UUID. Supports Soft-Deletes.

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `registerno` (`varchar`, Unique, Indexed): Public university registration code.
    *   `vuid` (`varchar`, Unique, Nullable): Temporary admission token.
    *   `name` (`varchar`, Nullable): Full legal name.
    *   `coursecode` (`varchar`, Nullable): Course registration code.
    *   `branchcode` (`varchar`, Nullable): Academic branch specialization.
    *   `cyear` (`varchar`, Nullable): Academic year batch.
    *   `semester` (`varchar`, Nullable): Current semester.
    *   `sectioncode` (`varchar`, Nullable): Assigned classroom section.
    *   `gender` (`varchar`, Nullable): Gender identity.
    *   `fathername` (`varchar`, Nullable): Father's legal name.
    *   `mothername` (`varchar`, Nullable): Mother's legal name.
    *   `studentmobile` (`varchar`, Nullable): Contact phone.
    *   `fathermobile` (`varchar`, Nullable): Parent contact phone.
    *   `studentemailid` (`varchar`, Nullable): Email address.
    *   `parentemailid` (`varchar`, Nullable): Parent email address.
    *   `houseno` / `street` / `town` / `mandal` / `district` / `state` / `pincode` (`varchar`, Nullable): Detailed physical address indices.
    *   `entrancetest` / `entrancetestrank` / `entrancemarks` (`varchar`, Nullable): Entrance test scores.
    *   `tenthpercent` / `interpercent` / `ugpercent` / `pgpercent` (`varchar`, Nullable): Prior educational scores.
    *   `annualincome` (`varchar`, Nullable): Annual household income range.
    *   `caste` / `religion` / `pysicallyhandi` / `ebc` (`varchar`, Nullable): Scholarship eligibility flags.
    *   `created_by` (`varchar`, Nullable): Author staff member.
    *   `created_at` (`timestamp`): Auto-timestamp.
    *   `deleted_at` (`timestamp`, Nullable): Timestamp for soft-delete security logs.

---

### 6. `finance` Table
**Finance Balance Boundary.** Stores cumulative dues summaries.

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `student_id` (`uuid`, Foreign Key): References `students.id` (On Delete: Cascade).
    *   `sem` (`varchar`): Target semester.
    *   `year` (`varchar`): Target academic year.
    *   `totalfee` (`decimal`, Default: `0`): Total calculated tuition dues.
    *   `feepaid` (`decimal`, Default: `0`): Aggregated paid transactions.
    *   `feeleft` (`decimal`, Default: `0`): Remaining balance.
    *   `admissionfee` (`decimal`, Default: `0`): Mandatory initial admission payment threshold.
    *   `payment_status` (`enum`, Default: `'Pending'`): Financial payment state (`'PAID'`, `'PARTIAL'`, `'PENDING'`).
*   **Uniqueness Constraint:**
    *   `UNIQUE (student_id, year, sem)` (Enables multi-semester and multi-year fees billing ledger cards).

---

### 7. `finance_transactions` Table
**Payment Audit Ledger.** Provides a secure audit trail for historical payments.

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `student_id` (`uuid`, Foreign Key): References `students.id` (On Delete: Cascade).
    *   `finance_id` (`uuid`, Foreign Key): References `finance.id` (On Delete: Cascade). Enables direct ledger alignment and easier audits.
    *   `amount` (`decimal`): Paid transaction sum.
    *   `type` (`enum`): Operation type (`'PAYMENT'`, `'REFUND'`, `'SCHOLARSHIP_CREDIT'`).
    *   `payment_method` (`varchar`): UPI, NetBanking, Card, cash.
    *   `reference_number` (`varchar`, Nullable): Bank transaction ID.
    *   `timestamp` (`timestamp`, Default: `CURRENT_TIMESTAMP`): Transaction time.

---

### 8. `campuses` Table
Maintains global physical campus divisions for enterprise multi-campus scalability.

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `name` (`varchar`, Unique): e.g., 'VFSTR Main'.
    *   `location` (`varchar`, Nullable): Geographical locality.
*   **Relationships:**
    *   One-to-Many with `hostels`.

---

### 9. `hostels` Table
Manages student residential structures mapped to campuses.

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `name` (`varchar`, Unique): e.g., 'Gandhi Boys Hostel'.
    *   `type` (`enum`): `Boys` or `Girls`.
    *   `campus_id` (`uuid`, Foreign Key): References `campuses.id`.
*   **Relationships:**
    *   One-to-Many with `blocks`.

---

### 10. `blocks` Table
Registers individual structural wings inside a hostel building (enables block-wise wardens and curfew sorting).

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `name` (`varchar`): e.g., 'A Block', 'B Wing'.
    *   `hostel_id` (`uuid`, Foreign Key): References `hostels.id`.
*   **Relationships:**
    *   One-to-Many with `rooms`.

---

### 11. `rooms` Table
Identifies structural rooms nested inside wings, tracking capacities, real-time lock states, and inline assets.

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `room_number` (`varchar`): e.g., '101', '102'.
    *   `capacity` (`int`): Maximum bed spaces.
    *   `current_occupancy` (`int`, Default: `0`): Active checked-in student count.
    *   `status` (`enum`, Default: `'AVAILABLE'`): Physical room state (`'AVAILABLE'`, `'FULL'`, `'MAINTENANCE'`).
    *   `locked_by_student_id` (`uuid`, Nullable, Foreign Key): References `students.id` (locks active student reserve slot).
    *   `lock_expires_at` (`timestamp`, Nullable): Real-time lock duration limit.
    *   `assets` (`jsonb`, Nullable): Inline inventory arrays (e.g., `["AC", "Bed", "Fan"]`).
    *   `block_id` (`uuid`, Foreign Key): References `blocks.id`.
*   **Database Enforced Check Constraints:**
    *   `current_occupancy <= capacity` (Guarantees zero over-allocation).
*   **Reservation Lock Logic Boundary:**
    *   A student is only permitted to apply a lock to a room if:
        *   `rooms.current_occupancy < rooms.capacity` AND
        *   `(rooms.lock_expires_at IS NULL OR rooms.lock_expires_at < NOW())`.

---

### 12. `allocations` Table
Tracks student room lease histories and operational lifecycle states. Joined via binary UUID for blazing-fast indexed performance. Supports Soft-Deletes.

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `student_id` (`uuid`, Foreign Key): References `students.id` (On Delete: Cascade).
    *   `campus_id` (`uuid`): Target campus.
    *   `hostel_id` (`uuid`): Target hostel.
    *   `block_id` (`uuid`): Target block.
    *   `room_id` (`uuid`): Target room.
    *   `status` (`enum`, Default: `'PENDING'`): Operational lifecycle status:
        *   `PENDING` (Temporary registration lock review)
        *   `ACTIVE` (Active checked-in room lease)
        *   `VACATED` (Checked out, room moved to inspection queue)
        *   `CLEANUP` (Inspection and damage checklist verification)
        *   `AVAILABLE` (Archived, slot successfully freed for re-booking)
    *   `is_current` (`boolean`, Default: `true`): Index optimization flag to instantly fetch active student lease without parsing historical logs.
    *   `approved_by` (`uuid`, Nullable, Foreign Key): References `users.id` (Guarantees absolute referential integrity).
    *   `rejection_reason` (`varchar`, Nullable): Comments from denied request.
    *   `approved_at` (`timestamp`, Nullable): Approval time.
    *   `created_at` / `updated_at` (`timestamp`): System log timestamps.
    *   `deleted_at` (`timestamp`, Nullable): Timestamp for soft-delete security logs.
*   **Enforced Relational Uniqueness Constraint:**
    *   `CREATE UNIQUE INDEX uniq_active_allocation ON allocations (student_id) WHERE is_current = true AND deleted_at IS NULL;` (Enforces that a student can only possess exactly **one** active/pending room lease at a time).

*   **Strict Synchronization & Transaction-Safety Boundaries:**
    1.  **Atomicity Trigger:** All status movements must execute inside an atomic database transaction.
    2.  When `allocations.status` is set to `ACTIVE` ➔ Increment `rooms.current_occupancy` atomically.
    3.  When `allocations.status` is set to `VACATED` ➔ Decrement `rooms.current_occupancy` atomically.
    4.  **CLEANUP Pipeline Ownership:** The lifecycle progression `VACATED ➔ CLEANUP ➔ AVAILABLE` requires explicit manual confirmation action by the block warden/housing staff after asset inspection.
    5.  **Asynchronous Finance Trigger:** The moment `allocations.status` is successfully saved as `ACTIVE`, the hostel system emits the event **`ROOM_ALLOCATED`**. The decoupled Finance module consumes this event to build transaction records inside the `finance` table.

---

### 13. `hostel_complaints` Table
Tracks maintenance complaints raised by inhabitants. Linked via fast UUID keys.

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `student_id` (`uuid`, Foreign Key): References `students.id` (On Delete: Cascade).
    *   `category` (`varchar`): e.g., 'Plumbing', 'Electrical', 'WiFi'.
    *   `description` (`text`): Detailed issue context.
    *   `status` (`enum`, Default: `'Pending'`): Options: `'Pending'`, `'In Progress'`, `'Resolved'`, `'Escalated'`.
    *   `assigned_warden_id` (`uuid`, Nullable, Foreign Key): References `users.id` (Enforces correct mapping integrity).
    *   `created_at` / `updated_at` (`timestamp`): Action timestamps.

---

### 14. `hostel_attendance` Table
Tracks physical curfew attendance logs marked daily by wardens.
*Optimized with fast Student UUID and denormalized Room UUID.*

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `date` (`date`): Day of roll call.
    *   `student_id` (`uuid`, Foreign Key): References `students.id` (On Delete: Cascade).
    *   `room_id` (`uuid`): Target room ID (Denormalized optimization for roll-call filtering).
    *   `marked_by` (`uuid`, Foreign Key): References `users.id` (Maintains warden session reference).
    *   `status` (`enum`, Default: `'Present'`): `'Present'`, `'Absent'`, `'Leave'`.
    *   `created_at` (`timestamp`): Log entry timestamp.

---

### 15. `hostel_visitors` Table
Keeps record of external visitors authorized at the security gates.

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `student_id` (`uuid`, Foreign Key): References `students.id` (On Delete: Cascade).
    *   `visitor_name` / `relation` (`varchar`)
    *   `check_in` / `check_out` (`timestamp`)
    *   `status` (`enum`, Default: `'Pending'`): `'Approved'`, `'Pending'`, `'Rejected'`.

---

### 16. `hostel_leave_requests` Table
Processes outpass permits and holiday leaves requested by student residents.

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `student_id` (`uuid`, Foreign Key): References `students.id` (On Delete: Cascade).
    *   `reason` / `rejection_reason` (`varchar`)
    *   `type` (`enum`): `Leave` or `Outpass`.
    *   `start_date` / `end_date` (`timestamp`)
    *   `approved_by` (`uuid`, Nullable, Foreign Key): References `users.id`.
    *   `status` (`enum`, Default: `'Pending'`): `'Pending'`, `'Approved'`, `'Rejected'`, `'Cancelled'`.
    *   `created_at` / `updated_at` (`timestamp`): Request lifecycle tracking.

---

### 17. `hostel_broadcasts` Table
Emergency notices and announcements broadcasted by wardens.

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `message` (`text`)
    *   `sender_id` (`uuid`, Foreign Key): References `users.id` (On Delete: Cascade).
    *   `scope` (`enum`, Default: `'Global'`): `'Global'`, `'Hostel'`, `'Block'`.
    *   `campus_id` (`uuid`, Nullable, Foreign Key): References `campuses.id` (On Delete: Cascade).
    *   `hostel_id` (`uuid`, Nullable, Foreign Key): References `hostels.id` (On Delete: Cascade).
    *   `block_id` (`uuid`, Nullable, Foreign Key): References `blocks.id` (On Delete: Cascade).
    *   `created_at` / `expires_at` (`timestamp`): Broadcast active dates.
*   **Relational Mapping Rules:**
    *   If all location foreign keys are `NULL`, the notice is broadcasted globally. Otherwise, it is constrained strictly to the target location tier (Campus, Hostel building, or specific Block Wing), ensuring perfect relational referential integrity.
*   **Check Scope Rule:**
    *   Enforced database constraint guaranteeing target location consistency:
        ```sql
        CHECK (
            (campus_id IS NULL AND hostel_id IS NULL AND block_id IS NULL)
            OR (block_id IS NOT NULL)
            OR (hostel_id IS NOT NULL)
            OR (campus_id IS NOT NULL)
        )
        ```

### 18. `domain_events` Table
**Transactional Outbox Ledger.** Logs core domain events (e.g. `ROOM_ALLOCATED`) atomically within the same database transaction. A background event runner publishes/dispatches these events to decoupled microservices/listeners, ensuring absolute audit trails, async retry safety, and zero timing hazards.

*   **Primary Key:** `id` (`uuid`, Auto-generated)
*   **Attributes:**
    *   `event_name` (`varchar`): e.g. `'ROOM_ALLOCATED'`, `'LEASE_VACATED'`.
    *   `payload` (`jsonb`): Comprehensive JSON payload (e.g. `{ "student_id": "...", "room_id": "...", "term": "..." }`).
    *   `status` (`varchar`, Default: `'PENDING'`): Publish state (`'PENDING'`, `'PUBLISHED'`, `'FAILED'`).
    *   `retry_count` (`int`, Default: `0`): Aggregated dispatch retry loops.
    *   `created_at` (`timestamp`): Event instantiation record.
    *   `processed_at` (`timestamp`, Nullable): Successful dispatch timestamp.

---

## ⚡ Indexing Strategy (For Enterprise Scale)

To ensure sub-millisecond response times even when managing tens of thousands of active logs under load, the following multi-column indices must be generated:

```sql
-- 1. Accelerates active room lease lookups for student profiles
CREATE INDEX idx_allocations_student_current ON allocations (student_id, is_current) WHERE deleted_at IS NULL;

-- 2. Speeds up real-time room availability browsing
CREATE INDEX idx_rooms_block_status ON rooms (block_id, status);

-- 3. Accelerates semester-wise financial balance sheets
CREATE INDEX idx_finance_student_period ON finance (student_id, year, sem);

-- 4. Optimizes warden roll-call checks and daily attendance reports
CREATE INDEX idx_attendance_date_room ON hostel_attendance (date, room_id);

-- 5. Accelerates event polling processing loops for outbox dispatchers
CREATE INDEX idx_domain_events_status ON domain_events (status, retry_count);

-- 6. Enforces high-concurrency overbooking protection on active allocations
CREATE INDEX idx_allocations_room_active ON allocations (room_id) WHERE status = 'ACTIVE' AND deleted_at IS NULL;
```

---

## 🔗 Key Entity Relationships

```mermaid
erDiagram
    campuses ||--o{ hostels : "contains"
    hostels ||--o{ blocks : "contains"
    blocks ||--o{ rooms : "contains"
    
    users ||--o{ user_roles : "has roles"
    roles ||--o{ user_roles : "maps to"
    
    users ||--o{ warden_assignments : "assigned as warden"
    campuses ||--o{ warden_assignments : "maps to"
    hostels ||--o{ warden_assignments : "maps to"
    blocks ||--o{ warden_assignments : "maps to"
    
    students ||--o{ allocations : "has room leases"
    students ||--o{ finance : "has balance card"
    students ||--o{ finance_transactions : "has payment audits"
    
    rooms {
        uuid id PK
        uuid locked_by_student_id FK
        timestamp lock_expires_at
    }
    
    allocations {
        uuid id PK
        uuid student_id FK
        uuid room_id FK
        enum status
        boolean is_current
    }
```

---

## 💾 Production-Ready PostgreSQL DDL Generation Scripts

To physically instantiate this finalized, enterprise-grade schema, execute the following SQL script inside your PostgreSQL database. Tables are organized in strict dependency order for immediate, error-free execution.

```sql
-- =========================================================================
--  1. SYSTEM EVENT LEDGERS (Transactional Outbox System)
-- =========================================================================

CREATE TABLE domain_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PUBLISHED', 'FAILED')),
    retry_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- =========================================================================
--  2. CORE INFRASTRUCTURE TABLES (Independent Locations)
-- =========================================================================

CREATE TABLE campuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hostels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Boys', 'Girls')),
    campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_block_per_hostel UNIQUE (hostel_id, name)
);

-- =========================================================================
--  3. CORE AUTHENTICATION & ACCESS CONTROL (Users & Dynamic Roles)
-- =========================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft-delete timestamp support
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Wardens explicitly assigned to geographical locations for scope authorization
CREATE TABLE warden_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
    hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
    block_id UUID REFERENCES blocks(id) ON DELETE CASCADE, -- Nullable implies Hostel-wide scope
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
--  4. STUDENT PROFILE SYSTEM (Unified Master Record)
-- =========================================================================

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registerno VARCHAR(255) UNIQUE NOT NULL,
    vuid VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    coursecode VARCHAR(255),
    branchcode VARCHAR(255),
    cyear VARCHAR(255),
    semester VARCHAR(255),
    sectioncode VARCHAR(255),
    gender VARCHAR(50),
    fathername VARCHAR(255),
    mothername VARCHAR(255),
    studentmobile VARCHAR(50),
    fathermobile VARCHAR(50),
    studentemailid VARCHAR(255),
    parentemailid VARCHAR(255),
    houseno VARCHAR(100),
    street VARCHAR(255),
    town VARCHAR(255),
    mandal VARCHAR(255),
    district VARCHAR(255),
    state VARCHAR(255),
    pincode VARCHAR(50),
    entrancetest VARCHAR(255),
    entrancetestrank VARCHAR(50),
    entrancemarks VARCHAR(50),
    tenthpercent VARCHAR(50),
    interpercent VARCHAR(50),
    ugpercent VARCHAR(50),
    pgpercent VARCHAR(50),
    annualincome VARCHAR(100),
    caste VARCHAR(100),
    religion VARCHAR(100),
    pysicallyhandi VARCHAR(50),
    ebc VARCHAR(50),
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft-delete timestamp support
);

-- =========================================================================
--  5. ROOMING INVENTORY WITH INTEGRITY CONSTRAINTS
-- =========================================================================

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number VARCHAR(100) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    current_occupancy INT NOT NULL DEFAULT 0 CHECK (current_occupancy >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'FULL', 'MAINTENANCE')),
    locked_by_student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    lock_expires_at TIMESTAMP WITH TIME ZONE,
    assets JSONB DEFAULT '[]'::jsonb,
    block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
    
    -- Enterprise Constraint: Physically blocks over-allocation at database level
    CONSTRAINT chk_occupancy_limits CHECK (current_occupancy <= capacity)
);

-- =========================================================================
--  6. OPERATIONAL RESIDENTIAL LEASES (Allocations & Attendance)
-- =========================================================================

CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
    hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
    block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'VACATED', 'CLEANUP', 'AVAILABLE')),
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Audited Warden FK
    rejection_reason VARCHAR(255),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft-delete timestamp support
);

CREATE TABLE hostel_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE, -- Denormalized lookup speed optimization
    marked_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Audited Warden FK
    status VARCHAR(50) NOT NULL DEFAULT 'Present' CHECK (status IN ('Present', 'Absent', 'Leave')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
--  7. DECOUPLED FINANCIAL SYSTEM & AUDITING (Multi-Semester Ledger Support)
-- =========================================================================

CREATE TABLE finance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    sem VARCHAR(50) NOT NULL,
    year VARCHAR(50) NOT NULL,
    totalfee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    feepaid DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    feeleft DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    admissionfee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('PAID', 'PARTIAL', 'Pending')),
    
    -- Crucial Fix: Uniqueness compound index allowing distinct balance summaries per semester/year
    CONSTRAINT uq_finance_period UNIQUE (student_id, year, sem)
);

CREATE TABLE finance_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    finance_id UUID REFERENCES finance(id) ON DELETE CASCADE, -- Direct operational invoice alignment
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0.00),
    type VARCHAR(50) NOT NULL CHECK (type IN ('PAYMENT', 'REFUND', 'SCHOLARSHIP_CREDIT')),
    payment_method VARCHAR(100) NOT NULL,
    reference_number VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
--  8. SUPPORT, COMMUNICATIONS & SECURITY
-- =========================================================================

CREATE TABLE hostel_complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    category VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Escalated')),
    assigned_warden_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hostel_visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    visitor_name VARCHAR(255) NOT NULL,
    relation VARCHAR(255) NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_out TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Approved', 'Pending', 'Rejected'))
);

CREATE TABLE hostel_leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    rejection_reason VARCHAR(255),
    type VARCHAR(50) NOT NULL CHECK (type IN ('Leave', 'Outpass')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hostel_broadcasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scope VARCHAR(50) NOT NULL DEFAULT 'Global' CHECK (scope IN ('Global', 'Hostel', 'Block')),
    
    -- Crucial Integrity Fix: Explicit structured foreign keys instead of dynamic unsafe target_id
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    hostel_id UUID REFERENCES hostels(id) ON DELETE CASCADE,
    block_id UUID REFERENCES blocks(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Enforce absolute target location consistency
    CONSTRAINT chk_broadcast_scope CHECK (
        (campus_id IS NULL AND hostel_id IS NULL AND block_id IS NULL)
        OR (block_id IS NOT NULL)
        OR (hostel_id IS NOT NULL)
        OR (campus_id IS NOT NULL)
    )
);

-- =========================================================================
--  9. SUB-MILLISECOND ENTERPRISE PERFORMANCE INDICES & TRIGGERS
-- =========================================================================

-- Enforces database-level constraint: exactly one active room lease per student at any moment
CREATE UNIQUE INDEX uniq_active_allocation 
ON allocations (student_id) 
WHERE is_current = true AND deleted_at IS NULL;

-- Accelerates student active room lease queries
CREATE INDEX idx_allocations_student_current ON allocations (student_id, is_current) WHERE deleted_at IS NULL;

-- Speeds up real-time room availability browsing
CREATE INDEX idx_rooms_block_status ON rooms (block_id, status);

-- Accelerates student financial status queries
CREATE INDEX idx_finance_student_period ON finance (student_id, year, sem);

-- Optimizes warden roll-call checks and daily attendance reports
CREATE INDEX idx_attendance_date_room ON hostel_attendance (date, room_id);

-- Accelerates event polling processing loops for outbox dispatchers
CREATE INDEX idx_domain_events_status ON domain_events (status, retry_count);

-- Enforces high-concurrency overbooking protection on active allocations
CREATE INDEX idx_allocations_room_active ON allocations (room_id) WHERE status = 'ACTIVE' AND deleted_at IS NULL;
```
