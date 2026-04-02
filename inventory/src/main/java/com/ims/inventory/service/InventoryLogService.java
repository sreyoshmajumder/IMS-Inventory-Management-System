package com.ims.inventory.service;

import com.ims.inventory.entity.InventoryLog;
import com.ims.inventory.repository.InventoryLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class InventoryLogService {

    private final InventoryLogRepository logRepository;

    public InventoryLogService(InventoryLogRepository logRepository) {
        this.logRepository = logRepository;
    }

    public void logAction(String action, Long productId, Integer oldQty, Integer newQty, String user) {

        InventoryLog log = new InventoryLog();

        log.setAction(action);
        log.setProductId(productId);
        log.setOldQuantity(oldQty);
        log.setNewQuantity(newQty);
        log.setPerformedBy(user);
        log.setTimestamp(LocalDateTime.now());

        logRepository.save(log);
    }
}