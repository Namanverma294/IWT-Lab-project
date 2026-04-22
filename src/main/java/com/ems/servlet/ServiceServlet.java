package com.ems.servlet;

import com.ems.util.DBUtil;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ServiceServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        Map<String, Object> jsonResponse = new HashMap<>();
        
        String sql = "SELECT * FROM Services";
        String typeFilter = request.getParameter("type");
        if (typeFilter != null && !typeFilter.isEmpty()) {
            sql += " WHERE service_type = ?";
        }
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
             
            if (typeFilter != null && !typeFilter.isEmpty()) {
                stmt.setString(1, typeFilter);
            }
            
            try (ResultSet rs = stmt.executeQuery()) {
                List<Map<String, Object>> services = new ArrayList<>();
                while (rs.next()) {
                    Map<String, Object> s = new HashMap<>();
                    s.put("S_id", rs.getString("S_id"));
                    s.put("service_type", rs.getString("service_type"));
                    s.put("name", rs.getString("name"));
                    s.put("phone", rs.getString("phone"));
                    services.add(s);
                }
                jsonResponse.put("success", true);
                jsonResponse.put("data", services);
            }
        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.put("success", false);
            jsonResponse.put("message", e.getMessage());
        }
        
        out.print(gson.toJson(jsonResponse));
        out.flush();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        Map<String, Object> jsonResponse = new HashMap<>();
        
        try {
            @SuppressWarnings("unchecked")
            Map<String, String> payload = gson.fromJson(request.getReader(), Map.class);
            String serviceType = payload.get("service_type");
            String name = payload.get("name");
            String phone = payload.get("phone");
            
            String newId = UUID.randomUUID().toString();
            
            try (Connection conn = DBUtil.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(
                     "INSERT INTO Services (S_id, service_type, name, phone) VALUES (?, ?, ?, ?)")) {
                
                stmt.setString(1, newId);
                stmt.setString(2, serviceType);
                stmt.setString(3, name);
                stmt.setString(4, phone);
                
                stmt.executeUpdate();
                
                jsonResponse.put("success", true);
                jsonResponse.put("message", "Service added successfully");
            }
        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Failed to add service");
        }
        
        out.print(gson.toJson(jsonResponse));
        out.flush();
    }
}
