package com.wedmobiphone.mb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wedmobiphone.mb.payload.responceData;
import com.wedmobiphone.mb.service.imp.reviewsSeviceImp;

@RestController
@RequestMapping("/reviews")
@CrossOrigin("*")
public class reviewsController {
    @Autowired
    reviewsSeviceImp newsletterSeviceImp;

    @GetMapping("GetReviews")
    public ResponseEntity<?> getAllNewsletters() {
        responceData respondata = new responceData();
        respondata.setData(newsletterSeviceImp.getAllNewsletters());
        return new ResponseEntity<>(respondata, HttpStatus.OK);
    }

}
