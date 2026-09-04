USE SmartSpendDB;
SELECT Transaction_ID, COUNT(*) AS duplicate_count
FROM transactions
GROUP BY Transaction_ID
HAVING COUNT(*) > 1;
SELECT
    COUNT(*) AS Total_Rows,
    SUM(Transaction_ID IS NULL) AS Missing_ID,
    SUM(Transaction_Date IS NULL) AS Missing_Date,
    SUM(Category IS NULL) AS Missing_Category,
    SUM(Amount IS NULL) AS Missing_Amount,
    SUM(Transaction_Type IS NULL) AS Missing_Type
FROM transactions;
SELECT Transaction_Type, COUNT(*) AS Transaction_Count
FROM transactions
GROUP BY Transaction_Type;