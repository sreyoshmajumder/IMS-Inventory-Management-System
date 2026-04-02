package com.ims.inventory.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.ims.inventory.entity.Product;
import com.ims.inventory.service.ProductService;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ProductService productService;

    @GetMapping("/inventory-value")
    public double getTotalInventoryValue() {
        return productService.getTotalInventoryValue();
    }

    @GetMapping("/low-stock")
    public List<Product> getLowStockProducts() {
        return productService.getLowStock(5);
    }
}