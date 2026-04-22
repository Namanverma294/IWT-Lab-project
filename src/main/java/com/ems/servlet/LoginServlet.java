package com.ems.servlet;

import com.ems.dao.CustomerDAO;
import com.ems.model.Customer;
import com.ems.util.DBUtil;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public class LoginServlet extends HttpServlet {
    private CustomerDAO customerDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        customerDAO = new CustomerDAO();
        gson = new Gson();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        Map<String, String> creds = gson.fromJson(request.getReader(), Map.class);
        String email = creds != null ? creds.get("email") : null;
        String password = creds != null ? creds.get("password") : null;
        
        System.out.println("DEBUG LOGIN: Email received = [" + email + "]");
        System.out.println("DEBUG LOGIN: Password received = [" + password + "]");

        Map<String, Object> jsonResponse = new HashMap<>();
        
        if (email == null || password == null) {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Email and Password are required.");
            out.print(gson.toJson(jsonResponse));
            return;
        }

        Customer customer = customerDAO.authenticate(email, password);
        
        if (customer != null) {
            HttpSession session = request.getSession(true);
            session.setAttribute("user_id", customer.getId());
            session.setAttribute("user_name", customer.getName());
            session.setAttribute("user_role", "participant");
            
            Map<String, Object> data = new HashMap<>();
            data.put("role", "participant");
            data.put("name", customer.getName());
            
            jsonResponse.put("success", true);
            jsonResponse.put("message", "Login successful");
            jsonResponse.put("data", data);
            out.print(gson.toJson(jsonResponse));
            out.flush();
            return;
        }

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                 "SELECT * FROM Organizers WHERE email = ? AND password_hash = ?")) {
            
            stmt.setString(1, email);
            stmt.setString(2, password);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    String role = rs.getString("role");
                    String name = rs.getString("name");
                    String id = rs.getString("O_id");
                    
                    HttpSession session = request.getSession(true);
                    session.setAttribute("user_id", id);
                    session.setAttribute("user_name", name);
                    session.setAttribute("user_role", role);

                    String frontendRole = switch (role) {
                        case "Organizer" -> "organizer";
                        case "FacultyAdvisor" -> "faculty_advisor";
                        case "4YStudent" -> "4ys";
                        case "OC" -> "oc";
                        case "POC" -> "poc";
                        default -> "organizer";
                    };
                    
                    Map<String, Object> data = new HashMap<>();
                    data.put("role", frontendRole);
                    data.put("name", name);
                    
                    jsonResponse.put("success", true);
                    jsonResponse.put("message", "Login successful");
                    jsonResponse.put("data", data);
                    out.print(gson.toJson(jsonResponse));
                    out.flush();
                    return;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        jsonResponse.put("success", false);
        jsonResponse.put("message", "Invalid email or password.");
        out.print(gson.toJson(jsonResponse));
        out.flush();
    }
}
