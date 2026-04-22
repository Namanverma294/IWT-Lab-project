package com.ems.dao;

import com.ems.model.Event;
import com.ems.util.DBUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class EventDAO {

    public List<Event> getAllEvents() {
        List<Event> events = new ArrayList<>();
        String sql = "SELECT * FROM Events ORDER BY F_start_date ASC";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                events.add(mapEvent(rs));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return events;
    }

    public List<Event> getPublishedEvents() {
        List<Event> events = new ArrayList<>();
        String sql = "SELECT * FROM Events WHERE status = 'Published' ORDER BY F_start_date ASC";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                events.add(mapEvent(rs));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return events;
    }

    public List<Event> getEventsByOrganizer(String organizerId) {
        List<Event> events = new ArrayList<>();
        String sql = "SELECT * FROM Events WHERE organizer_id = ? ORDER BY F_start_date DESC";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, organizerId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    events.add(mapEvent(rs));
                }
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return events;
    }

    public Event getEventById(String eventId) {
        String sql = "SELECT * FROM Events WHERE F_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, eventId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) return mapEvent(rs);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    public String createEvent(String name, String type, String startDate, String endDate, 
                              int guests, String status, String organizerId, String venue) {
        String id = UUID.randomUUID().toString();
        String sql = "INSERT INTO Events (F_id, F_name, F_type, F_start_date, F_end_date, No_of_guests, status, organizer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, id);
            stmt.setString(2, name);
            stmt.setString(3, type);
            stmt.setString(4, startDate);
            stmt.setString(5, endDate);
            stmt.setInt(6, guests);
            stmt.setString(7, status != null ? status : "Draft");
            stmt.setString(8, organizerId);
            stmt.executeUpdate();
            return id;
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    public boolean updateEvent(String eventId, String name, String type, String startDate, 
                                String endDate, Integer guests, String status) {
        StringBuilder sql = new StringBuilder("UPDATE Events SET ");
        List<Object> params = new ArrayList<>();
        boolean first = true;

        if (name != null) { sql.append("F_name = ?"); params.add(name); first = false; }
        if (type != null) { if (!first) sql.append(", "); sql.append("F_type = ?"); params.add(type); first = false; }
        if (startDate != null) { if (!first) sql.append(", "); sql.append("F_start_date = ?"); params.add(startDate); first = false; }
        if (endDate != null) { if (!first) sql.append(", "); sql.append("F_end_date = ?"); params.add(endDate); first = false; }
        if (guests != null) { if (!first) sql.append(", "); sql.append("No_of_guests = ?"); params.add(guests); first = false; }
        if (status != null) { if (!first) sql.append(", "); sql.append("status = ?"); params.add(status); first = false; }
        
        if (params.isEmpty()) return false;
        sql.append(" WHERE F_id = ?");
        params.add(eventId);

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                Object p = params.get(i);
                if (p instanceof Integer) stmt.setInt(i + 1, (Integer) p);
                else stmt.setString(i + 1, p.toString());
            }
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean deleteEvent(String eventId) {
        String sql = "DELETE FROM Events WHERE F_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, eventId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean registerParticipant(String eventId, String customerId) {
        String sql = "INSERT INTO Event_Participants (participant_id, event_id) VALUES (?, ?)";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, customerId);
            stmt.setString(2, eventId);
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean cancelRegistration(String eventId, String customerId) {
        String sql = "DELETE FROM Event_Participants WHERE participant_id = ? AND event_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, customerId);
            stmt.setString(2, eventId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public boolean isRegistered(String eventId, String customerId) {
        String sql = "SELECT 1 FROM Event_Participants WHERE participant_id = ? AND event_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, customerId);
            stmt.setString(2, eventId);
            try (ResultSet rs = stmt.executeQuery()) { return rs.next(); }
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    public List<Event> getRegisteredEvents(String customerId) {
        List<Event> events = new ArrayList<>();
        String sql = "SELECT e.* FROM Events e JOIN Event_Participants ep ON e.F_id = ep.event_id WHERE ep.participant_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, customerId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) events.add(mapEvent(rs));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return events;
    }

    public int getParticipantCount(String eventId) {
        String sql = "SELECT COUNT(*) FROM Event_Participants WHERE event_id = ?";
        try (Connection conn = DBUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, eventId);
            try (ResultSet rs = stmt.executeQuery()) { if (rs.next()) return rs.getInt(1); }
        } catch (SQLException e) { e.printStackTrace(); }
        return 0;
    }

    private Event mapEvent(ResultSet rs) throws SQLException {
        Event ev = new Event();
        ev.setId(rs.getString("F_id"));
        ev.setName(rs.getString("F_name"));
        ev.setType(rs.getString("F_type"));
        ev.setStartDate(rs.getDate("F_start_date"));
        ev.setEndDate(rs.getDate("F_end_date"));
        ev.setNoOfGuests(rs.getInt("No_of_guests"));
        ev.setStatus(rs.getString("status"));
        try { ev.setVenue(rs.getString("venue")); } catch (SQLException ignored) {}
        return ev;
    }
}
