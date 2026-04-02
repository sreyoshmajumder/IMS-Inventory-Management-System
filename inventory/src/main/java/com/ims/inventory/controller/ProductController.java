package com.ims.inventory.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import com.ims.inventory.entity.Product;
import com.ims.inventory.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public Product create(@Valid @RequestBody Product product) {
        return productService.save(product);
    }

    @GetMapping
    public List<Product> getAll() {
        return productService.getAll();
    }
    
    @GetMapping("/total-value")
    public double getTotalInventoryValue() {
        return productService.getTotalInventoryValue();
    }
    
    @PutMapping("/{id}/add-stock")
    public Product addStock(@PathVariable Long id,
                        @RequestParam int quantity) {
        return productService.addStock(id, quantity);
    }

    @PutMapping("/{id}/reduce-stock")
    public Product reduceStock(
        @PathVariable Long id,
        @RequestParam int quantity) {

      return productService.reduceStock(id, quantity);
    }

    @GetMapping("/paginated")
    public Page<Product> getPaginatedProducts(
        @RequestParam int page,
        @RequestParam int size,
        @RequestParam String sortBy,
        @RequestParam String direction) {

      Sort sort = direction.equalsIgnoreCase("asc") ?
            Sort.by(sortBy).ascending() :
            Sort.by(sortBy).descending();

      Pageable pageable = PageRequest.of(page, size, sort);

      return productService.getPaginated(pageable);
    }

    @GetMapping("/price-range")
    public List<Product> getByPriceRange(
        @RequestParam double min,
        @RequestParam double max) {
      return productService.getByPriceRange(min, max);
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam String name) {
        return productService.searchByName(name);
    }

    @GetMapping("/low-stock")
    public List<Product> getLowStock(@RequestParam int quantity) {
        return productService.getLowStock(quantity);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        return productService.update(id, product);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        productService.delete(id);
        return "Deleted Successfully";
    }
}