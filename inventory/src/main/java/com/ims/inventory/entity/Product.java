package com.ims.inventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import jakarta.persistence.Column;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.ims.inventory.entity.Category;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @NotBlank(message = "Product name cannot be empty")
    private String productName;

    @NotNull(message = "Price cannot be null")
    @Min(value = 1, message = "Price must be greater than 0")
    private Double price;

    @NotNull(message = "Quantity cannot be null")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    @JsonIgnore
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnore
    private Category category;

    
}