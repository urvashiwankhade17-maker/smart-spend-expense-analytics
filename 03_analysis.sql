USE SmartSpendDB;
SELECT
    SUM(CASE 
        WHEN Transaction_Type = 'Income' THEN Amount 
        ELSE 0 
    END) AS Total_Income,

    SUM(CASE 
        WHEN Transaction_Type = 'Expense' THEN Amount 
        ELSE 0 
    END) AS Total_Expense,

    SUM(CASE 
        WHEN Transaction_Type = 'Income' THEN Amount 
        ELSE -Amount 
    END) AS Net_Balance
FROM transactions;
SELECT
    Category,
    SUM(Amount) AS Total_Expense
FROM transactions
WHERE Transaction_Type = 'Expense'
GROUP BY Category
ORDER BY Total_Expense DESC;
SELECT
    YEAR(Transaction_Date) AS Year,
    MONTH(Transaction_Date) AS Month_Number,
    MONTHNAME(Transaction_Date) AS Month,

    SUM(CASE
        WHEN Transaction_Type = 'Income' THEN Amount
        ELSE 0
    END) AS Total_Income,

    SUM(CASE
        WHEN Transaction_Type = 'Expense' THEN Amount
        ELSE 0
    END) AS Total_Expense

FROM transactions
GROUP BY
    YEAR(Transaction_Date),
    MONTH(Transaction_Date),
    MONTHNAME(Transaction_Date)

ORDER BY
    Year,
    Month_Number;
SELECT
    Payment_Method,
    COUNT(*) AS Transaction_Count,
    SUM(Amount) AS Total_Expense,
    AVG(Amount) AS Average_Transaction
FROM transactions
WHERE Transaction_Type = 'Expense'
GROUP BY Payment_Method
ORDER BY Total_Expense DESC;
SELECT
    Merchant,
    COUNT(*) AS Transaction_Count,
    SUM(Amount) AS Total_Expense,
    AVG(Amount) AS Average_Transaction
FROM transactions
WHERE Transaction_Type = 'Expense'
GROUP BY Merchant
ORDER BY Total_Expense DESC
LIMIT 10;
SELECT
    City,
    COUNT(*) AS Transaction_Count,
    SUM(Amount) AS Total_Expense,
    AVG(Amount) AS Average_Transaction
FROM transactions
WHERE Transaction_Type = 'Expense'
GROUP BY City
ORDER BY Total_Expense DESC;
SELECT
    Category,
    Subcategory,
    COUNT(*) AS Transaction_Count,
    SUM(Amount) AS Total_Expense,
    AVG(Amount) AS Average_Transaction
FROM transactions
WHERE Transaction_Type = 'Expense'
GROUP BY Category, Subcategory
ORDER BY Total_Expense DESC;
SELECT
    Transaction_Type,
    COUNT(*) AS Transaction_Count,
    SUM(Amount) AS Total_Amount,
    AVG(Amount) AS Average_Transaction,
    MIN(Amount) AS Minimum_Transaction,
    MAX(Amount) AS Maximum_Transaction
FROM transactions
GROUP BY Transaction_Type
ORDER BY Total_Amount DESC;
SELECT
    Transaction_ID,
    Transaction_Date,
    Category,
    Subcategory,
    Amount,
    Payment_Method,
    Merchant,
    City
FROM transactions
WHERE Transaction_Type = 'Expense'
ORDER BY Amount DESC
LIMIT 10;
SELECT
    ROUND(
        SUM(CASE
            WHEN Transaction_Type = 'Expense' THEN Amount
            ELSE 0
        END)
        /
        SUM(CASE
            WHEN Transaction_Type = 'Income' THEN Amount
            ELSE 0
        END) * 100,
        2
    ) AS Expense_to_Income_Ratio_Percent
FROM transactions;