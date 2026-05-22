package com.hospital.management.controller;

import com.hospital.management.model.Patient;
import com.hospital.management.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping
    public ResponseEntity<Patient> savePatient(@Valid @RequestBody Patient patient) {
        return new ResponseEntity<>(patientService.savePatient(patient), HttpStatus.CREATED);
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable("id") Long patientId) {
        return new ResponseEntity<>(patientService.getPatientById(patientId), HttpStatus.OK);
    }

    @PutMapping("{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable("id") Long id,
                                                 @Valid @RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.updatePatient(patient, id));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deletePatient(@PathVariable("id") Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok("Patient deleted successfully");
    }
}
