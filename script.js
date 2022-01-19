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

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

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

// login event
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // show welcome message
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    } 😊`;

    // show content
    containerApp.style.opacity = '100';

    // call update UI with current account
    updateUI(currentAccount);

    // clear login form
    inputLoginUsername.value = inputLoginPin.value = '';
  } else {
    console.log('no');
  }
});

// transfer event
btnTransfer.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

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
  }
  // clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
});

// request loan
inputForm.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);

  // check if any amount of current account greater than 10%
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(amount => amount >= amount / 10)
  ) {
    // add positive movement to current user
    currentAccount.movements.push(loanAmount);

    // update UI
    updateUI(currentAccount);
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
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const deletAccount = confirm('Are you sure');
    if (deletAccount) {
      // fincd index
      const index = accounts.findIndex(
        acc => acc.username === currentAccount.username
      );
      console.log(index);
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
  console.log(sorted);
});
/////////////////////////////////////////////////

// TODO: IMPLEMENT LOCAL STORAGE, CREATE ACCOUNT (INITIAL DEPOSIT),ACCOUNT CHARTS

// every()
console.log(account4.movements.every(mov => mov > 0));

// seperated callbacks
const deposit = mov => mov > 0;
movements.every(deposit);

// flat
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

// flat with depth
const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

const accountMovements = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, cur) => acc + cur, 0);
console.log(accountMovements);

// flatMap()
const overalBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, cur) => acc * cur);
console.log(overalBalance);

// string
const owner = ['jonas', 'zack', 'adam', 'martha'];
console.log(owner.sort());

// numbers
console.log(movements);

// asc
console.log(
  movements.sort((a, b) => {
    if (a > b) {
      return 1;
    }

    if (b > a) {
      return -1;
    }
  })
);

console.log(movements.sort((a, b) => a - b));
console.log(movements.sort((a, b) => b - a));

// creating arrays
console.log([1, 2, 3.4, 3, 4]);
console.log(new Array(2, 1, 3, 1));

const x = new Array(7);
// x.fill(1)
x.fill(1, 3, 5);
console.log(x);

// array.from()
const y = Array.from({ length: 5 }, () => 2);
const z = Array.from({ length: 5 }, (_, index) => index + 1);
console.log(z);

const randomDice = Array.from({ length: 100 }, () =>
  Math.floor(Math.random() * 6)
);
console.log(randomDice);

btnLogin.addEventListener('click', () => {
  const movUI = Array.from(
    document.querySelectorAll('.movements__value'),
    mov => Number(mov.textContent.replace('$', ''))
  );
  console.log(movUI);
});

// 1
const bankDep = accounts
  .flatMap(acc => acc.movements)
  .filter(acc => acc > 0)
  .reduce((acc, cur) => acc + cur, 0);
console.log(bankDep);

// 2
// const numDeposit = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;
// console.log(numDeposit);
const numDeposit = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposit);

// 3
const { deposits, withdrawal } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, cur) => {
      // cur > 0 ? (sum.deposits += cur) : (sum.withdrawal += cur);
      sum[cur > 0 ? 'deposits' : 'withdrawal'] += cur;
      return sum;
    },
    { deposits: 0, withdrawal: 0 }
  );
console.log(deposits, withdrawal);

// 4 title case
const titleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exception = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];
  const titleStr = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exception.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  return capitalize(titleStr);
};
console.log(titleCase('this is a nice title'));
console.log(titleCase('this is a LONG title but not too long'));
console.log(titleCase('and here is another title with an EXAMPLE'));
