package com.ems.servlet;

import com.ems.dao.EventDAO;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public class EventParticipationServlet extends HttpServlet {
    private EventDAO eventDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        eventDAO = new EventDAO();
        gson = new Gson();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        Map<String, Object> json = new HashMap<>();

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user_id") == null) {
            json.put("success", false);
            json.put("message", "Please login first");
            out.print(gson.toJson(json));
            return;
        }

        String userId = (String) session.getAttribute("user_id");
        String pathInfo = request.getPathInfo(); 
        if (pathInfo == null) { json.put("success", false); out.print(gson.toJson(json)); return; }
        
        String[] parts = pathInfo.split("/");
        String eventId = parts.length >= 2 ? parts[1] : null;

        if (eventId == null) {
            json.put("success", false);
            json.put("message", "Event ID required");
            out.print(gson.toJson(json));
            return;
        }

        if (eventDAO.isRegistered(eventId, userId)) {
            json.put("success", false);
            json.put("message", "Already registered for this event");
            out.print(gson.toJson(json));
            return;
        }

        boolean registered = eventDAO.registerParticipant(eventId, userId);
        json.put("success", registered);
        json.put("message", registered ? "Successfully registered!" : "Registration failed");
        out.print(gson.toJson(json));
        out.flush();
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        Map<String, Object> json = new HashMap<>();

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user_id") == null) {
            json.put("success", false);
            out.print(gson.toJson(json));
            return;
        }

        String userId = (String) session.getAttribute("user_id");
        String pathInfo = request.getPathInfo();
        String[] parts = pathInfo != null ? pathInfo.split("/") : new String[]{};
        String eventId = parts.length >= 2 ? parts[1] : null;

        if (eventId != null) {
            boolean cancelled = eventDAO.cancelRegistration(eventId, userId);
            json.put("success", cancelled);
            json.put("message", cancelled ? "Registration cancelled" : "Cancel failed");
        } else {
            json.put("success", false);
        }
        out.print(gson.toJson(json));
        out.flush();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        Map<String, Object> json = new HashMap<>();

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user_id") == null) {
            json.put("success", false);
            json.put("data", new ArrayList<>());
            out.print(gson.toJson(json));
            return;
        }

        String userId = (String) session.getAttribute("user_id");
        json.put("success", true);
        json.put("data", eventDAO.getRegisteredEvents(userId));
        out.print(gson.toJson(json));
        out.flush();
    }
}
