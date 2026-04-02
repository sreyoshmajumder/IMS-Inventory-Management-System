package com.ims.inventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long supplierId;

    @NotBlank(message = "Supplier name cannot be empty")
    private String supplierName;

    @NotBlank(message = "Contact information cannot be empty")
    private String contactInfo;

    // One supplier can supply many products
    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL)
    private List<Product> products;
}