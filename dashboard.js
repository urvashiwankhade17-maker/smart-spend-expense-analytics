// ============================================================
// SMART SPEND - DASHBOARD JAVASCRIPT
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Smart Spend Dashboard JS Loaded");

    // --------------------------------------------------------
    // NAVIGATION
    // --------------------------------------------------------

    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".dashboard-section");

    function showSection(sectionId) {

        sections.forEach(section => {
            section.style.display = "none";
        });

        const selectedSection = document.getElementById(sectionId);

        if (selectedSection) {
            selectedSection.style.display = "block";
        }

        navLinks.forEach(link => {
            link.classList.remove("active");
        });

        const activeLink = document.querySelector(
            `.nav-link[data-section="${sectionId}"]`
        );

        if (activeLink) {
            activeLink.classList.add("active");
        }
    }

    navLinks.forEach(link => {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            const sectionId = this.getAttribute("data-section");

            if (sectionId) {

                window.location.hash = sectionId;

                showSection(sectionId);

            }

        });

    });


    // --------------------------------------------------------
    // INITIAL SECTION
    // --------------------------------------------------------

    const initialSection =
        window.location.hash.replace("#", "") || "overview";

    showSection(initialSection);


    // --------------------------------------------------------
    // GLOBAL DATA
    // --------------------------------------------------------

    let dashboardData = null;


    // --------------------------------------------------------
    // CHART VARIABLES
    // --------------------------------------------------------

    let monthlyChart = null;
    let categoryChart = null;
    let transactionChart = null;


    // --------------------------------------------------------
    // LOAD DASHBOARD DATA
    // --------------------------------------------------------

    async function loadDashboardData() {

        try {

            console.log("Loading dashboard data...");

            const response = await fetch("/api/dashboard");

            if (!response.ok) {
                throw new Error(
                    "API request failed: " + response.status
                );
            }

            dashboardData = await response.json();

            console.log("Dashboard data loaded:", dashboardData);

            populateFilters();

            renderTransactions();

            renderCategoryChart();

            renderMonthlyChart();

            renderTransactionChart();

            renderCategorySummary();

            renderInsights();

        }

        catch (error) {

            console.error(
                "Dashboard data error:",
                error
            );

            const tableBody =
                document.getElementById(
                    "transactionTableBody"
                );

            if (tableBody) {

                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7"
                            style="text-align:center;
                                   padding:30px;
                                   color:#dc2626;">
                            Unable to load transaction data.
                        </td>
                    </tr>
                `;

            }

        }

    }


    // --------------------------------------------------------
    // POPULATE FILTER DROPDOWNS
    // --------------------------------------------------------

    function populateFilters() {

        if (!dashboardData) {
            return;
        }

        const categoryFilter =
            document.getElementById("categoryFilter");

        const monthFilter =
            document.getElementById("monthFilter");


        // ----------------------------------------------------
        // CATEGORY FILTER
        // ----------------------------------------------------

        if (categoryFilter) {

            const currentValue =
                categoryFilter.value;

            categoryFilter.innerHTML =
                `<option value="">All Categories</option>`;

            let categories = [];

            if (Array.isArray(dashboardData.categories)) {

                categories =
                    dashboardData.categories;

            }
            else if (
                Array.isArray(dashboardData.category_data)
            ) {

                categories =
                    dashboardData.category_data
                        .map(item => item.Category)
                        .filter(Boolean);

            }

            categories =
                [...new Set(categories)]
                    .sort();

            categories.forEach(category => {

                const option =
                    document.createElement("option");

                option.value = category;

                option.textContent = category;

                categoryFilter.appendChild(option);

            });

            if (
                categories.includes(currentValue)
            ) {

                categoryFilter.value =
                    currentValue;

            }

        }


        // ----------------------------------------------------
        // MONTH FILTER
        // ----------------------------------------------------

        if (monthFilter) {

            const currentValue =
                monthFilter.value;

            monthFilter.innerHTML =
                `<option value="">All Months</option>`;

            let months = [];

            if (Array.isArray(dashboardData.months)) {

                months =
                    dashboardData.months;

            }

            months =
                [...new Set(months)]
                    .sort()
                    .reverse();

            months.forEach(month => {

                const option =
                    document.createElement("option");

                option.value = month;

                option.textContent = month;

                monthFilter.appendChild(option);

            });

            if (months.includes(currentValue)) {

                monthFilter.value =
                    currentValue;

            }

        }

    }


    // --------------------------------------------------------
    // GET TRANSACTIONS
    // --------------------------------------------------------

    function getTransactions() {

        if (!dashboardData) {
            return [];
        }

        if (
            Array.isArray(
                dashboardData.transactions
            )
        ) {

            return dashboardData.transactions;

        }

        if (
            Array.isArray(
                dashboardData.transaction_data
            )
        ) {

            return dashboardData.transaction_data;

        }

        return [];

    }


    // --------------------------------------------------------
    // NORMALIZE DATE
    // --------------------------------------------------------

    function getTransactionDate(transaction) {

        return (
            transaction.Transaction_Date ||
            transaction.transaction_date ||
            transaction.Date ||
            transaction.date ||
            ""
        );

    }


    // --------------------------------------------------------
    // NORMALIZE CATEGORY
    // --------------------------------------------------------

    function getTransactionCategory(transaction) {

        return (
            transaction.Category ||
            transaction.category ||
            ""
        );

    }


    // --------------------------------------------------------
    // APPLY FILTERS
    // --------------------------------------------------------

    function getFilteredTransactions() {

        const categoryFilter =
            document.getElementById(
                "categoryFilter"
            );

        const monthFilter =
            document.getElementById(
                "monthFilter"
            );

        const selectedCategory =
            categoryFilter
                ? categoryFilter.value
                : "";

        const selectedMonth =
            monthFilter
                ? monthFilter.value
                : "";


        console.log(
            "Selected Category:",
            selectedCategory
        );

        console.log(
            "Selected Month:",
            selectedMonth
        );


        let transactions =
            getTransactions();


        // ----------------------------------------------------
        // CATEGORY FILTER
        // ----------------------------------------------------

        if (selectedCategory) {

            transactions =
                transactions.filter(transaction => {

                    return (
                        getTransactionCategory(
                            transaction
                        ) === selectedCategory
                    );

                });

        }


        // ----------------------------------------------------
        // MONTH FILTER
        // ----------------------------------------------------

       if (selectedMonth) {
    transactions = transactions.filter(transaction => {
        const date = getTransactionDate(transaction);

        if (!date) return false;

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) return false;

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");

        return `${year}-${month}` === selectedMonth;
    });
}


        console.log(
            "Filtered Transactions:",
            transactions
        );

        return transactions;

    }


    // --------------------------------------------------------
    // RENDER TRANSACTION TABLE
    // --------------------------------------------------------

    function renderTransactions() {

        const tableBody =
            document.getElementById(
                "transactionTableBody"
            );

        if (!tableBody) {
            return;
        }


        const transactions =
            getFilteredTransactions();


        tableBody.innerHTML = "";


        if (transactions.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7"
                        style="text-align:center;
                               padding:35px;">
                        No transactions found
                        for the selected filters.
                    </td>
                </tr>
            `;

            return;

        }


        transactions.forEach(transaction => {

            const row =
                document.createElement("tr");


            const date =
                getTransactionDate(
                    transaction
                );

            const category =
                getTransactionCategory(
                    transaction
                );

            const subcategory =
                transaction.Subcategory ||
                transaction.subcategory ||
                "-";

            const description =
                transaction.Description ||
                transaction.description ||
                "-";

            const amount =
                transaction.Amount ||
                transaction.amount ||
                0;

            const payment =
                transaction.Payment_Method ||
                transaction.payment_method ||
                "-";

            const merchant =
                transaction.Merchant ||
                transaction.merchant ||
                "-";


            row.innerHTML = `

                <td>
                    ${date}
                </td>

                <td>
                    ${category}
                </td>

                <td>
                    ${subcategory}
                </td>

                <td>
                    ${description}
                </td>

                <td>
                    ₹ ${formatAmount(amount)}
                </td>

                <td>
                    ${payment}
                </td>

                <td>
                    ${merchant}
                </td>

            `;


            tableBody.appendChild(row);

        });

    }


    // --------------------------------------------------------
    // FORMAT AMOUNT
    // --------------------------------------------------------

    function formatAmount(amount) {

        const numericAmount =
            Number(amount) || 0;

        return numericAmount.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    }


    // --------------------------------------------------------
    // APPLY FILTER BUTTON
    // --------------------------------------------------------

    const applyButton =
        document.getElementById(
            "applyFilters"
        );


    if (applyButton) {

        applyButton.addEventListener(
            "click",
            function () {

                console.log(
                    "Apply Filters clicked"
                );

                renderTransactions();

                renderTransactionChart();

            }
        );

    }


    // --------------------------------------------------------
    // RESET FILTER BUTTON
    // --------------------------------------------------------

    const resetButton =
        document.getElementById(
            "resetFilters"
        );


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                console.log(
                    "Reset Filters clicked"
                );


                const categoryFilter =
                    document.getElementById(
                        "categoryFilter"
                    );

                const monthFilter =
                    document.getElementById(
                        "monthFilter"
                    );


                if (categoryFilter) {

                    categoryFilter.value = "";

                }


                if (monthFilter) {

                    monthFilter.value = "";

                }


                renderTransactions();

                renderTransactionChart();

            }
        );

    }


    // --------------------------------------------------------
    // CATEGORY CHART
    // --------------------------------------------------------

    function renderCategoryChart() {

        const canvas =
            document.getElementById(
                "categoryChart"
            );

        if (!canvas) {
            return;
        }

        if (
            !dashboardData ||
            !Array.isArray(
                dashboardData.category_data
            )
        ) {

            return;

        }


        const labels =
            dashboardData.category_data.map(
                item => item.Category
            );


        const values =
            dashboardData.category_data.map(
                item =>
                    Number(
                        item.Total_Expense
                    ) || 0
            );


        if (categoryChart) {

            categoryChart.destroy();

        }


        categoryChart =
            new Chart(
                canvas,
                {
                    type: "doughnut",

                    data: {

                        labels: labels,

                        datasets: [

                            {
                                data: values
                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {

                                position: "right"

                            }

                        }

                    }

                }
            );

    }


    // --------------------------------------------------------
    // MONTHLY CHART
    // --------------------------------------------------------

    function renderMonthlyChart() {

        const canvas =
            document.getElementById(
                "monthlyChart"
            );

        if (!canvas) {
            return;
        }

        if (
            !dashboardData ||
            !Array.isArray(
                dashboardData.monthly_data
            )
        ) {

            return;

        }


        const labels =
            dashboardData.monthly_data.map(
                item =>
                    item.Month ||
                    item.month
            );


        const values =
            dashboardData.monthly_data.map(
                item =>
                    Number(
                        item.Total_Expense ||
                        item.total_expense
                    ) || 0
            );


        if (monthlyChart) {

            monthlyChart.destroy();

        }


        monthlyChart =
            new Chart(
                canvas,
                {

                    type: "line",

                    data: {

                        labels: labels,

                        datasets: [

                            {

                                label:
                                    "Monthly Expense",

                                data: values,

                                tension: 0.3,

                                fill: false

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false

                    }

                }
            );

    }


    // --------------------------------------------------------
    // TRANSACTION CHART
    // --------------------------------------------------------

    function renderTransactionChart() {

        const canvas =
            document.getElementById(
                "transactionChart"
            );

        if (!canvas) {
            return;
        }


        const transactions =
            getFilteredTransactions();


        const categoryTotals = {};


        transactions.forEach(transaction => {

            const category =
                getTransactionCategory(
                    transaction
                );


            const amount =
                Number(
                    transaction.Amount ||
                    transaction.amount ||
                    0
                );


            if (!category) {
                return;
            }


            if (!categoryTotals[category]) {

                categoryTotals[category] = 0;

            }


            categoryTotals[category] += amount;

        });


        const labels =
            Object.keys(
                categoryTotals
            );


        const values =
            Object.values(
                categoryTotals
            );


        if (transactionChart) {

            transactionChart.destroy();

        }


        if (labels.length === 0) {
            return;
        }


        transactionChart =
            new Chart(
                canvas,
                {

                    type: "bar",

                    data: {

                        labels: labels,

                        datasets: [

                            {

                                label:
                                    "Filtered Spending",

                                data: values

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        scales: {

                            y: {

                                beginAtZero: true

                            }

                        }

                    }

                }
            );

    }


    // --------------------------------------------------------
    // CATEGORY SUMMARY
    // --------------------------------------------------------

    function renderCategorySummary() {

        const container =
            document.getElementById(
                "categorySummary"
            );

        if (!container) {
            return;
        }


        if (
            !dashboardData ||
            !Array.isArray(
                dashboardData.category_data
            )
        ) {

            return;

        }


        container.innerHTML = "";


        dashboardData.category_data.forEach(
            item => {

                const category =
                    item.Category || "-";

                const count =
                    Number(
                        item.Transaction_Count
                    ) || 0;

                const total =
                    Number(
                        item.Total_Expense
                    ) || 0;

                const average =
                    Number(
                        item.Average_Transaction
                    ) || 0;


                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "category-summary-item";


                div.innerHTML = `

                    <strong>
                        ${category}
                    </strong>

                    <span>
                        ${count} transactions
                    </span>

                    <br>

                    <strong>
                        ₹ ${formatAmount(total)}
                    </strong>

                    <span>
                        Avg: ₹
                        ${formatAmount(average)}
                    </span>

                `;


                container.appendChild(div);

            }
        );

    }


    // --------------------------------------------------------
    // INSIGHTS
    // --------------------------------------------------------

    function renderInsights() {

        if (!dashboardData) {
            return;
        }


        const spendingInsight =
            document.getElementById(
                "spendingInsight"
            );

        const healthInsight =
            document.getElementById(
                "healthInsight"
            );

        const recommendationInsight =
            document.getElementById(
                "recommendationInsight"
            );


        fetch("/api/insights")
    .then(response => response.json())
    .then(insights => {

        if (insights.error) {
            console.error("Insights API Error:", insights.error);
            return;
        }

        if (spendingInsight) {

            spendingInsight.textContent =
                insights.spending_insight ||
                "Spending analysis is available.";

        }

        if (healthInsight) {

            healthInsight.textContent =
                insights.health_insight ||
                "Financial health analysis is available.";

        }

        if (recommendationInsight) {

            recommendationInsight.textContent =
                insights.recommendation ||
                "Continue monitoring your spending.";

        }

    })
    .catch(error => {

        console.error("Insights loading error:", error);

    });

    }

// =====================================================
// BUDGET VS ACTUAL
// =====================================================

async function loadBudgetData() {

    try {

        const response = await fetch("/api/budget-vs-actual");

        const result = await response.json();

        if (result.error) {
            console.error("Budget API Error:", result.error);
            return;
        }

        const budgetData = result.budget_vs_actual || [];

        const monthSelect = document.getElementById("budgetMonth");
        const chartCanvas = document.getElementById("budgetChart");
        const summary = document.getElementById("budgetSummary");

        if (!monthSelect || !chartCanvas) {
            return;
        }

        // Populate month dropdown
        const months = [...new Set(
            budgetData.map(item => item.Month)
        )];

        monthSelect.innerHTML = '<option value="">All Months</option>';

        months.forEach(month => {

            const option = document.createElement("option");

            option.value = month;
            option.textContent = month;

            monthSelect.appendChild(option);

        });

        function renderBudgetChart(selectedMonth = "") {

            let filteredData = budgetData;

            if (selectedMonth) {

                filteredData = budgetData.filter(
                    item => item.Month === selectedMonth
                );

            }

            const labels = filteredData.map(
                item => item.Category
            );

            const budgets = filteredData.map(
                item => Number(item.Budget)
            );

            const actuals = filteredData.map(
                item => Number(item.Actual)
            );

            if (window.budgetChartInstance) {
                window.budgetChartInstance.destroy();
            }

            window.budgetChartInstance = new Chart(
                chartCanvas,
                {
                    type: "bar",

                    data: {

                        labels: labels,

                        datasets: [

                            {
    label: "Budget",
    data: budgets,
    backgroundColor: "rgba(37, 99, 235, 0.75)",
    borderColor: "rgb(37, 99, 235)",
    borderWidth: 1
},

{
    label: "Actual",
    data: actuals,
    backgroundColor: "rgba(236, 72, 153, 0.75)",
    borderColor: "rgb(236, 72, 153)",
    borderWidth: 1
}
                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {
                                position: "top"
                            }

                        },

                        scales: {

                            y: {

                                beginAtZero: true,

                                ticks: {

                                    callback: function(value) {
                                        return "₹" +
                                            Number(value).toLocaleString("en-IN");
                                    }

                                }

                            }

                        }

                    }

                }
            );

            // Summary
            let totalBudget = 0;
            let totalActual = 0;

            filteredData.forEach(item => {

                totalBudget += Number(item.Budget);
                totalActual += Number(item.Actual);

            });

            const variance = totalBudget - totalActual;

            summary.innerHTML = `
                <strong>Budget Summary</strong>

                <div style="
                    margin-top:15px;
                    display:grid;
                    grid-template-columns:repeat(3,1fr);
                    gap:15px;
                ">

                    <div>
                        <small>Total Budget</small>
                        <div style="font-size:20px;font-weight:700;">
                            ₹${totalBudget.toLocaleString("en-IN", {
                                minimumFractionDigits: 2
                            })}
                        </div>
                    </div>

                    <div>
                        <small>Actual Spending</small>
                        <div style="font-size:20px;font-weight:700;">
                            ₹${totalActual.toLocaleString("en-IN", {
                                minimumFractionDigits: 2
                            })}
                        </div>
                    </div>

                    <div>
                        <small>Remaining / Over Budget</small>
                        <div style="font-size:20px;font-weight:700;">
                            ₹${Math.abs(variance).toLocaleString("en-IN", {
                                minimumFractionDigits: 2
                            })}
                        </div>
                    </div>

                </div>
            `;

        }

        renderBudgetChart();

        monthSelect.addEventListener("change", function() {

            renderBudgetChart(this.value);

        });

    } catch (error) {

        console.error("Budget loading error:", error);

    }

}
// =====================================================
// SETTINGS
// =====================================================

const currencySetting =
    document.getElementById("currencySetting");

const defaultSectionSetting =
    document.getElementById("defaultSectionSetting");

const saveSettings =
    document.getElementById("saveSettings");

const settingsMessage =
    document.getElementById("settingsMessage");


// Load saved settings

const savedCurrency =
    localStorage.getItem("smartSpendCurrency");

const savedSection =
    localStorage.getItem("smartSpendDefaultSection");


if (savedCurrency && currencySetting) {

    currencySetting.value =
        savedCurrency;

}


if (savedSection && defaultSectionSetting) {

    defaultSectionSetting.value =
        savedSection;

}


// Save settings

if (saveSettings) {

    saveSettings.addEventListener(
        "click",
        function () {

            const currency =
                currencySetting.value;

            const defaultSection =
                defaultSectionSetting.value;


            localStorage.setItem(
                "smartSpendCurrency",
                currency
            );


            localStorage.setItem(
                "smartSpendDefaultSection",
                defaultSection
            );


            if (settingsMessage) {

                settingsMessage.textContent =
                    "✓ Preferences saved successfully.";

            }

        }
    );

}
// =====================================================
// APPLY DEFAULT DASHBOARD SECTION
// =====================================================

const savedDefaultSection =
    localStorage.getItem("smartSpendDefaultSection");

if (savedDefaultSection) {

    const targetSection =
        document.getElementById(savedDefaultSection);

    if (targetSection) {

        document.querySelectorAll(".dashboard-section")
            .forEach(section => {
                section.classList.remove("active");
            });

        targetSection.classList.add("active");

        document.querySelectorAll(".sidebar a")
            .forEach(link => {
                link.classList.remove("active");
            });

        const activeLink =
            document.querySelector(
                `.sidebar a[href="#${savedDefaultSection}"]`
            );

        if (activeLink) {
            activeLink.classList.add("active");
        }

    }

}
    // --------------------------------------------------------
    // START APPLICATION
    // --------------------------------------------------------
    loadBudgetData();
    loadDashboardData();

});