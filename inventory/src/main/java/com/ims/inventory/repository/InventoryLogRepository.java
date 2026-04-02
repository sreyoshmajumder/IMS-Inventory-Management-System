package com.ims.inventory.repository;

import com.ims.inventory.entity.InventoryLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {
}