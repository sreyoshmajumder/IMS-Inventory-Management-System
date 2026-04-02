package com.ims.inventory.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.ims.inventory.entity.Supplier;
import com.ims.inventory.service.SupplierService;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    // Create Supplier
    @PostMapping
    public Supplier create(@Valid @RequestBody Supplier supplier) {
        return supplierService.save(supplier);
    }

    // Get All Suppliers
    @GetMapping
    public List<Supplier> getAll() {
        return supplierService.getAll();
    }

    // Get Supplier by ID
    @GetMapping("/{id}")
    public Supplier getById(@PathVariable Long id) {
        return supplierService.getById(id);
    }

    // Update Supplier
    @PutMapping("/{id}")
    public Supplier update(@PathVariable Long id,
                           @Valid @RequestBody Supplier supplier) {
        return supplierService.update(id, supplier);
    }

    // Delete Supplier
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        supplierService.delete(id);
        return "Supplier deleted successfully";
    }
}