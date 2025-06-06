package com.wedmobiphone.mb.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/App")
public class conttroller {
    
    @GetMapping("")
    public String index(){
        return "hello";
    }
    
}
