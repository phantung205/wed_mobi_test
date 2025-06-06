package com.wedmobiphone.mb.payload;

public class responceData {
     private String status;
    private Boolean isSuccessfull= true;
    private String desc;
    private Object data;

    public Boolean getSuccessfull() {
        return isSuccessfull;
    }

    public void setSuccessfull(Boolean successfull) {
        isSuccessfull = successfull;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
