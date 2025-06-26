package com.hospital.management.service;

import com.hospital.management.model.Patient;
import java.util.List;

public interface PatientService {
    Patient savePatient(Patient patient);
    List<Patient> getAllPatients();
    Patient getPatientById(Long id);
    Patient updatePatient(Patient patient, Long id);
    void deletePatient(Long id);
}