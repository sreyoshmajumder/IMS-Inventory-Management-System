package com.ims.inventory.service;

import com.ims.inventory.entity.Category;
import com.ims.inventory.entity.Product;
import com.ims.inventory.entity.Supplier;
import com.ims.inventory.repository.CategoryRepository;
import com.ims.inventory.repository.ProductRepository;
import com.ims.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryLogService logService;

    // View all products
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    // View product by ID
    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    // Add product
    public Product create(Product product) {
        Category category = null;
        Supplier supplier = null;

        if (product.getCategory() != null && product.getCategory().getCategoryId() != null) {
            category = categoryRepository.findById(product.getCategory().getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        if (product.getSupplier() != null && product.getSupplier().getSupplierId() != null) {
            supplier = supplierRepository.findById(product.getSupplier().getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Supplier not found"));
        }

        product.setCategory(category);
        product.setSupplier(supplier);

        if (product.getQuantity() == null) {
            product.setQuantity(0);
        }

        Product saved = productRepository.save(product);

        logService.log(
                "PRODUCT_CREATED",
                saved.getProductId(),
                0,
                saved.getQuantity()
        );

        return saved;
    }

    // Update product
    public Product update(Long id, Product updatedProduct) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        Integer oldQty = existing.getQuantity();

        existing.setProductName(updatedProduct.getProductName());
        existing.setPrice(updatedProduct.getPrice());
        existing.setQuantity(updatedProduct.getQuantity());

        if (updatedProduct.getCategory() != null && updatedProduct.getCategory().getCategoryId() != null) {
            Category category = categoryRepository.findById(updatedProduct.getCategory().getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            existing.setCategory(category);
        } else {
            existing.setCategory(null);
        }

        if (updatedProduct.getSupplier() != null && updatedProduct.getSupplier().getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(updatedProduct.getSupplier().getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Supplier not found"));
            existing.setSupplier(supplier);
        } else {
            existing.setSupplier(null);
        }

        Product saved = productRepository.save(existing);

        logService.log(
                "PRODUCT_UPDATED",
                saved.getProductId(),
                oldQty,
                saved.getQuantity()
        );

        return saved;
    }

    // Delete product
    public void delete(Long id) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        Integer oldQty = existing.getQuantity();
        Long productId = existing.getProductId();

        productRepository.delete(existing);

        logService.log(
                "PRODUCT_DELETED",
                productId,
                oldQty,
                0
        );
    }

    // Search by product name
    public List<Product> searchByName(String name) {
        return productRepository.findByProductNameContainingIgnoreCase(name);
    }

    // Filter low stock
    public List<Product> getLowStockProducts(Integer quantity) {
        return productRepository.findByQuantityLessThan(quantity);
    }

    // Add stock
    public Product addStock(Long id, Integer quantityToAdd) {
        if (quantityToAdd == null || quantityToAdd <= 0) {
            throw new RuntimeException("Quantity to add must be greater than 0");
        }

        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        Integer oldQty = existing.getQuantity() == null ? 0 : existing.getQuantity();
        existing.setQuantity(oldQty + quantityToAdd);

        Product saved = productRepository.save(existing);

        logService.log(
                "STOCK_ADDED",
                saved.getProductId(),
                oldQty,
                saved.getQuantity()
        );

        return saved;
    }

    // Reduce stock
    public Product reduceStock(Long id, Integer quantityToReduce) {
        if (quantityToReduce == null || quantityToReduce <= 0) {
            throw new RuntimeException("Quantity to reduce must be greater than 0");
        }

        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        Integer oldQty = existing.getQuantity() == null ? 0 : existing.getQuantity();

        if (oldQty < quantityToReduce) {
            throw new RuntimeException("Insufficient stock available");
        }

        existing.setQuantity(oldQty - quantityToReduce);

        Product saved = productRepository.save(existing);

        logService.log(
                "STOCK_REDUCED",
                saved.getProductId(),
                oldQty,
                saved.getQuantity()
        );

        return saved;
    }

    // Filter by price range
    public List<Product> getByPriceRange(Double min, Double max) {
        return productRepository.findByPriceBetween(min, max);
    }

    // Inventory value report
    public Double getTotalInventoryValue() {
        return productRepository.findAll()
                .stream()
                .mapToDouble(p -> {
                    double price = p.getPrice() == null ? 0.0 : p.getPrice();
                    int qty = p.getQuantity() == null ? 0 : p.getQuantity();
                    return price * qty;
                })
                .sum();
    }
}