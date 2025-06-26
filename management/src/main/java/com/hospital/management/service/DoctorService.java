package com.hospital.management.service;

import com.hospital.management.model.Doctor;
import java.util.List;

public interface DoctorService {
    Doctor saveDoctor(Doctor doctor);
    List<Doctor> getAllDoctors();
    Doctor getDoctorById(Long id);
    Doctor updateDoctor(Doctor doctor, Long id);
    void deleteDoctor(Long id);
    List<Doctor> findBySpecialization(String specialization);
    List<Doctor> findByDepartment(String department);
}