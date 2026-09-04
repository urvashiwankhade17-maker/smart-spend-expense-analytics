USE smartspenddb;

CREATE TABLE budgets (
    Budget_ID INT AUTO_INCREMENT PRIMARY KEY,
    Budget_Month DATE NOT NULL,
    Category VARCHAR(100) NOT NULL,
    Budget_Amount DECIMAL(12,2) NOT NULL,
    UNIQUE KEY unique_budget (Budget_Month, Category)
);
SHOW TABLES;
USE smartspenddb;

INSERT INTO budgets
(Budget_Month, Category, Budget_Amount)
VALUES
('2025-01-01', 'Food', 15000),
('2025-01-01', 'Travel', 20000),
('2025-01-01', 'Shopping', 12000),
('2025-01-01', 'Education', 10000),
('2025-01-01', 'Entertainment', 8000),
('2025-02-01', 'Food', 15000),
('2025-02-01', 'Travel', 20000),
('2025-02-01', 'Shopping', 12000),
('2025-02-01', 'Education', 10000),
('2025-02-01', 'Entertainment', 8000);
SELECT * FROM budgets;
USE smartspenddb;

INSERT IGNORE INTO budgets
(Budget_Month, Category, Budget_Amount)

SELECT
    m.Budget_Month,
    c.Category,
    c.Budget_Amount

FROM
(
    SELECT '2025-01-01' AS Budget_Month
    UNION ALL SELECT '2025-02-01'
    UNION ALL SELECT '2025-03-01'
    UNION ALL SELECT '2025-04-01'
    UNION ALL SELECT '2025-05-01'
    UNION ALL SELECT '2025-06-01'
    UNION ALL SELECT '2025-07-01'
    UNION ALL SELECT '2025-08-01'
    UNION ALL SELECT '2025-09-01'
    UNION ALL SELECT '2025-10-01'
    UNION ALL SELECT '2025-11-01'
    UNION ALL SELECT '2025-12-01'
    UNION ALL SELECT '2026-01-01'
    UNION ALL SELECT '2026-02-01'
    UNION ALL SELECT '2026-03-01'
    UNION ALL SELECT '2026-04-01'
    UNION ALL SELECT '2026-05-01'
    UNION ALL SELECT '2026-06-01'
    UNION ALL SELECT '2026-07-01'
    UNION ALL SELECT '2026-08-01'
) m

CROSS JOIN
(
    SELECT 'Education' AS Category, 10000 AS Budget_Amount
    UNION ALL SELECT 'Entertainment', 8000
    UNION ALL SELECT 'Food', 15000
    UNION ALL SELECT 'Shopping', 12000
    UNION ALL SELECT 'Travel', 20000
) c;
SELECT
    DATE_FORMAT(Budget_Month, '%Y-%m') AS Month,
    COUNT(*) AS Categories
FROM budgets
GROUP BY Budget_Month
ORDER BY Budget_Month;
SELECT COUNT(*) AS Total_Budget_Records
FROM budgets;