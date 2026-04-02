package com.ims.inventory.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

import com.ims.inventory.entity.Product;
import com.ims.inventory.repository.ProductRepository;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final InventoryLogService logService;

    // Save product (Add or update quantity)
    public Product save(Product product) {

        Optional<Product> existingProduct =
                productRepository.findByProductName(product.getProductName());

        if (existingProduct.isPresent()) {

            Product updatedProduct = existingProduct.get();

            int oldQty = updatedProduct.getQuantity();

            updatedProduct.setQuantity(
                    updatedProduct.getQuantity() + product.getQuantity()
            );

            Product saved = productRepository.save(updatedProduct);

            logService.logAction(
                    "STOCK_INCREASED",
                    saved.getProductId(),
                    oldQty,
                    saved.getQuantity(),
                    "admin"
            );

            return saved;

        } else {

            Product saved = productRepository.save(product);

            logService.logAction(
                    "PRODUCT_ADDED",
                    saved.getProductId(),
                    0,
                    saved.getQuantity(),
                    "admin"
            );

            return saved;
        }
    }

    // Get all products
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    // Reduce stock
    public Product reduceStock(Long id, int quantity) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Product not found"));

        if (product.getQuantity() < quantity) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Insufficient stock");
        }

        int oldQty = product.getQuantity();

        product.setQuantity(product.getQuantity() - quantity);

        Product saved = productRepository.save(product);

        logService.logAction(
                "STOCK_REDUCED",
                saved.getProductId(),
                oldQty,
                saved.getQuantity(),
                "admin"
        );

        return saved;
    }

    // Add stock
    public Product addStock(Long id, int quantity) {

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int oldQty = product.getQuantity();

        product.setQuantity(product.getQuantity() + quantity);

        Product saved = productRepository.save(product);

        logService.logAction(
                "STOCK_ADDED",
                saved.getProductId(),
                oldQty,
                saved.getQuantity(),
                "admin"
        );

        return saved;
    }

    // Pagination
    public Page<Product> getPaginated(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    // Price filter
    public List<Product> getByPriceRange(double min, double max) {
        return productRepository.findByPriceBetween(min, max);
    }

    // Search
    public List<Product> searchByName(String name) {
        return productRepository.findByProductNameContainingIgnoreCase(name);
    }

    // Low stock
    public List<Product> getLowStock(int quantity) {
        return productRepository.findByQuantityLessThan(quantity);
    }

    // Get product
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Product not found"));
    }

    // Update product
    public Product update(Long id, Product updatedProduct) {

        Product existing = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        int oldQty = existing.getQuantity();

        existing.setProductName(updatedProduct.getProductName());
        existing.setPrice(updatedProduct.getPrice());
        existing.setQuantity(updatedProduct.getQuantity());

        Product saved = productRepository.save(existing);

        logService.logAction(
                "PRODUCT_UPDATED",
                saved.getProductId(),
                oldQty,
                saved.getQuantity(),
                "admin"
        );

        return saved;
    }

    // Delete product
    public void delete(Long id) {

        productRepository.deleteById(id);

        logService.logAction(
                "PRODUCT_DELETED",
                id,
                0,
                0,
                "admin"
        );
    }

    // Total inventory value
    public double getTotalInventoryValue() {

        List<Product> products = productRepository.findAll();

        double total = 0;

        for (Product product : products) {
            total += product.getPrice() * product.getQuantity();
        }

        return total;
    }
}