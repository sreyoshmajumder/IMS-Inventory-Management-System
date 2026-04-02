package com.ims.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ims.inventory.entity.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}