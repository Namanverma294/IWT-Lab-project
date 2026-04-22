package com.ems.servlet;

import com.ems.dao.CustomerDAO;
import com.ems.model.Customer;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class SignupServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private CustomerDAO customerDAO;

    @Override
    public void init() throws ServletException {
        customerDAO = new CustomerDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String name = request.getParameter("C_name");
        String email = request.getParameter("C_email");
        String phone = request.getParameter("C_phone");
        String password = request.getParameter("password");

        String hashedPassword = hashPassword(password); 

        Customer customer = new Customer(null, name, email, phone, hashedPassword, null);
        
        boolean isCreated = customerDAO.createCustomer(customer);
        
        if (isCreated) {
            
            request.getSession().setAttribute("flash_success", "Account created successfully. Please log in.");
            response.sendRedirect(request.getContextPath() + "/login.html");
        } else {
            request.getSession().setAttribute("flash_error", "Registration failed. Email might already exist.");
            response.sendRedirect(request.getContextPath() + "/signup.html");
        }
    }
    
    private String hashPassword(String password) {

        return password; 
    }
}
