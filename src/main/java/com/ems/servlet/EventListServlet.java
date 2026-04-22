package com.ems.servlet;

import com.ems.dao.EventDAO;
import com.ems.model.Event;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public class EventListServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private EventDAO eventDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        eventDAO = new EventDAO();
        gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        Map<String, Object> json = new HashMap<>();

        String pathInfo = request.getPathInfo();

        if (pathInfo != null && pathInfo.length() > 1) {
            String eventId = pathInfo.substring(1);
            Event event = eventDAO.getEventById(eventId);
            if (event != null) {
                Map<String, Object> data = new HashMap<>();
                data.put("event", event);
                data.put("participantCount", eventDAO.getParticipantCount(eventId));
                
                HttpSession session = request.getSession(false);
                if (session != null && session.getAttribute("user_id") != null) {
                    data.put("isRegistered", eventDAO.isRegistered(eventId, (String) session.getAttribute("user_id")));
                }
                json.put("success", true);
                json.put("data", data);
            } else {
                json.put("success", false);
                json.put("message", "Event not found");
            }
            out.print(gson.toJson(json));
            out.flush();
            return;
        }

        String mine = request.getParameter("mine");
        if ("true".equals(mine)) {
            HttpSession session = request.getSession(false);
            if (session != null && session.getAttribute("user_id") != null) {
                String userId = (String) session.getAttribute("user_id");
                json.put("success", true);
                json.put("data", eventDAO.getEventsByOrganizer(userId));
            } else {
                json.put("success", false);
                json.put("message", "Not authenticated");
            }
            out.print(gson.toJson(json));
            out.flush();
            return;
        }

        json.put("success", true);
        json.put("data", eventDAO.getAllEvents());
        out.print(gson.toJson(json));
        out.flush();
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
            json.put("message", "Not authenticated");
            out.print(gson.toJson(json));
            return;
        }

        String userId = (String) session.getAttribute("user_id");
        @SuppressWarnings("unchecked")
        Map<String, String> body = gson.fromJson(request.getReader(), Map.class);

        String name = body.get("name");
        String type = body.get("type");
        String startDate = body.get("startDate");
        String endDate = body.get("endDate");
        int guests = 0;
        try { guests = Integer.parseInt(body.getOrDefault("numGuests", "50")); } catch (Exception e) {}
        String status = body.getOrDefault("status", "Published");
        String venue = body.get("venue");

        String eventId = eventDAO.createEvent(name, type, startDate, endDate, guests, status, userId, venue);

        if (eventId != null) {
            json.put("success", true);
            json.put("message", "Event created successfully");
            json.put("data", eventDAO.getEventById(eventId));
        } else {
            json.put("success", false);
            json.put("message", "Failed to create event");
        }
        out.print(gson.toJson(json));
        out.flush();
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        Map<String, Object> json = new HashMap<>();

        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            json.put("success", false);
            json.put("message", "Event ID required");
            out.print(gson.toJson(json));
            return;
        }

        String eventId = pathInfo.substring(1);
        @SuppressWarnings("unchecked")
        Map<String, String> body = gson.fromJson(request.getReader(), Map.class);

        String name = body.get("name");
        String type = body.get("type");
        String startDate = body.get("startDate");
        String endDate = body.get("endDate");
        Integer guests = body.containsKey("numGuests") ? Integer.parseInt(body.get("numGuests")) : null;
        String status = body.get("status");

        boolean updated = eventDAO.updateEvent(eventId, name, type, startDate, endDate, guests, status);
        json.put("success", updated);
        json.put("message", updated ? "Event updated" : "Update failed");
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

        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            json.put("success", false);
            out.print(gson.toJson(json));
            return;
        }

        String eventId = pathInfo.substring(1);
        boolean deleted = eventDAO.deleteEvent(eventId);
        json.put("success", deleted);
        json.put("message", deleted ? "Event deleted" : "Delete failed");
        out.print(gson.toJson(json));
        out.flush();
    }
}
