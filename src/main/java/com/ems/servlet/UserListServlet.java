package com.ems.servlet;

import com.ems.util.DBUtil;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class UserListServlet extends HttpServlet {
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
        
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                 "SELECT C_id, C_name, C_email, created_at FROM Customers ORDER BY created_at DESC")) {
             
            try (ResultSet rs = stmt.executeQuery()) {
                List<Map<String, Object>> users = new ArrayList<>();
                while (rs.next()) {
                    Map<String, Object> user = new HashMap<>();
                    user.put("id", rs.getString("C_id"));
                    user.put("name", rs.getString("C_name"));
                    user.put("email", rs.getString("C_email"));
                    
                    Timestamp ts = rs.getTimestamp("created_at");
                    if (ts != null) {
                        user.put("created_at", ts.toString());
                    } else {
                        user.put("created_at", null);
                    }
                    users.add(user);
                }
                jsonResponse.put("success", true);
                jsonResponse.put("data", users);
            }
        } catch (Exception e) {
            e.printStackTrace();
            jsonResponse.put("success", false);
            jsonResponse.put("message", e.getMessage());
        }
        
        out.print(gson.toJson(jsonResponse));
        out.flush();
    }
}
