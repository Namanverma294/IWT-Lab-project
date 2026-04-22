package com.ems;

import com.ems.util.DBUtil;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class TestDB {
    public static void main(String[] args) {
        System.out.println("--- FETCHING REGISTERED USERS ---");
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT C_id, C_name, C_email FROM Customers ORDER BY created_at DESC")) {
            
            try (ResultSet rs = stmt.executeQuery()) {
                System.out.printf("%-10s | %-25s | %-30s%n", "USER ID", "NAME", "EMAIL");
                System.out.println("-----------------------------------------------------------------------");
                int count = 0;
                while (rs.next()) {
                    System.out.printf("%-10s | %-25s | %-30s%n", 
                        rs.getString("C_id"), 
                        rs.getString("C_name"), 
                        rs.getString("C_email"));
                    count++;
                }
                System.out.println("-----------------------------------------------------------------------");
                System.out.println("Total Registered Users: " + count);
            }
        } catch (Exception e) {
            System.err.println("FAILED to fetch users! Error details:");
            e.printStackTrace();
        }
    }
}
