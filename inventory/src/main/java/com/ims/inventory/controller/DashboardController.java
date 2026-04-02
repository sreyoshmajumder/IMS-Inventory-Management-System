package com.ims.inventory.controller;

import com.ims.inventory.repository.ProductRepository;
import com.ims.inventory.repository.SupplierRepository;
import com.ims.inventory.repository.OrderRepository;
import com.ims.inventory.service.ProductService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final OrderRepository orderRepository;
    private final ProductService productService;

    @GetMapping
    public Map<String, Object> getDashboard() {

        Map<String, Object> data = new HashMap<>();

        data.put("totalProducts", productRepository.count());
        data.put("totalSuppliers", supplierRepository.count());
        data.put("totalOrders", orderRepository.count());
        data.put("lowStockProducts", productRepository.findByQuantityLessThan(5).size());
        data.put("totalInventoryValue", productService.getTotalInventoryValue());

        return data;
    }
}