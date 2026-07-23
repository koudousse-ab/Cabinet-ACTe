package com.cabinet.acte.dto;

import com.cabinet.acte.entity.Employee;
import com.cabinet.acte.entity.Notification;

import java.time.LocalDateTime;

public class NotificationDTO {
    private Long id;
    private String message;
    private Long employeeId;
    private Long taskId;
    private boolean isRead;
    private LocalDateTime createdAt;

    public NotificationDTO() {}
    public NotificationDTO(Long id, String message, Long employeeId, Long taskId, boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.message = message;
        this.employeeId = employeeId;
        this.taskId = taskId;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getMessage() { return message; }
    public Long getEmployeeId() { return employeeId; }
    public Long getTaskId() { return taskId; }
    public boolean isRead() { return isRead; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setMessage(String message) { this.message = message; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }
    public void setRead(boolean read) { isRead = read; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static NotificationDTO fromEntity(Notification notification) {
        return new NotificationDTO(
            notification.getId(),
            notification.getMessage(),
            notification.getEmployeeId(),
            notification.getTaskId(),
            notification.isRead(),
            notification.getCreatedAt()
        );
    }

    public Notification toEntity() {
        Notification notification = new Notification();
        notification.setId(this.id);
        notification.setMessage(this.message);
        notification.setEmployeeId(this.employeeId);
        notification.setTaskId(this.taskId);
        notification.setRead(this.isRead);
        return notification;
    }
}
