package com.ems.servlet;

import com.ems.util.DBUtil;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.HashMap;
import java.util.Map;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AdminServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        gson = new Gson();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        @SuppressWarnings("unchecked")
        Map<String, String> data = gson.fromJson(request.getReader(), Map.class);
        String name = data != null ? data.get("name") : null;
        String email = data != null ? data.get("email") : null;
        String role = data != null ? data.get("role") : null;
        String password = data != null ? data.get("password") : null;

        Map<String, Object> jsonResponse = new HashMap<>();
        
        if (name == null || email == null || role == null || password == null) {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "All fields are required.");
            out.print(gson.toJson(jsonResponse));
            return;
        }

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                 "INSERT INTO Organizers (name, email, role, password_hash) VALUES (?, ?, ?, ?)")) {
            
            stmt.setString(1, name);
            stmt.setString(2, email);
            stmt.setString(3, role);
            stmt.setString(4, password); // Note: Should hash in production
            
            int rowsAffected = stmt.executeUpdate();
            
            if (rowsAffected > 0) {
                jsonResponse.put("success", true);
                jsonResponse.put("message", "Staff account created successfully.");
            } else {
                jsonResponse.put("success", false);
                jsonResponse.put("message", "Failed to create account.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Database error or email already exists.");
        }
        
        out.print(gson.toJson(jsonResponse));
        out.flush();
    }
}
