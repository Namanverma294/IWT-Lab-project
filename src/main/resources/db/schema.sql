-- Event Management System
-- MySQL DDL Schema generated according to PRD v1.0 Section 6

CREATE DATABASE IF NOT EXISTS ems_db;
USE ems_db;

-- 6.3 Layer 3: Organizational & Financial Layer (Dependencies applied first)
CREATE TABLE Organizers (
    O_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(64) NOT NULL,
    role ENUM('Organizer', 'FacultyAdvisor', '4YStudent', 'OC', 'POC') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE OC_Members (
    oc_id VARCHAR(36) PRIMARY KEY,
    invite_code VARCHAR(50) UNIQUE,
    FOREIGN KEY (oc_id) REFERENCES Organizers(O_id) ON DELETE CASCADE
);

CREATE TABLE OC_Member_Domains (
    oc_id VARCHAR(36),
    domain ENUM('Logistics', 'MediaProduction', 'Creative', 'PR', 'Content', 'Sponsorship', 'SocialMedia', 'Graphics', 'Technical') NOT NULL,
    PRIMARY KEY (oc_id, domain),
    FOREIGN KEY (oc_id) REFERENCES OC_Members(oc_id) ON DELETE CASCADE
);


-- 6.1 Layer 1: Public Data Layer
CREATE TABLE Events (
    F_id VARCHAR(36) PRIMARY KEY,
    F_name VARCHAR(255) NOT NULL,
    F_type ENUM('Cultural', 'Technical', 'Sports', 'Seminar', 'Workshop', 'Other') NOT NULL,
    F_start_date DATE NOT NULL,
    F_end_date DATE NOT NULL,
    No_of_guests INT NOT NULL CHECK (No_of_guests >= 0),
    status ENUM('Draft', 'UnderReview', 'Approved', 'Published', 'Completed') DEFAULT 'Draft',
    organizer_id VARCHAR(36),
    FOREIGN KEY (organizer_id) REFERENCES Organizers(O_id) ON DELETE SET NULL
);

CREATE TABLE Services (
    S_id VARCHAR(36) PRIMARY KEY,
    service_type ENUM('Photography', 'Venue', 'Catering', 'Music', 'Decoration') NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL
);

CREATE TABLE Event_Services (
    event_id VARCHAR(36),
    service_id VARCHAR(36),
    PRIMARY KEY (event_id, service_id),
    FOREIGN KEY (event_id) REFERENCES Events(F_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Services(S_id) ON DELETE CASCADE
);


-- 6.2 Layer 2: User & Participation Layer
CREATE TABLE Customers (
    C_id VARCHAR(36) PRIMARY KEY,
    C_name VARCHAR(255) NOT NULL,
    C_email VARCHAR(255) UNIQUE NOT NULL,
    C_phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Event_Participants (
    participant_id VARCHAR(36),
    event_id VARCHAR(36),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Registered', 'Confirmed', 'Cancelled') DEFAULT 'Registered',
    PRIMARY KEY (participant_id, event_id),
    FOREIGN KEY (participant_id) REFERENCES Customers(C_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Events(F_id) ON DELETE CASCADE
);

CREATE TABLE Feedback (
    feedback_id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36),
    event_id VARCHAR(36),
    organizer_id VARCHAR(36),
    F_rating TINYINT NOT NULL CHECK (F_rating BETWEEN 1 AND 5),
    F_comments TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(C_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Events(F_id) ON DELETE CASCADE,
    FOREIGN KEY (organizer_id) REFERENCES Organizers(O_id) ON DELETE CASCADE
);


-- Budget Integration (Layer 3 extension depending on Layer 1 and 2)
CREATE TABLE Budget (
    budget_id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) UNIQUE,
    Total_amount DECIMAL(12,2) NOT NULL,
    Estimated_cost DECIMAL(12,2) NOT NULL,
    Discount DECIMAL(12,2) DEFAULT 0,
    P_id VARCHAR(36) NOT NULL,
    P_type ENUM('Cash', 'Card', 'UPI', 'NEFT') NOT NULL,
    Amount_paid DECIMAL(12,2) DEFAULT 0,
    Amount_due DECIMAL(12,2) GENERATED ALWAYS AS (Total_amount - Amount_paid - Discount) STORED,
    customer_id VARCHAR(36),
    FOREIGN KEY (event_id) REFERENCES Events(F_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES Customers(C_id) ON DELETE SET NULL
);

CREATE TABLE Special_Offers (
    SO_id VARCHAR(36) PRIMARY KEY,
    budget_id VARCHAR(36),
    S_type VARCHAR(100) NOT NULL,
    Valid_dates VARCHAR(100) NOT NULL,
    FOREIGN KEY (budget_id) REFERENCES Budget(budget_id) ON DELETE CASCADE
);
