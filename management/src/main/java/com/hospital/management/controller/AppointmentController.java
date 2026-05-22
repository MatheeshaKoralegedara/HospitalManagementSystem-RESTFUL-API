package com.hospital.management.controller;

import com.hospital.management.dto.AppointmentRequest;
import com.hospital.management.model.Appointment;
import com.hospital.management.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<Appointment> saveAppointment(@Valid @RequestBody AppointmentRequest appointmentRequest) {
        return new ResponseEntity<>(appointmentService.saveAppointment(appointmentRequest), HttpStatus.CREATED);
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable("id") Long appointmentId) {
        return new ResponseEntity<>(appointmentService.getAppointmentById(appointmentId), HttpStatus.OK);
    }

    @PutMapping("{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable("id") Long id,
                                                         @Valid @RequestBody AppointmentRequest appointmentRequest) {
        return ResponseEntity.ok(appointmentService.updateAppointment(appointmentRequest, id));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable("id") Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok("Appointment deleted successfully");
    }

    @GetMapping("/doctor/{doctorId}/date/{date}")
    public List<Appointment> getAppointmentsByDoctorAndDate(@PathVariable Long doctorId,
                                                            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        return appointmentService.getAppointmentsByDoctorAndDate(doctorId, date);
    }

    @GetMapping("/patient/{patientId}")
    public List<Appointment> getAppointmentsByPatient(@PathVariable Long patientId) {
        return appointmentService.getAppointmentsByPatient(patientId);
    }

    @GetMapping("/status/{status}")
    public List<Appointment> getAppointmentsByStatus(@PathVariable String status) {
        return appointmentService.getAppointmentsByStatus(status);
    }
}
