package com.hospital.management.service;

import com.hospital.management.model.Appointment;
import java.util.Date;
import java.util.List;

public interface AppointmentService {
    Appointment saveAppointment(Appointment appointment);
    List<Appointment> getAllAppointments();
    Appointment getAppointmentById(Long id);
    Appointment updateAppointment(Appointment appointment, Long id);
    void deleteAppointment(Long id);
    List<Appointment> getAppointmentsByDoctorAndDate(Long doctorId, Date date);
    List<Appointment> getAppointmentsByPatient(Long patientId);
    List<Appointment> getAppointmentsByStatus(String status);
}