package com.wedmobiphone.mb.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wedmobiphone.mb.DTO.reviewsDTO;
import com.wedmobiphone.mb.entity.reviews;
import com.wedmobiphone.mb.reponsitory.reviewsReponsitory;
import com.wedmobiphone.mb.service.imp.reviewsSeviceImp;

@Service
public class reviewsSevice implements reviewsSeviceImp {


    @Autowired
    reviewsReponsitory newsletterRepository;

    @Override
    public List<reviewsDTO> getAllNewsletters() {
        List<reviews> newsletters = newsletterRepository.findAll();
        List<reviewsDTO> newsletterDTOs = new ArrayList<>();
        for (reviews newsletter : newsletters) {
            reviewsDTO dto = new reviewsDTO();
            dto.setId(newsletter.getId());
            dto.setUserId(newsletter.getUserId());
            dto.setProductId(newsletter.getProductId());
            dto.setRating(newsletter.getRating());
            dto.setComment(newsletter.getComment());
            dto.setUserImage(newsletter.getUserImage());
            dto.setCreatedAt(newsletter.getCreatedAt());
            newsletterDTOs.add(dto);
        }
        return newsletterDTOs;
    }

}
