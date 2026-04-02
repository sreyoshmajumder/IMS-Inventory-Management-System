package com.ims.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ims.inventory.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}