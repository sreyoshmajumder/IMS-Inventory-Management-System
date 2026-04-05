package com.ims.inventory.controller;

import com.ims.inventory.entity.Product;
import com.ims.inventory.entity.Order;
import com.ims.inventory.repository.ProductRepository;
import com.ims.inventory.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/smart")
@CrossOrigin(origins = "http://localhost:3000")
public class SmartAssistantController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/low-stock-predictions")
    public List<Map<String, Object>> getLowStockPredictions() {
        List<Product> products = productRepository.findAll();
        List<Order> orders = orderRepository.findAll();
        List<Map<String, Object>> predictions = new ArrayList<>();

        for (Product p : products) {
            long orderCount = orders.stream()
                .filter(o -> o.getProductId() != null && o.getProductId().equals(p.getProductId()))
                .count();
            int totalOrdered = orders.stream()
                .filter(o -> o.getProductId() != null && o.getProductId().equals(p.getProductId()))
                .mapToInt(o -> o.getQuantity() != null ? o.getQuantity() : 0)
                .sum();

            int avgOrderQty = orderCount > 0 ? (int)(totalOrdered / orderCount) : 0;
            int reorderSuggestion = Math.max(avgOrderQty * 2, 10);
            int daysUntilStockout = avgOrderQty > 0 ? (p.getQuantity() / avgOrderQty) * 7 : 999;

            if (p.getQuantity() < 20 || daysUntilStockout < 30) {
                Map<String, Object> item = new HashMap<>();
                item.put("productId", p.getProductId());
                item.put("productName", p.getProductName());
                item.put("currentStock", p.getQuantity());
                item.put("avgOrderQty", avgOrderQty);
                item.put("reorderSuggestion", reorderSuggestion);
                item.put("daysUntilStockout", daysUntilStockout == 999 ? "N/A" : daysUntilStockout);
                item.put("urgency", p.getQuantity() < 5 ? "CRITICAL" : p.getQuantity() < 15 ? "HIGH" : "MEDIUM");
                predictions.add(item);
            }
        }
        predictions.sort((a, b) -> (int) a.get("currentStock") - (int) b.get("currentStock"));
        return predictions;
    }

    @GetMapping("/dead-stock")
    public List<Map<String, Object>> getDeadStock() {
        List<Product> products = productRepository.findAll();
        List<Order> orders = orderRepository.findAll();
        List<Map<String, Object>> deadStock = new ArrayList<>();

        for (Product p : products) {
            long orderCount = orders.stream()
                .filter(o -> o.getProductId() != null && o.getProductId().equals(p.getProductId()))
                .count();

            if (orderCount == 0 && p.getQuantity() > 0) {
                Map<String, Object> item = new HashMap<>();
                item.put("productId", p.getProductId());
                item.put("productName", p.getProductName());
                item.put("currentStock", p.getQuantity());
                item.put("price", p.getPrice());
                item.put("totalValue", p.getPrice() * p.getQuantity());
                item.put("recommendation", "Consider discounting or removing this product");
                deadStock.add(item);
            }
        }
        return deadStock;
    }

    @GetMapping("/demand-analysis")
    public List<Map<String, Object>> getDemandAnalysis() {
        List<Product> products = productRepository.findAll();
        List<Order> orders = orderRepository.findAll();
        List<Map<String, Object>> analysis = new ArrayList<>();

        for (Product p : products) {
            List<Order> productOrders = orders.stream()
                .filter(o -> o.getProductId() != null && o.getProductId().equals(p.getProductId()))
                .collect(Collectors.toList());

            int totalOrdered = productOrders.stream()
                .mapToInt(o -> o.getQuantity() != null ? o.getQuantity() : 0).sum();

            if (!productOrders.isEmpty()) {
                Map<String, Object> item = new HashMap<>();
                item.put("productId", p.getProductId());
                item.put("productName", p.getProductName());
                item.put("totalOrders", productOrders.size());
                item.put("totalQuantityOrdered", totalOrdered);
                item.put("currentStock", p.getQuantity());
                item.put("demandLevel", totalOrdered > 50 ? "HIGH" : totalOrdered > 20 ? "MEDIUM" : "LOW");
                analysis.add(item);
            }
        }
        analysis.sort((a, b) -> (int) b.get("totalQuantityOrdered") - (int) a.get("totalQuantityOrdered"));
        return analysis;
    }

    @GetMapping("/alerts")
    public Map<String, Object> getAlerts() {
        List<Product> products = productRepository.findAll();
        List<Order> orders = orderRepository.findAll();

        long criticalStock = products.stream().filter(p -> p.getQuantity() < 5).count();
        long lowStock = products.stream().filter(p -> p.getQuantity() >= 5 && p.getQuantity() < 15).count();
        long deadStock = products.stream().filter(p -> {
            long orderCount = orders.stream()
                .filter(o -> o.getProductId() != null && o.getProductId().equals(p.getProductId()))
                .count();
            return orderCount == 0 && p.getQuantity() > 0;
        }).count();
        double totalValue = products.stream()
            .mapToDouble(p -> p.getPrice() != null && p.getQuantity() != null
                ? p.getPrice() * p.getQuantity() : 0)
            .sum();

        Map<String, Object> alerts = new HashMap<>();
        alerts.put("criticalStockCount", criticalStock);
        alerts.put("lowStockCount", lowStock);
        alerts.put("deadStockCount", deadStock);
        alerts.put("totalInventoryValue", totalValue);
        alerts.put("totalProducts", products.size());
        return alerts;
    }
}