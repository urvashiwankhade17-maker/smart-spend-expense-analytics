from database import get_db_connection


def generate_insights():

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            COALESCE(SUM(
                CASE
                    WHEN Transaction_Type = 'Expense'
                    THEN Amount
                    ELSE 0
                END
            ), 0) AS total_expense,

            COALESCE(SUM(
                CASE
                    WHEN Transaction_Type = 'Income'
                    THEN Amount
                    ELSE 0
                END
            ), 0) AS total_income,

            COUNT(*) AS total_transactions

        FROM transactions
    """

    cursor.execute(query)

    result = cursor.fetchone()

    cursor.close()
    connection.close()

    total_expense = float(result["total_expense"] or 0)
    total_income = float(result["total_income"] or 0)
    total_transactions = int(result["total_transactions"] or 0)

    # -----------------------------------------
    # SPENDING INSIGHT
    # -----------------------------------------

    if total_income > 0:

        expense_ratio = (total_expense / total_income) * 100

    else:

        expense_ratio = 0


    if expense_ratio > 80:

        spending_insight = (
            f"Your expenses are {expense_ratio:.1f}% of your income. "
            "Consider reducing discretionary spending."
        )

    elif expense_ratio > 60:

        spending_insight = (
            f"Your expenses are {expense_ratio:.1f}% of your income. "
            "Your spending is moderate but should be monitored."
        )

    else:

        spending_insight = (
            f"Your expenses are {expense_ratio:.1f}% of your income. "
            "Your spending level is under control."
        )


    # -----------------------------------------
    # FINANCIAL HEALTH
    # -----------------------------------------

    net_balance = total_income - total_expense


    if net_balance > 0:

        health = "Positive"

        health_insight = (
            f"Your current net financial position is "
            f"₹{net_balance:,.2f}. Your income is higher than your expenses."
        )

    else:

        health = "Needs Attention"

        health_insight = (
            f"Your current net financial position is "
            f"₹{net_balance:,.2f}. Your expenses are higher than your income."
        )


    # -----------------------------------------
    # RECOMMENDATION
    # -----------------------------------------

    if expense_ratio > 80:

        recommendation = (
            "Review high-value expenses and set stricter monthly budgets."
        )

    elif expense_ratio > 60:

        recommendation = (
            "Continue tracking your spending and focus on saving consistently."
        )

    else:

        recommendation = (
            "Maintain your current spending discipline and increase savings."
        )


    return {

        "spending_insight": spending_insight,

        "health_insight": health_insight,

        "recommendation": recommendation,

        "health": health,

        "total_expense": total_expense,

        "total_income": total_income,

        "net_balance": net_balance,

        "total_transactions": total_transactions

    }