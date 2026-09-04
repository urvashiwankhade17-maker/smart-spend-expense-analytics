from flask import Flask, render_template, request, redirect, url_for, jsonify

from analytics import (
    get_financial_summary,
    get_monthly_financial_data,
    get_category_expenses,
    get_transactions,
    get_categories,
    get_months,
    get_budget_vs_actual
)
from insights import generate_insights

# =====================================================
# FLASK APPLICATION
# =====================================================

app = Flask(__name__)

app.secret_key = "smart-spend-development-key"


# =====================================================
# LOGIN PAGE
# =====================================================

@app.route("/")
def login():

    return render_template("login.html")


# =====================================================
# LOGIN PROCESS
# =====================================================

@app.route("/login", methods=["POST"])
def login_user():

    username = request.form.get("username", "").strip()
    password = request.form.get("password", "").strip()

    if username == "admin" and password == "admin123":

        print("LOGIN SUCCESSFUL")

        return redirect(url_for("dashboard"))

    return """
    <h2>Invalid Username or Password</h2>
    <a href="/">Back to Login</a>
    """


# =====================================================
# DASHBOARD
# =====================================================

@app.route("/dashboard")
def dashboard():

    try:

        financial_summary = get_financial_summary()

    except Exception as e:

        print("Dashboard Error:", e)

        financial_summary = {
            "Total_Income": 0,
            "Total_Expense": 0,
            "Net_Balance": 0
        }

    return render_template(
        "dashboard.html",
        financial_summary=financial_summary
    )


# =====================================================
# DASHBOARD API
# =====================================================

@app.route("/api/dashboard")
def dashboard_api():

    try:

        category = request.args.get("category")
        month = request.args.get("month")


        # ---------------------------------------------
        # FINANCIAL SUMMARY
        # ---------------------------------------------

        financial_summary = get_financial_summary()


        # ---------------------------------------------
        # MONTHLY DATA
        # ---------------------------------------------

        monthly_data = get_monthly_financial_data()


        # ---------------------------------------------
        # CATEGORY DATA
        # ---------------------------------------------

        category_data = get_category_expenses()


        # ---------------------------------------------
        # TRANSACTIONS
        # ---------------------------------------------

        transactions = get_transactions(
            category=category,
            month=month
        )


        # ---------------------------------------------
        # FILTER OPTIONS
        # ---------------------------------------------

        categories = get_categories()

        months = get_months()


        # ---------------------------------------------
        # RESPONSE
        # ---------------------------------------------

        return jsonify({

            "financial_summary": financial_summary,

            "monthly_data": monthly_data,

            "category_data": category_data,

            "transactions": transactions,

            "categories": categories,

            "months": months

        })


    except Exception as e:

        print("API Error:", e)

        return jsonify({

            "error": str(e)

        }), 500
# =====================================================
# BUDGET VS ACTUAL API
# =====================================================

@app.route("/api/budget-vs-actual")
def budget_vs_actual():

    try:

        data = get_budget_vs_actual()

        return jsonify({

            "budget_vs_actual": data

        })

    except Exception as e:

        print("Budget API Error:", e)

        return jsonify({

            "error": str(e)

        }), 500
# =====================================================
# SMART INSIGHTS API
# =====================================================

@app.route("/api/insights")
def insights_api():

    try:

        insights = generate_insights()

        return jsonify(insights)

    except Exception as e:

        print("Insights API Error:", e)

        return jsonify({
            "error": str(e)
        }), 500
# =====================================================
# LOGOUT
# =====================================================

@app.route("/logout")
def logout():

    return redirect(url_for("login"))


# =====================================================
# HEALTH CHECK
# =====================================================

@app.route("/health")
def health():

    return {

        "status": "Smart Spend application is running",

        "database": "MySQL"

    }


# =====================================================
# START APPLICATION
# =====================================================

if __name__ == "__main__":

    print("")
    print("========================================")
    print("       SMART SPEND APPLICATION")
    print("========================================")
    print("Login URL : http://127.0.0.1:5000")
    print("Username  : admin")
    print("Password  : admin123")
    print("========================================")
    print("")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )