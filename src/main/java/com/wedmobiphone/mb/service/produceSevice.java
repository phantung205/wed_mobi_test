package com.wedmobiphone.mb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.wedmobiphone.mb.DTO.ProduceDTO;
import com.wedmobiphone.mb.entity.Product;
import com.wedmobiphone.mb.reponsitory.productReponsitory;
import com.wedmobiphone.mb.service.imp.productSeviceImp;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class produceSevice implements productSeviceImp {
    @Autowired
    productReponsitory productRepo;


    @Override
    public List<ProduceDTO> getAllProducts() {
       List<Product> products = productRepo.findAll();
       List<ProduceDTO> productDTOs = new ArrayList<>();

       for (Product pdd : products) {
           ProduceDTO dto = new ProduceDTO();
           dto.setId(pdd.getId());
           dto.setName(pdd.getName());
           dto.setDescription(pdd.getDescription());
           dto.setPrice(pdd.getPrice() != null ? pdd.getPrice().doubleValue() : null);
           dto.setImg(pdd.getImage());
           productDTOs.add(dto);
       }

       return productDTOs;
    }

}
