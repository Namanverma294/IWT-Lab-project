package com.ems.dao;

import com.ems.model.Customer;
import com.ems.util.DBUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

public class CustomerDAO {

    public boolean createCustomer(Customer customer) {
        String sql = "INSERT INTO Customers (C_id, C_name, C_email, C_phone, password_hash) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            customer.setId(UUID.randomUUID().toString());
            stmt.setString(1, customer.getId());
            stmt.setString(2, customer.getName());
            stmt.setString(3, customer.getEmail());
            stmt.setString(4, customer.getPhone());
            stmt.setString(5, customer.getPasswordHash());
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
            
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public Customer authenticate(String email, String passwordHash) {
        String sql = "SELECT * FROM Customers WHERE C_email = ? AND password_hash = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, email);
            stmt.setString(2, passwordHash);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Customer(
                        rs.getString("C_id"),
                        rs.getString("C_name"),
                        rs.getString("C_email"),
                        rs.getString("C_phone"),
                        rs.getString("password_hash"),
                        rs.getTimestamp("created_at")
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
