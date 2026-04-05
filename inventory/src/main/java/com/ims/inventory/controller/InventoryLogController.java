package com.ims.inventory.controller;

import com.ims.inventory.entity.InventoryLog;
import com.ims.inventory.repository.InventoryLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryLogController {

    @Autowired
    private InventoryLogRepository inventoryLogRepository;

    @GetMapping
    public List<InventoryLog> getAllLogs() {
        return inventoryLogRepository.findAllByOrderByTimestampDesc();
    }

    @GetMapping("/product/{productId}")
    public List<InventoryLog> getLogsByProduct(@PathVariable Long productId) {
        return inventoryLogRepository.findByProductIdOrderByTimestampDesc(productId);
    }
}