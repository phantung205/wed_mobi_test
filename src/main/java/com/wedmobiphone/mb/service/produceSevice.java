package com.wedmobiphone.mb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.wedmobiphone.mb.DTO.ProduceDTO;
import com.wedmobiphone.mb.entity.Product;
import com.wedmobiphone.mb.reponsitory.productReponsitory;
import com.wedmobiphone.mb.service.imp.productSeviceImp;

import java.time.LocalDateTime;
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
           dto.setCategory(pdd.getCategory());
           productDTOs.add(dto);
       }

       return productDTOs;
    }

    @Override
    public List<ProduceDTO> addProducts(List<ProduceDTO> productDTOs) {
        List<Product> products = new ArrayList<>();
        
        for (ProduceDTO dto : productDTOs) {
            Product product = new Product();
            product.setName(dto.getName());
            product.setDescription(dto.getDescription());
            product.setPrice(dto.getPrice() != null ? dto.getPrice().intValue() : 0);
            product.setImage(dto.getImg());
            product.setCategory(dto.getCategory());
            product.setCreatedAt(LocalDateTime.now());
            products.add(product);
        }
        
        List<Product> savedProducts = productRepo.saveAll(products);
        List<ProduceDTO> savedDTOs = new ArrayList<>();
        
        for (Product product : savedProducts) {
            ProduceDTO dto = new ProduceDTO();
            dto.setId(product.getId());
            dto.setName(product.getName());
            dto.setDescription(product.getDescription());
            dto.setPrice(product.getPrice() != null ? product.getPrice().doubleValue() : null);
            dto.setImg(product.getImage());
            dto.setCategory(product.getCategory());
            savedDTOs.add(dto);
        }
        
        return savedDTOs;
    }

    @Override
    public void deleteProduct(Integer id) {
        if (!productRepo.existsById(id)) {
            throw new RuntimeException("Không tìm thấy sản phẩm với ID: " + id);
        }
        productRepo.deleteById(id);
    }
}
