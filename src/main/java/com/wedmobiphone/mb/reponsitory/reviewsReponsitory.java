package com.wedmobiphone.mb.reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wedmobiphone.mb.entity.reviews;

@Repository
public interface reviewsReponsitory extends JpaRepository<reviews,Integer>{
    
}
