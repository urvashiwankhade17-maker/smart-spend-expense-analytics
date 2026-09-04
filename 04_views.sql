USE SmartSpendDB;

CREATE OR REPLACE VIEW vw_financial_summary AS
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
SELECT * FROM vw_financial_summary;
CREATE OR REPLACE VIEW vw_category_expenses AS
SELECT
    Category,
    COUNT(*) AS Transaction_Count,
    SUM(Amount) AS Total_Expense,
    AVG(Amount) AS Average_Transaction
FROM transactions
WHERE Transaction_Type = 'Expense'
GROUP BY Category
ORDER BY Total_Expense DESC;
SELECT * FROM vw_category_expenses;
CREATE OR REPLACE VIEW vw_monthly_trend AS
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
    SELECT * FROM vw_monthly_trend;
    CREATE OR REPLACE VIEW vw_payment_analysis AS
SELECT
    Payment_Method,
    COUNT(*) AS Transaction_Count,
    SUM(Amount) AS Total_Expense,
    AVG(Amount) AS Average_Transaction
FROM transactions
WHERE Transaction_Type = 'Expense'
GROUP BY Payment_Method
ORDER BY Total_Expense DESC;
SELECT * FROM vw_payment_analysis;
CREATE OR REPLACE VIEW vw_merchant_analysis AS
SELECT
    Merchant,
    COUNT(*) AS Transaction_Count,
    SUM(Amount) AS Total_Expense,
    AVG(Amount) AS Average_Transaction
FROM transactions
WHERE Transaction_Type = 'Expense'
GROUP BY Merchant
ORDER BY Total_Expense DESC;
SELECT * 
FROM vw_merchant_analysis
LIMIT 10;
CREATE OR REPLACE VIEW vw_city_analysis AS
SELECT
    City,
    COUNT(*) AS Transaction_Count,
    SUM(Amount) AS Total_Expense,
    AVG(Amount) AS Average_Transaction
FROM transactions
WHERE Transaction_Type = 'Expense'
GROUP BY City
ORDER BY Total_Expense DESC;
SELECT *
FROM vw_city_analysis;
CREATE OR REPLACE VIEW vw_subcategory_analysis AS
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
SELECT *
FROM vw_subcategory_analysis;