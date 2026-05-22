package com.hospital.management.service;

import com.hospital.management.dto.AppointmentRequest;
import com.hospital.management.model.Appointment;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentService {
    Appointment saveAppointment(AppointmentRequest appointmentRequest);
    List<Appointment> getAllAppointments();
    Appointment getAppointmentById(Long id);
    Appointment updateAppointment(AppointmentRequest appointmentRequest, Long id);
    void deleteAppointment(Long id);
    List<Appointment> getAppointmentsByDoctorAndDate(Long doctorId, LocalDateTime date);
    List<Appointment> getAppointmentsByPatient(Long patientId);
    List<Appointment> getAppointmentsByStatus(String status);
}
