package com.ims.inventory.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.ims.inventory.entity.Supplier;
import com.ims.inventory.repository.SupplierRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    // Create Supplier
    public Supplier save(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    // Get All Suppliers
    public List<Supplier> getAll() {
        return supplierRepository.findAll();
    }

    // Get Supplier by ID
    public Supplier getById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
    }

    // Update Supplier
    public Supplier update(Long id, Supplier updatedSupplier) {
        Supplier existing = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        existing.setSupplierName(updatedSupplier.getSupplierName());
        existing.setContactInfo(updatedSupplier.getContactInfo());

        return supplierRepository.save(existing);
    }

    // Delete Supplier
    public void delete(Long id) {
        supplierRepository.deleteById(id);
    }
}