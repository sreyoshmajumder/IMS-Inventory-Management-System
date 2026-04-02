package com.ims.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ims.inventory.entity.Product;
import java.util.Optional;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByQuantityLessThan(int quantity);
    List<Product> findByProductNameContainingIgnoreCase(String name);
    List<Product> findByPriceBetween(double min, double max);
    Optional<Product> findByProductName(String productName);
}