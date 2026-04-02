package com.ims.inventory.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import com.ims.inventory.entity.Order;
import com.ims.inventory.entity.Product;
import com.ims.inventory.repository.OrderRepository;
import com.ims.inventory.repository.ProductRepository;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    // CREATE ORDER
    public Order createOrder(Order orderRequest) {

        // Fetch product using productId
        Product existingProduct = productRepository.findById(orderRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check stock availability
        if (existingProduct.getQuantity() < orderRequest.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }

        // Reduce stock
        existingProduct.setQuantity(
                existingProduct.getQuantity() - orderRequest.getQuantity()
        );

        productRepository.save(existingProduct);

        // Create order
        Order order = new Order();
        order.setProductId(orderRequest.getProductId());
        order.setQuantity(orderRequest.getQuantity());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("CREATED");

        return orderRepository.save(order);
    }

    // GET ALL ORDERS
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // GET ORDER BY ID
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // UPDATE ORDER
    public Order updateOrder(Long id, Order updatedOrder) {

        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        existing.setQuantity(updatedOrder.getQuantity());
        existing.setStatus(updatedOrder.getStatus());

        return orderRepository.save(existing);
    }

    // DELETE ORDER
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}