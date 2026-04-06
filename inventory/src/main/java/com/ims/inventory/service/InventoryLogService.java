package com.ims.inventory.service;

import com.ims.inventory.entity.InventoryLog;
import com.ims.inventory.repository.InventoryLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InventoryLogService {

    private final InventoryLogRepository inventoryLogRepository;

    public void log(String action, Long productId, Integer oldQuantity, Integer newQuantity) {
        InventoryLog log = new InventoryLog();
        log.setAction(action);
        log.setProductId(productId);
        log.setOldQuantity(oldQuantity);
        log.setNewQuantity(newQuantity);
        log.setUsername(resolveUsername());
        inventoryLogRepository.save(log);
    }

    private String resolveUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            return "system";
        }
        return auth.getName();
    }
}