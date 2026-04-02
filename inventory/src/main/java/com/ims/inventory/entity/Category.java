package com.ims.inventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @NotBlank(message = "Category name cannot be empty")
    @Column(unique = true)
    private String categoryName;

    // One Category → Many Products
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Product> products;
}