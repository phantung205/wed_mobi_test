package com.wedmobiphone.mb.reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.wedmobiphone.mb.entity.Product;

@Repository
public interface productReponsitory extends JpaRepository<Product, Integer> {
}