package com.ems;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.UUID;
import com.ems.util.DBUtil;

public class InsertDummyEvents {
    public static void main(String[] args) {
        try (Connection conn = DBUtil.getConnection()) {
            
            // 1. Get an Organizer ID
            String orgId = null;
            try (PreparedStatement stmt = conn.prepareStatement("SELECT O_id FROM Organizers LIMIT 1");
                 ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    orgId = rs.getString(1);
                }
            }
            
            if (orgId == null) {
                System.out.println("No organizers found. Cannot insert events. Run InsertDummyData first.");
                return;
            }

            // 2. Insert dummy events
            String sql = "INSERT INTO Events (F_id, F_name, F_type, F_start_date, F_end_date, No_of_guests, status, organizer_id, venue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            String[][] events = {
                {"Tech Symposium 2026", "Technical", "2026-05-15", "2026-05-16", "500", "Published", "Main Auditorium"},
                {"Cultural Night", "Cultural", "2026-06-20", "2026-06-20", "1000", "Published", "Open Air Theatre"},
                {"Sports Meet", "Sports", "2026-04-28", "2026-04-30", "800", "Published", "Campus Ground"},
                {"AI Workshop", "Workshop", "2026-05-05", "2026-05-05", "100", "Published", "Lab 3"}
            };
            
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                for (String[] ev : events) {
                    stmt.setString(1, UUID.randomUUID().toString());
                    stmt.setString(2, ev[0]); // name
                    stmt.setString(3, ev[1]); // type
                    stmt.setString(4, ev[2]); // start date
                    stmt.setString(5, ev[3]); // end date
                    stmt.setInt(6, Integer.parseInt(ev[4])); // guests
                    stmt.setString(7, ev[5]); // status
                    stmt.setString(8, orgId); // orgId
                    stmt.setString(9, ev[6]); // venue
                    
                    try {
                        stmt.executeUpdate();
                        System.out.println("Inserted Event: " + ev[0]);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
            
            System.out.println("\nSUCCESS! Dummy events inserted.");
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
