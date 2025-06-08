package com.wedmobiphone.mb.service.imp;

import java.util.List;

import com.wedmobiphone.mb.DTO.ProduceDTO;

public interface productSeviceImp {
    List<ProduceDTO> getAllProducts();
    List<ProduceDTO> addProducts(List<ProduceDTO> products);
    void deleteProduct(Integer id);
}