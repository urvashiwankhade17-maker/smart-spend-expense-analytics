from database import get_db_connection


# =====================================================
# FINANCIAL SUMMARY
# =====================================================

def get_financial_summary():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            Total_Income,
            Total_Expense,
            Net_Balance
        FROM vw_financial_summary
    """)

    result = cursor.fetchone()

    cursor.close()
    connection.close()

    return result


# =====================================================
# MONTHLY FINANCIAL TREND
# =====================================================

def get_monthly_financial_data():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            DATE_FORMAT(Transaction_Date, '%Y-%m') AS Month,

            SUM(
                CASE
                    WHEN Transaction_Type = 'Income'
                    THEN Amount
                    ELSE 0
                END
            ) AS Income,

            SUM(
                CASE
                    WHEN Transaction_Type = 'Expense'
                    THEN Amount
                    ELSE 0
                END
            ) AS Expense

        FROM transactions

        GROUP BY
            DATE_FORMAT(Transaction_Date, '%Y-%m')

        ORDER BY Month
    """)

    result = cursor.fetchall()

    cursor.close()
    connection.close()

    return result


# =====================================================
# CATEGORY EXPENSE ANALYSIS
# =====================================================

def get_category_expenses():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            Category,
            COUNT(*) AS Transaction_Count,
            SUM(Amount) AS Total_Expense,
            AVG(Amount) AS Average_Transaction

        FROM transactions

        WHERE Transaction_Type = 'Expense'

        GROUP BY Category

        ORDER BY Total_Expense DESC
    """)

    result = cursor.fetchall()

    cursor.close()
    connection.close()

    return result


# =====================================================
# TRANSACTION ANALYSIS
# =====================================================

def get_transactions(category=None, month=None):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            DATE_FORMAT(Transaction_Date, '%Y-%m-%d')
                AS Transaction_Date,

            Transaction_ID,

            Category,

            Subcategory,

            Description,

            Amount,

            Transaction_Type,

            Payment_Method,

            Merchant,

            City

        FROM transactions

        WHERE 1 = 1
    """

    parameters = []


    # -------------------------------------------------
    # CATEGORY FILTER
    # -------------------------------------------------

    if category:

        query += """
            AND Category = %s
        """

        parameters.append(category)


    # -------------------------------------------------
    # MONTH FILTER
    # -------------------------------------------------

    if month:

        query += """
            AND DATE_FORMAT(
                Transaction_Date,
                '%Y-%m'
            ) = %s
        """

        parameters.append(month)


    # -------------------------------------------------
    # ORDER
    # -------------------------------------------------

    query += """
        ORDER BY Transaction_Date DESC
    """


    cursor.execute(
        query,
        parameters
    )

    result = cursor.fetchall()

    cursor.close()
    connection.close()

    return result


# =====================================================
# CATEGORY LIST
# =====================================================

def get_categories():

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT DISTINCT
            Category

        FROM transactions

        WHERE Category IS NOT NULL

        ORDER BY Category
    """)

    result = [
        row[0]
        for row in cursor.fetchall()
    ]

    cursor.close()
    connection.close()

    return result


# =====================================================
# MONTH LIST
# =====================================================

def get_months():

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT DISTINCT

            DATE_FORMAT(
                Transaction_Date,
                '%Y-%m'
            ) AS Month

        FROM transactions

        WHERE Transaction_Date IS NOT NULL

        ORDER BY Month DESC
    """)

    result = [
        row[0]
        for row in cursor.fetchall()
    ]

    cursor.close()
    connection.close()

    return result
def get_budget_vs_actual():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            DATE_FORMAT(b.Budget_Month, '%Y-%m') AS Month,
            b.Category,
            b.Budget_Amount AS Budget,
            COALESCE(
                SUM(
                    CASE
                        WHEN t.Transaction_Type = 'Expense'
                        THEN t.Amount
                        ELSE 0
                    END
                ), 0
            ) AS Actual,
            b.Budget_Amount -
            COALESCE(
                SUM(
                    CASE
                        WHEN t.Transaction_Type = 'Expense'
                        THEN t.Amount
                        ELSE 0
                    END
                ), 0
            ) AS Variance
        FROM budgets b
        LEFT JOIN transactions t
            ON b.Category = t.Category
            AND DATE_FORMAT(t.Transaction_Date, '%Y-%m')
                = DATE_FORMAT(b.Budget_Month, '%Y-%m')
        GROUP BY
            b.Budget_Month,
            b.Category,
            b.Budget_Amount
        ORDER BY
            b.Budget_Month,
            b.Category
    """

    cursor.execute(query)
    result = cursor.fetchall()

    cursor.close()
    connection.close()

    return result
