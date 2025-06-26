package com.hospital.management.service.impl;

import com.hospital.management.model.Doctor;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Doctor getDoctorById(Long id) {
        Optional<Doctor> doctor = doctorRepository.findById(id);
        return doctor.orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
    }

    @Override
    public Doctor updateDoctor(Doctor doctor, Long id) {
        Doctor existingDoctor = getDoctorById(id);
        existingDoctor.setName(doctor.getName());
        existingDoctor.setEmail(doctor.getEmail());
        existingDoctor.setPhone(doctor.getPhone());
        existingDoctor.setAddress(doctor.getAddress());
        existingDoctor.setSpecialization(doctor.getSpecialization());
        existingDoctor.setQualification(doctor.getQualification());
        existingDoctor.setYearsOfExperience(doctor.getYearsOfExperience());
        existingDoctor.setDepartment(doctor.getDepartment());
        existingDoctor.setSalary(doctor.getSalary());
        return doctorRepository.save(existingDoctor);
    }

    @Override
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    @Override
    public List<Doctor> findBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }

    @Override
    public List<Doctor> findByDepartment(String department) {
        return doctorRepository.findByDepartment(department);
    }
}