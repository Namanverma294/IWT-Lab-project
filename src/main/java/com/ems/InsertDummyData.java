package com.ems;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.UUID;
import com.ems.util.DBUtil;

public class InsertDummyData {
    public static void main(String[] args) {
        String[] roles = {"Organizer", "FacultyAdvisor", "POC", "OC", "4YStudent"};
        
        try (Connection conn = DBUtil.getConnection()) {
            
            // 1. Insert 5 members for each Organizer role
            String orgSql = "INSERT INTO Organizers (name, email, role, password_hash) VALUES (?, ?, ?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(orgSql)) {
                for (String role : roles) {
                    for (int i = 1; i <= 5; i++) {
                        stmt.setString(1, "Test " + role + " " + i);
                        stmt.setString(2, role.toLowerCase() + i + "@college.edu");
                        stmt.setString(3, role);
                        stmt.setString(4, "password123");
                        try {
                            stmt.executeUpdate();
                            System.out.println("Inserted: " + role.toLowerCase() + i + "@college.edu");
                        } catch (Exception e) {
                            // Ignore duplicates
                        }
                    }
                }
            }
            
            // 2. Insert 5 Participants
            String custSql = "INSERT INTO Customers (C_id, C_name, C_email, C_phone, password_hash) VALUES (?, ?, ?, ?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(custSql)) {
                for (int i = 1; i <= 5; i++) {
                    stmt.setString(1, UUID.randomUUID().toString());
                    stmt.setString(2, "Test Participant " + i);
                    stmt.setString(3, "participant" + i + "@college.edu");
                    stmt.setString(4, "987654321" + i);
                    stmt.setString(5, "password123");
                    try {
                        stmt.executeUpdate();
                        System.out.println("Inserted: participant" + i + "@college.edu");
                    } catch (Exception e) {
                        // Ignore duplicates
                    }
                }
            }
            
            System.out.println("\nSUCCESS! All dummy accounts have been inserted with password 'password123'.");
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
