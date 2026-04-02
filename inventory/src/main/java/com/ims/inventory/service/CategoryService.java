package com.ims.inventory.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.ims.inventory.entity.Category;
import com.ims.inventory.repository.CategoryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public Category update(Long id, Category updatedCategory) {
        Category existing = getById(id);
        existing.setCategoryName(updatedCategory.getCategoryName());
        return categoryRepository.save(existing);
    }

    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }
}