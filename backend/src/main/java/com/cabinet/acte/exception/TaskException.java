package com.cabinet.acte.exception;

public class TaskException extends RuntimeException {

    private String errorCode;

    public TaskException(String message) {
        super(message);
    }

    public TaskException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public TaskException(String message, Throwable cause) {
        super(message, cause);
    }

    public TaskException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
}
