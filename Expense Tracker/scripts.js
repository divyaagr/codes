document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expenseForm');
    const expensesList = document.getElementById('expenses');
    const ctxPie = document.getElementById('expenseChart').getContext('2d');
    let pieChart;

    const expenses = [];

    expenseForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        if (isNaN(amount) || !category || !date) return;

        const expense = { amount, category, date };
        expenses.push(expense);

        addExpenseToList(expense);
        updatePieChart();
        expenseForm.reset();
    });

    function addExpenseToList(expense) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>Amount: ₹${expense.amount.toFixed(2)}</span>
            <span>Category: ${expense.category}</span>
            <span>Date: ${formatDate(expense.date)}</span>
            <button class="delete-btn">Delete</button>
        `;
        li.querySelector('.delete-btn').addEventListener('click', function () {
            const index = expenses.indexOf(expense);
            if (index > -1) {
                expenses.splice(index, 1);
                expensesList.removeChild(li);
                updatePieChart();
            }
        });
        expensesList.appendChild(li);
    }

    function updatePieChart() {
        const categoryExpenses = calculateCategoryExpenses();
        const labels = categoryExpenses.map(expense => `${expense.category} (${formatDate(expense.date)})`);
        const data = categoryExpenses.map(expense => expense.totalAmount);
        const colors = labels.map(() => getRandomColor());

        if (pieChart) {
            pieChart.data.labels = labels;
            pieChart.data.datasets[0].data = data;
            pieChart.data.datasets[0].backgroundColor = colors;
            pieChart.update();
        } else {
            pieChart = new Chart(ctxPie, {
                type: 'pie',
                data: {
                    labels,
                    datasets: [{
                        data,
                        backgroundColor: colors
                    }]
                },
                options: {
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                const label = data.labels[tooltipItem.index];
                                const value = data.datasets[0].data[tooltipItem.index];
                                return `${label}: ₹${value.toFixed(2)}`;
                            }
                        }
                    }
                }
            });
        }
    }

    function calculateCategoryExpenses() {
        const categoryExpensesMap = new Map();

        expenses.forEach(expense => {
            const { category, amount, date } = expense;
            if (categoryExpensesMap.has(category)) {
                categoryExpensesMap.get(category).totalAmount += amount;
            } else {
                categoryExpensesMap.set(category, { totalAmount: amount, date });
            }
        });

        const categoryExpenses = [];
        categoryExpensesMap.forEach((value, key) => {
            categoryExpenses.push({ category: key, totalAmount: value.totalAmount, date: value.date });
        });

        return categoryExpenses;
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-GB', options);
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});
