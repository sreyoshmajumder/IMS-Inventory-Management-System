package com.ims.inventory.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    private String action;

    private Long productId;

    private Integer oldQuantity;

    private Integer newQuantity;

    private String performedBy;

    private LocalDateTime timestamp;
}