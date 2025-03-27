// Global variables
let selectedAmount = 50000;
let selectedPrice = 650;
let userProfile = null;

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

// Updated Login Modal Functions
function openLoginModal() {
  document.getElementById('loginModal').style.display = 'flex';
}

function performLogin() {
  const tiktokId = document.getElementById('tiktokId').value.trim();
  
  if (tiktokId) {
    // Set logged in state and user profile
    isLoggedIn = true;
    userProfile = {
      username: tiktokId,
      following: 22,
      followers: '650.1N',
      likes: '3.7M'
    };
    
    // Update UI for logged-in state
    updateLoginUI();
    
    // Close login modal
    closeModal('loginModal');
  } else {
    alert('Please enter TikTok ID');
  }
}

// Update the updateLoginUI function in script.js
function updateLoginUI() {
  const headerUserInfo = document.getElementById('headerUserInfo');
  const notiLogin = document.getElementById('notiLogin');
  
  if (isLoggedIn && userProfile) {
    headerUserInfo.innerHTML = `
      <div class="user-profile">
        <img src="./image/default-avatar.png" alt="Profile" class="profile-avatar">
        <div class="user-stats">
          <div class="username">@${userProfile.username}</div>
          <div class="user-metrics">
            <span>${userProfile.following} Following</span>
            <span>${userProfile.followers} Followers</span>
            <span>${userProfile.likes} Likes</span>
          </div>
        </div>
      </div>
      
    `;
    notiLogin.innerHTML = `<p class="noti-login">Logging into the system does not require a password. Please do not give your password to anyone to avoid losing your account.</p>`
    headerUserInfo.style.display = 'flex';
  } else {
    headerUserInfo.innerHTML = '';
    headerUserInfo.style.display = 'none';
    notiLogin.innerHTML = '';
    notiLogin.style.display = 'none';
  }
  
  // Update login section in header
  const loginSection = document.querySelector('.login-section');
  loginSection.innerHTML = isLoggedIn ? `<button class="logout-btn" onclick="performLogout()">Logout</button>` : 
    `<button class="login-btn" onclick="openLoginModal()">Login</button>`;
}

function performLogout() {
  // Reset logged in state
  isLoggedIn = false;
  userProfile = null;
  
  // Update UI to logged out state
  updateLoginUI();
}

// Call updateLoginUI on page load to set initial state
document.addEventListener('DOMContentLoaded', updateLoginUI);

