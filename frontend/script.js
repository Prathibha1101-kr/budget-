// DOM Elements
const transactionForm = document.getElementById('transaction-form');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');

const totalBalanceEl = document.getElementById('total-balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const transactionListEl = document.getElementById('transaction-list');

// Initial state
let transactions = [];

// Set default date to today
dateInput.valueAsDate = new Date();

// Calculate and Update Balances in UI
function updateSummary() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    // Format display
    totalBalanceEl.innerText = `${netBalance < 0 ? '-' : ''}₹${Math.abs(netBalance).toFixed(2)}`;
    totalIncomeEl.innerText = `+₹${totalIncome.toFixed(2)}`;
    totalExpensesEl.innerText = `-₹${totalExpenses.toFixed(2)}`;
}

// Render Transactions List
function renderTransactions() {
    transactionListEl.innerHTML = '';

    if (transactions.length === 0) {
        transactionListEl.innerHTML = '<p style="color: #94a3b8; font-size: 0.85rem; text-align: center;">No transactions added yet.</p>';
        return;
    }

    transactions.forEach((t, index) => {
        const li = document.createElement('li');
        li.className = `transaction-item ${t.type}`;

        const isIncome = t.type === 'income';
        const symbol = isIncome ? '+' : '-';

        li.innerHTML = `
            <div class="item-left">
                <span class="item-title">${t.title}</span>
                <span class="item-meta">${t.category} • ${t.date}</span>
            </div>
            <div class="item-right">
                <span class="item-amount ${t.type}">${symbol}₹${t.amount.toFixed(2)}</span>
                <button class="btn-delete" onclick="deleteTransaction(${index})">&times;</button>
            </div>
        `;

        transactionListEl.appendChild(li);
    });
}

// Add New Transaction
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    if (!title || isNaN(amount) || amount <= 0) return;

    const newTransaction = {
        title,
        amount,
        type,
        category,
        date
    };

    transactions.unshift(newTransaction);

    // Refresh UI
    updateSummary();
    renderTransactions();

    // Reset Form fields
    titleInput.value = '';
    amountInput.value = '';
    categoryInput.selectedIndex = 0;
    dateInput.valueAsDate = new Date();
});

// Delete Transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateSummary();
    renderTransactions();
}

// Initialize on page load
updateSummary();
renderTransactions();