package com.wedmobiphone.mb.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id")
    private Integer userId;

    private Integer total;

    @Enumerated(EnumType.STRING)
    private Status status = Status.pending;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum Status { pending, paid, cancelled }

    // getters, setters, constructors
}
