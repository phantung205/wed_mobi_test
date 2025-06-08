package com.wedmobiphone.mb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wedmobiphone.mb.payload.responceData;
import com.wedmobiphone.mb.service.imp.productSeviceImp;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import com.wedmobiphone.mb.DTO.ProduceDTO;

@RestController
@RequestMapping("/produce")
@CrossOrigin(origins = "*") 
public class ProduceController {
    @Autowired
    productSeviceImp productSeviceImp;

    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts() {
        responceData respondata = new responceData();
        respondata.setData(productSeviceImp.getAllProducts());
        return new ResponseEntity<>(respondata, HttpStatus.OK);
    }

    @PostMapping("/products")
    public ResponseEntity<?> addProducts(@RequestBody List<ProduceDTO> products) {
        responceData respondata = new responceData();
        respondata.setData(productSeviceImp.addProducts(products));
        return new ResponseEntity<>(respondata, HttpStatus.CREATED);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id) {
        try {
            productSeviceImp.deleteProduct(id);
            responceData respondata = new responceData();
            respondata.setData("Xóa sản phẩm thành công");
            return new ResponseEntity<>(respondata, HttpStatus.OK);
        } catch (RuntimeException e) {
            responceData respondata = new responceData();
            respondata.setData(e.getMessage());
            return new ResponseEntity<>(respondata, HttpStatus.NOT_FOUND);
        }
    }
}
