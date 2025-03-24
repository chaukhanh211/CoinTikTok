// Global variables
let selectedAmount = 50000;
let selectedPrice = 650;

// Coin selection functions
function selectOption(element, amount, price) {
  document.querySelectorAll('.coin-option').forEach(el => el.classList.remove('selected'));
  element.classList.add('selected');
  selectedAmount = amount;
  selectedPrice = price;
}

// Modal control functions
function openCustomModal() {
  document.getElementById('customModal').style.display = 'flex';
  document.getElementById('coinAmount').value = selectedAmount;
  document.getElementById('totalAmount').textContent = selectedPrice.toFixed(2);
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function showPaymentMethodModal() {
  closeModal('customModal');
  document.getElementById('summaryCoins').textContent = selectedAmount.toLocaleString();
  document.getElementById('summaryTotal').textContent = selectedPrice.toFixed(2);
  document.getElementById('paymentMethodModal').style.display = 'flex';
}

function showLoadingModal() {
  closeModal('paymentMethodModal');
  document.getElementById('loadingModal').style.display = 'flex';
  
  const progressBar = document.getElementById('progressBar');
  const loadingStatus = document.getElementById('loadingStatus');
  
  // Reset and restart animation
  progressBar.style.animation = 'none';
  void progressBar.offsetWidth;
  progressBar.style.animation = 'progress 3s linear forwards';
  
  setTimeout(() => loadingStatus.textContent = "Verifying payment...", 1000);
  setTimeout(() => loadingStatus.textContent = "Adding coins to your account...", 2000);
  setTimeout(() => {
    closeModal('loadingModal');
    showSuccessModal();
  }, 3000);
}

function showSuccessModal() {
  document.querySelector('.success-message').textContent = 
    `You recharged ${selectedAmount.toLocaleString()} Coins. You can use coins to send virtual Gifts`;
  closeModal('customModal');
  document.getElementById('successModal').style.display = 'flex';
}

// Custom amount input functions
function addDigit(digit) {
  const coinAmountInput = document.getElementById('coinAmount');
  coinAmountInput.value = coinAmountInput.value === '0' ? digit : coinAmountInput.value + digit;
  updateAmounts(parseInt(coinAmountInput.value));
}

function deleteDigit() {
  const coinAmountInput = document.getElementById('coinAmount');
  coinAmountInput.value = coinAmountInput.value.length > 1 ? 
    coinAmountInput.value.slice(0, -1) : '0';
  updateAmounts(parseInt(coinAmountInput.value));
}

function updateAmounts(amount) {
  const calculatedPrice = (amount * 0.013).toFixed(2);
  document.getElementById('totalAmount').textContent = calculatedPrice;
  selectedAmount = amount;
  selectedPrice = parseFloat(calculatedPrice);
}

// Payment method selection
function selectPaymentMethod(element) {
  document.querySelectorAll('.payment-method-item').forEach(item => {
    item.classList.remove('selected');
  });
  element.classList.add('selected');
}