package com.wedmobiphone.mb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wedmobiphone.mb.payload.responceData;
import com.wedmobiphone.mb.service.imp.productSeviceImp;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;



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
         return  new ResponseEntity<>(respondata, HttpStatus.OK);
    }
    

}
