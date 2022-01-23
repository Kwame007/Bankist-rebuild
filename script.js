'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
  ['GHS', 'Ghana Cedis'],
]);

// create chart label
const createChartLabel = function (account) {
  return account.movements.map(acc => (acc > 0 ? 'deposit' : 'withdrawal'));
};

// chart
const ctx = document.getElementById('myChart');

// chart config
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

const movsChart = new Chart(ctx, chartConfig);

// show meassage
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
  console.log(messageDiv);
};
// showMessage('success', 'welcome');
// display movements function
const displayMovement = function (movements, sort = false) {
  // clear movement container
  containerMovements.innerHTML = '';

  // sort
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  // loop through movements
  movs.forEach((mov, index) => {
    // check movement type (deposit or withdrawal)
    const movementType = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movementType}">${
      index + 1
    } ${movementType}</div>
        <div class="movements__value">${Math.abs(mov)} $</div>
    </div>
    `;

    // append to DOM
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// calculate balance function
const calculateBalance = function (account) {
  account.balance = account.movements.reduce((acc, cur) => acc + cur, 0);

  // display balance
  labelBalance.textContent = `${account.balance} $`;
};

// calculate summary function
const calculateSummary = function (accounts) {
  // income
  const income = accounts.movements
    .filter(acc => acc > 0)
    .reduce((acc, cur) => acc + cur);

  //  append label interest
  labelSumIn.textContent = `${income} $`;

  // out
  const moneyOut = accounts.movements
    .filter(acc => acc < 0)
    .reduce((acc, cur) => acc + cur);

  //  append label interest
  labelSumOut.textContent = `${Math.abs(moneyOut)} $`;
  // interest
  const interest = accounts.movements
    .filter(acc => acc > 0)
    .map(acc => (acc * accounts.interestRate) / 100)
    .reduce((acc, cur) => acc + cur);

  //  append label interest
  labelSumInterest.textContent = `${interest.toFixed(2)} $`;
};

// create user
const createUser = function (account) {
  // loop through accounts array
  account.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUser(accounts);

// update UI function
const updateUI = function (account) {
  // display movements
  displayMovement(account.movements);

  // display summary
  calculateBalance(account);

  // display summary
  calculateSummary(account);
  console.log(account);
};

const updateChartConfig = function (movsChart, account) {
  movsChart.data.labels = createChartLabel(account);
  movsChart.data.datasets[0].data = [...account.movements];
  // movsChart.data.datasets[0].fill = false;
  movsChart.data.datasets[0].backgroundColor = account.movements.map(acc =>
    acc > 0 ? 'rgb(47, 221, 146)' : 'rgb(255, 99, 99)'
  );
  movsChart.data.datasets[0].borderColor = account.movements.map(acc =>
    acc > 0 ? 'rgb(47, 221, 146)' : 'rgb(255, 99, 99)'
  );

  movsChart.options.scales.y.beginAtZero = true;
  // movsChart.resize('500', '500');
  movsChart.update();
};

// login event
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // show welcome message
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    } 😊`;

    showMessage(`success`, `Login Successful ✅... Welcome Back 🖖🏼`);

    setTimeout(() => {
      document.querySelector('.success').remove();
    }, 3000);

    // show content
    containerApp.style.display = 'grid';

    document.querySelector('#chart').style.display = 'block';
    document.querySelector('footer').style.display = 'block';

    // call update UI with current account
    updateUI(currentAccount);

    // clear login form
    inputLoginUsername.value = inputLoginPin.value = '';

    // update chart and config object
    updateChartConfig(movsChart, currentAccount);
  } else {
    showMessage(`error`, `Login Failed ❌... Try Again`);

    setTimeout(() => {
      document.querySelector('.error').remove();
    }, 3000);

    // clear login form
    inputLoginUsername.value = inputLoginPin.value = '';

    console.log('wrong credentials');
  }
});

// transfer event
btnTransfer.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;

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

    // update UI
    updateUI(currentAccount);

    // update chart and config object
    updateChartConfig(movsChart, currentAccount);
  }
  // clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
});

// request loan
inputForm.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = +inputLoanAmount.value;

  // check if any amount of current account greater than 10%
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(amount => amount >= amount / 10)
  ) {
    // add positive movement to current user
    currentAccount.movements.push(loanAmount);

    // update UI
    updateUI(currentAccount);

    // update config object and chart
    updateChartConfig(movsChart, currentAccount);
  }
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
      const index = accounts.findIndex(
        acc => acc.username === currentAccount.username
      );

      // delete current account from accounts array
      accounts.splice(index, 1);

      // show content
      containerApp.style.opacity = '0';
    }
  }
  // clear input fields
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
// sort
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;

  // sorted one way (ascending order)
  currentAccount.movements = sorted
    ? currentAccount.movements.sort((a, b) => b - a)
    : currentAccount.movements;

  // update chart and config object when sorted
  updateChartConfig(movsChart, currentAccount);
});
/////////////////////////////////////////////////

// TODO: IMPLEMENT LOCAL STORAGE, CREATE ACCOUNT (INITIAL DEPOSIT),ACCOUNT CHART
// ACCOUNT CHART (done)

// NEXT: CREATE ACCOUNT FEATURE
// 1. Generate dynamic user data for accounts object

// for (let i = 0; i <= 10; i++) {
//   console.log(i);
// }
let num = 1;
console.log(num++);
console.log(++num);

console.log(num);
console.log(1 === 1);
console.log(12 == '12');
console.log(12 === '12');
console.log(true || false);
