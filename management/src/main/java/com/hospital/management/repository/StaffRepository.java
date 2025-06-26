package com.hospital.management.repository;

import com.hospital.management.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findByRole(String role);
    List<Staff> findByDepartment(String department);
}