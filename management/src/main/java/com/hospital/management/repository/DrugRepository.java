package com.hospital.management.repository;

import com.hospital.management.model.Drug;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DrugRepository extends JpaRepository<Drug, Long> {
    List<Drug> findByNameContaining(String name);
    List<Drug> findByQuantityLessThan(int quantity);
}