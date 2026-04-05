package com.ims.inventory.service;

import com.ims.inventory.entity.InventoryLog;
import com.ims.inventory.repository.InventoryLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InventoryLogService {

    @Autowired
    private InventoryLogRepository inventoryLogRepository;

    public void log(String action, Long productId, Integer oldQuantity,
                    Integer newQuantity, String performedBy) {
        InventoryLog log = new InventoryLog();
        log.setAction(action);
        log.setProductId(productId);
        log.setOldQuantity(oldQuantity);
        log.setNewQuantity(newQuantity);
        log.setUsername(performedBy);   // ✅ fixed line
        inventoryLogRepository.save(log);
    }
}