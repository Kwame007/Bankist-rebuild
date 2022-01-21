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

// create and display chart
const movementsCharts = function (account) {
  // insert new canvas into DOM
  document.querySelector('.chart--wrap').innerHTML =
    ' <canvas id="myChart" width="200" height="200"></canvas>';

  // chart feature
  const ctx = document.getElementById('myChart');
  const movsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: account.movements.map(acc =>
        acc > 0 ? 'deposit' : 'withdrawal'
      ),
      datasets: [
        {
          label: 'Transactions',
          data: [...account.movements],
          fill: false,
          backgroundColor: account.movements.map(acc =>
            acc > 0 ? 'rgb(47, 221, 146)' : 'rgb(255, 99, 99)'
          ),
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
          ],
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
  });
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

    // charts
    movementsCharts(currentAccount);
  } else {
    console.log('no');
  }
});

// transfer event
btnTransfer.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  // clear canvas
  document.querySelector('.chart--wrap').innerHTML = '';

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

    // update chart
    movementsCharts(currentAccount);
  }
  // clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
});

// request loan
inputForm.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);

  // clear canvas
  document.querySelector('.chart--wrap').innerHTML = '';

  // check if any amount of current account greater than 10%
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(amount => amount >= amount / 10)
  ) {
    // add positive movement to current user
    currentAccount.movements.push(loanAmount);

    // update UI
    updateUI(currentAccount);

    // update chart
    movementsCharts(currentAccount);
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
  // clear canvas
  document.querySelector('.chart--wrap').innerHTML = '';

  e.preventDefault();
  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;

  // sorted one way (ascending order)
  currentAccount.movements = sorted
    ? currentAccount.movements.sort((a, b) => b - a)
    : currentAccount.movements;

  // update chart when sorted
  movementsCharts(currentAccount);
});
/////////////////////////////////////////////////

// TODO: IMPLEMENT LOCAL STORAGE, CREATE ACCOUNT (INITIAL DEPOSIT),ACCOUNT CHARTS
/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.
*/
// TEST DATA:

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(dog => console.log(dog.weight ** 0.75 * 8));
