'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP Rebuild 👷🏽‍♂️😎

// Data
let account = {};
const newAccounts = [];
const accountForm = document.querySelector('#account-form');

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const inputForm = document.querySelector('.form--loan');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// TODO: ACCOUNT CHART

// create chart label
const createChartLabel = function (account) {
  return account.movements.map(acc => (acc > 0 ? 'deposit' : 'withdrawal'));
};

// select chart element
const ctx = document.getElementById('myChart');

// chart configuration
const chartConfig = {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Transactions',
        data: [],
        fill: false,
        backgroundColor: [],
        borderColor: [],
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

// instantiate new chart object
const movsChart = new Chart(ctx, chartConfig);

// calculate days passed function
const calcDaysPassed = (date1, date2) =>
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

// format movements date function
const formatMovementsDates = function (date, locale) {
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// show meassage function
const showMessage = function (className, message) {
  // create message div
  const messageDiv = document.createElement('div');

  // select parent element
  const childElement = document.createElement('p');
  const childElements = document.querySelector('.app');
  const parentElement = childElements.parentNode;

  childElement.textContent = `${message}`;

  // set class name
  messageDiv.className = `${className}`;

  // create text node
  messageDiv.appendChild(childElement);

  // insert in DOM
  parentElement.insertBefore(messageDiv, childElements);
};

// format currency function
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// display movements function
const displayMovement = function (account, sort = false) {
  // clear movement container
  containerMovements.innerHTML = '';

  // sorted movements
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  // loop through movements
  movs.forEach((mov, index) => {
    // check movement type (deposit or withdrawal)
    const movementType = mov > 0 ? 'deposit' : 'withdrawal';
    console.log(currentAccount);

    /*
   TODO: IMPLEMENT DYNAMIC DATES
   */
    // loop through movementsDates array
    const date = new Date(account.movementsDates[index]);
    const displayDate = formatMovementsDates(date, account.locale);

    // formatted movements
    const formatMovs = formatCurrency(mov, account.locale, account.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movementType}">${
      index + 1
    } ${movementType}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatMovs}</div>
    </div>
    `;

    // append to DOM
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// calculate balance function
const calculateBalance = function (account) {
  // create balance property in account object
  account.balance = account.movements.reduce((acc, cur) => acc + cur);

  // display account balance
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};

// calculate summary function
const calculateSummary = function (accounts) {
  // income variable
  const income = accounts.movements
    .filter(acc => acc > 0)
    .reduce((acc, cur) => acc + cur, 0);

  //  append label interest
  labelSumIn.textContent = formatCurrency(
    income,
    accounts.locale,
    accounts.currency
  );

  // money out variable
  const moneyOut = accounts.movements
    .filter(acc => acc < 0)
    .reduce((acc, cur) => acc + cur, 0);

  //  append label interest
  labelSumOut.textContent = formatCurrency(
    Math.abs(moneyOut),
    accounts.locale,
    accounts.currency
  );
  // interest
  const interest = accounts.movements
    .filter(acc => acc > 0)
    .map(acc => (acc * accounts.interestRate) / 100)
    .reduce((acc, cur) => acc + cur, 0);

  //  append label interest
  labelSumInterest.textContent = formatCurrency(
    interest,
    accounts.locale,
    accounts.currency
  );
};

// create new account user function
const createUser = function (account) {
  // loop through accounts array
  account.forEach(acc => {
    // create username property in accounts object
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

// update UI function
const updateUI = function (account) {
  // call display movements
  displayMovement(account);

  // call display summary
  calculateBalance(account);

  // call display summary
  calculateSummary(account);
  console.log(account);
};

// update chart configurations function
// update function configurations with movements data
const updateChartConfig = function (movsChart, account) {
  // set new data.labels value
  movsChart.data.labels = createChartLabel(account);

  // set new datasets value
  movsChart.data.datasets[0].data = [...account.movements];

  // set new datasets background value
  movsChart.data.datasets[0].backgroundColor = account.movements.map(acc =>
    acc > 0 ? 'rgb(47, 221, 146)' : 'rgb(255, 99, 99)'
  );

  // set new datasets border color value
  movsChart.data.datasets[0].borderColor = account.movements.map(acc =>
    acc > 0 ? 'rgb(47, 221, 146)' : 'rgb(255, 99, 99)'
  );

  movsChart.options.scales.y.beginAtZero = true;

  // update chart
  movsChart.update();
};

// timer function
const startLogoutTimer = function () {
  // set time(time in seconds) to 10min
  let time = 600;

  // ticking timer function
  const tick = () => {
    // convert time to minutes
    const minutes = `${Math.trunc(time / 60)}`.padStart(2, 0);

    // convert time to seconds
    const seconds = `${time % 60}`.padStart(2, 0);

    // in each call print remaining time
    labelTimer.textContent = `${minutes}:${seconds}`;

    // stop timer if true
    if (time <= 0) {
      clearInterval(timer);

      // Display UI and message
      labelWelcome.textContent = `Login to get started`;

      // when 0 seconds, stop timer log user out

      // set containerApp to display none
      containerApp.style.display = 'none';

      // set chart to display none
      document.querySelector('#chart').style.display = 'none';

      // set footer to display none
      document.querySelector('footer').style.display = 'none';
    }

    // decrease time
    time--;
  };

  // call tick immediatley we call startLogoutTimer
  tick();
  // call timer every 1 second
  const timer = setInterval(tick, 1000);

  // return timer value
  return timer;
};

// login event handler
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  // set current account value
  currentAccount = newAccounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // show welcome message
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    } 😊`;
    console.log(currentAccount);
    // CREATE CURRENT DATE

    // implement date feature for current balance
    const now = Date.now();

    // options to pass to INTl.DateFormater()
    const options = {
      hour: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      minutes: 'numeric',
      // weekdays: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    showMessage(`success`, `Login Successful ✅... Welcome Back 🖖🏼`);

    setTimeout(() => {
      document.querySelector('.success').remove();
    }, 3000);

    // show content
    containerApp.style.display = 'grid';

    document.querySelector('#chart').style.display = 'block';
    document.querySelector('footer').style.display = 'block';

    // timer

    // check if timer value exists with previous logins and clear them
    if (timer) clearInterval(timer);

    // set current timer to startLogoutTimer function call
    timer = startLogoutTimer();

    // call update UI with current account
    updateUI(currentAccount);

    // clear login form
    inputLoginUsername.value = inputLoginPin.value = '';

    // update chart and config object
    updateChartConfig(movsChart, currentAccount);

    console.log(currentAccount);
    console.log(newAccounts);
  } else {
    // show error message if login not successfull
    showMessage(`error`, `Login Failed ❌... Try Again`);

    // remove error div from DOM after 3 seconds
    setTimeout(() => {
      document.querySelector('.error').remove();
    }, 3000);

    // clear login form
    inputLoginUsername.value = inputLoginPin.value = '';

    console.log('wrong credentials');
  }
});

// transfer event handler
btnTransfer.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  // set receiverAccount value
  const receiverAccount = newAccounts.find(
    acc => acc.username === inputTransferTo.value
  );

  const amount = +inputTransferAmount.value;

  /*
  check if transfer amount >0
  check if receiverAccount !== undifined
  check if currentAccount.balance is at least greater than transfer ampunt
  check if currentAccount?.username is not equal to the receiverAccount's username
  */

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // add negative amount to current account movement
    currentAccount.movements.push(-amount);

    // add positive amount to receiver account movement
    receiverAccount.movements.push(amount);

    // add new transfer date to movementsDates array
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // update UI
    updateUI(currentAccount);

    // reset timer
    clearInterval(timer);
    timer = startLogoutTimer();

    // update chart and config object
    updateChartConfig(movsChart, currentAccount);
  }
  // clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
});

