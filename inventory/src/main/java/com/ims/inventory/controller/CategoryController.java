package com.ims.inventory.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.ims.inventory.entity.Category;
import com.ims.inventory.service.CategoryService;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public Category create(@Valid @RequestBody Category category) {
        return categoryService.save(category);
    }

    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/{id}")
    public Category getById(@PathVariable Long id) {
        return categoryService.getById(id);
    }

    @PutMapping("/{id}")
    public Category update(@PathVariable Long id,
                           @Valid @RequestBody Category category) {
        return categoryService.update(id, category);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        categoryService.delete(id);
        return "Category deleted successfully";
    }
}