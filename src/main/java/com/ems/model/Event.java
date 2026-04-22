package com.ems.model;

import java.sql.Date;

public class Event {
    private String id;
    private String name;
    private String type;
    private Date startDate;
    private Date endDate;
    private int noOfGuests;
    private String status;
    private String venue; 

    public Event() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }
    
    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }
    
    public int getNoOfGuests() { return noOfGuests; }
    public void setNoOfGuests(int noOfGuests) { this.noOfGuests = noOfGuests; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
}