// request loan event handler
inputForm.addEventListener('click', function (e) {
  // prevent form submit
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);

  // check if transfer amount >0ß
  // check if any amount of current account is greater than 10% of the amount requested
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(amount => amount >= amount / 10)
  ) {
    setTimeout(() => {
      // add positive movement to current user
      currentAccount.movements.push(loanAmount);

      // add new loan date to movementsDates array
      currentAccount.movementsDates.push(new Date().toISOString());
      // receiverAccount.movementsDates.push(new Date().toISOString());

      // update UI
      updateUI(currentAccount);

      // update config object and chart
      updateChartConfig(movsChart, currentAccount);
    }, 3000);
  }

  // reset timer
  clearInterval(timer);
  timer = startLogoutTimer();

  // clear input
  inputLoanAmount.value = '';
});

// close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // check if credentials are correct
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const deletAccount = confirm('Are you sure');
    if (deletAccount) {
      // find index
      const index = newAccounts.findIndex(
        acc => acc.username === currentAccount.username
      );

      // delete current account from accounts array
      newAccounts.splice(index, 1);

      // show content
      containerApp.style.opacity = '0';
    }
  }
  // clear input fields
  inputCloseUsername.value = inputClosePin.value = '';

  console.log(newAccounts);
});

let sorted = false;

// sort
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccount, !sorted);
  sorted = !sorted;
  console.log(currentAccount.movements);
  // sorted one way (ascending order)
  currentAccount.movements = sorted
    ? currentAccount.movements.sort((a, b) => b - a)
    : currentAccount.movements;

  // update chart and config object when sorted
  updateChartConfig(movsChart, currentAccount);
});
/////////////////////////////////////////////////
/*
TODO: IMPLEMENT LOCAL STORAGE

*/

/*
TODO: CREATE ACCOUNT (INITIAL DEPOSIT)
NEXT: CREATE ACCOUNT FEATURE
1. Generate dynamic user data for accounts object
*/

// create new user account function
const createAccount = function (e) {
  e.preventDefault();

  //  select form elements
  const userName = document.querySelector('#user-name').value;
  const userPin = document.querySelector('#user-pin').value;
  const initialDeposit = document.querySelector('#initial-deposit').value;

  // check if form is empty ? return
  if (!userName || !userPin || !initialDeposit) return;

  /*
  check if names in array is at least two
  check if length of pin is 4 exactly
  check if initial deposit amount is at least 100
  */

  if (
    userName.split(' ').length >= 2 &&
    userPin.length === 4 &&
    initialDeposit >= 100
  ) {
    // create movements and movementDates variables and assign to empty array
    let movementsArr = [];
    let movementsDatesArr = [];

    // current date
    const currentDate = new Date();

    // push initial deposit into movementsArr and push current date into movementsDates array
    movementsArr.push(+initialDeposit);
    movementsDatesArr.push(currentDate.toISOString());

    // create accounts properties and values (key ⇉ value pairs)
    account.owner = userName;
    account.movements = movementsArr;
    account.movementsDates = movementsDatesArr;
    account.interestRate = 0.7;
    account.pin = +userPin;
    account.locale = navigator.language;
    account.currency = 'EUR';

    // add new user object to newAccounts array
    newAccounts.push(account);

    // create new user
    createUser(newAccounts);

    // set account object to empty after account created
    account = {};

    console.log(newAccounts);
  }
};

// create new user account on form submit
accountForm.addEventListener('submit', createAccount);
