CREATE DATABASE SmartSpendDB;

USE SmartSpendDB;
USE SmartSpendDB;

CREATE TABLE transactions (
    Transaction_ID VARCHAR(20) PRIMARY KEY,
    Transaction_Date DATE NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Subcategory VARCHAR(50) NOT NULL,
    Description VARCHAR(150),
    Amount DECIMAL(12,2) NOT NULL,
    Transaction_Type VARCHAR(20) NOT NULL,
    Payment_Method VARCHAR(30),
    Merchant VARCHAR(100),
    City VARCHAR(50)
);
SHOW TABLES;