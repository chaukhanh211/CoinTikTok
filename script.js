// Global variables
let selectedAmount = 50000;
let selectedPrice = 650;
let userProfile = null;
let isLoggedIn = false;

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
  
  // Populate coins and price
  document.getElementById('summaryCoins').textContent = selectedAmount.toLocaleString();
  document.getElementById('summaryPrice').textContent = selectedPrice.toFixed(2);
  document.getElementById('summaryTotal').textContent = selectedPrice.toFixed(2);
  
  // Populate user info
  if (userProfile) {
    document.getElementById('summaryAvatar').src = userProfile.avatar;
    document.getElementById('summaryUsername').textContent = '@' + userProfile.username;
  } else {
    const usernameVal = document.getElementById('usernameInput').value.trim();
    document.getElementById('summaryAvatar').src = 'image/coin.png';
    document.getElementById('summaryUsername').textContent = '@' + (usernameVal || 'user');
  }
  
  document.getElementById('paymentMethodModal').style.display = 'flex';
}

let countdownInterval = null;

function showLoadingModal() {
  closeModal('paymentMethodModal');
  
  // Set username in loading
  if (userProfile) {
    document.getElementById('loadingUsername').textContent = '@' + userProfile.username;
  } else {
    const usernameVal = document.getElementById('usernameInput').value.trim();
    document.getElementById('loadingUsername').textContent = '@' + (usernameVal || 'user');
  }
  
  document.getElementById('loadingModal').style.display = 'flex';
  
  // Start countdown timer from 04:59
  let totalSeconds = 299; // 4:59
  const timerEl = document.getElementById('loadingTimer');
  
  function updateTimer() {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    timerEl.textContent = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    totalSeconds--;
  }
  
  updateTimer();
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    if (totalSeconds < 0) {
      clearInterval(countdownInterval);
      return;
    }
    updateTimer();
  }, 1000);
  
  // Auto complete after 5 seconds for demo
  setTimeout(() => {
    clearInterval(countdownInterval);
    closeModal('loadingModal');
    showSuccessModal();
  }, 5000);
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
async function handleRecharge() {
  // If already fetched profile, go straight to order summary
  if (userProfile) {
    showPaymentMethodModal();
    return;
  }
  
  const usernameVal = document.getElementById('usernameInput').value.trim();
  if (!usernameVal) {
    alert('Please enter a TikTok username');
    return;
  }
  
  try {
    const response = await fetch(`https://api.napthetiktok.com/tiktok/login?username=${usernameVal}`);
    const data = await response.json();
    
    if (data.status) {
      userProfile = {
        username: data.userInfo.nickname,
        following: data.userInfo.following,
        followers: formatNumber(data.userInfo.followers),
        likes: formatNumber(data.userInfo.likes),
        avatar: data.userInfo.avatar,
        name: data.userInfo.name
      };
      showPaymentMethodModal();
    } else {
      alert('Cannot find TikTok account. Please check your username.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
}

function selectPaymentMethod(element) {
  document.querySelectorAll('.payment-method-item').forEach(item => {
    item.classList.remove('selected');
  });
  element.classList.add('selected');
}

// Updated Login Modal Functions
function openLoginModal(login) {
  if(login == "login"){
    const usernameInput = document.getElementById('tiktokId');
    usernameInput.value = '';
  }
  document.getElementById('loginModal').style.display = 'flex';
}
function handleUsernameChange(event) {
  const usernameValue = event.target.value;
  openLoginModal();
  
  document.getElementById('tiktokId').value = usernameValue;
}

async function performLogin() {
  const tiktokId = document.getElementById('tiktokId').value.trim();
  
  if (!tiktokId) {
      alert('Please enter TikTok ID');
      return;
  }

  try {
      // Fetch user data from API
      const response = await fetch(`https://api.napthetiktok.com/tiktok/login?username=${tiktokId}`);
      const data = await response.json();

      if (data.status) {
          // Set logged in state and user profile using API data
          isLoggedIn = true;
          userProfile = {
              username: data.userInfo.nickname,
              following: data.userInfo.following,
              followers: formatNumber(data.userInfo.followers),
              likes: formatNumber(data.userInfo.likes),
              avatar: data.userInfo.avatar,
              name: data.userInfo.name
          };

          // Update UI for logged-in state
          updateLoginUI();

          // Close login modal
          closeModal('loginModal');
      } else {
          alert('Login failed. Please check your TikTok ID.');
      }
  } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
  }
}

// Helper function to format large numbers
function formatNumber(num) {
  if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Update the updateLoginUI function
function updateLoginUI() {
  const headerUserInfo = document.getElementById('headerUserInfo');
  const notiLogin = document.getElementById('notiLogin');
  const usernameInput = document.getElementById('usernameInput');
  

  if (isLoggedIn && userProfile) {
      headerUserInfo.innerHTML = `
          <div class="user-profile">
              <img src="${userProfile.avatar}" alt="Profile" class="profile-avatar">
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

      notiLogin.innerHTML = `<p class="noti-login">Logging into the system does not require a password. Please do not give your password to anyone to avoid losing your account.</p>`;
      headerUserInfo.style.display = 'flex';
      usernameInput.style.display = 'none';
  } else {
      headerUserInfo.innerHTML = '';
      headerUserInfo.style.display = 'none';
      notiLogin.innerHTML = '';
      notiLogin.style.display = 'none';
      usernameInput.style.display = 'block';
  }

  // Update login section in header
  const loginSection = document.querySelector('.login-section');
  loginSection.innerHTML = isLoggedIn 
      ? `<button class="logout-btn" onclick="performLogout()">Logout</button>`
      : `<button class="login-btn" onclick="openLoginModal('login')">Login</button>`;
}

function performLogout() {
  // Reset logged in state
  isLoggedIn = false;
  userProfile = null;
  const usernameInput = document.getElementById('usernameInput');
  usernameInput.value = '';
  // Update UI to logged out state
  updateLoginUI();
}

// Call updateLoginUI on page load to set initial state
document.addEventListener('DOMContentLoaded', updateLoginUI);

