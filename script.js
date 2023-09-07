'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-08-11T17:01:17.194Z',
    '2023-08-14T23:36:17.929Z',
    '2023-08-15T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

//Functions

const formatMovementDate = function (date, locale) {
  const calcdayPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcdayPassed(new Date(), date);
  if (daysPassed === 0) {
    return 'Today';
  }
  if (daysPassed === 1) {
    return 'Yesterday';
  }
  if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  }
  // } else {
  //   const day = `${date.getDate()}`.padStart(2, 0);
  //   const month = `${date.getMonth() + 1}`.padStart(2, 0);
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // }
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

//stw
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};
// calcDisplaySummary(account1.movements);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);
// console.log(accounts);

const updateUI = function (acc) {
  //displayMovements
  displayMovements(acc);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    //Decrease 1s
    // time--;

    //When 0second , stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  //Set time to 5 minutes
  let time = 60;
  //Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////
//Event handler
let currentAccount, timer;

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
//Experimenting API
// const now = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
//   weekday: 'long',
// };
// const locale = navigator.language;
// console.log(locale);

// labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

// const now = new Date();
// const day = `${now.getDate()}`.padStart(2, 0);
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// const year = now.getFullYear();
// const hour = now.getHours();
// const min = now.getMinutes();
// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

//day/month/year

btnLogin.addEventListener('click', function (e) {
  // console.log('Button is clicked');
  //Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message

    labelWelcome.textContent = `Welcome back,${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    const locale = navigator.language;
    console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //     const now = new Date();
    //     const day = `${now.getDate()}`.padStart(2, 0);
    //     const month = `${now.getMonth() + 1}`.padStart(2, 0);
    //     const year = now.getFullYear();
    //     const hour = now.getHours();
    //     const min = now.getMinutes();
    //     labelDate.textContent = `${day}/${month}/${year},
    // ${hour}:${min}`;
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    //Update UI
    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const recevierAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    recevierAcc?.username !== currentAccount.username
  ) {
    // console.log('Transfer successful');
    //Doing the transfer
    currentAccount.movements.push(-amount);
    recevierAcc.movements.push(amount);

    //Add transfer date
    currentAccount.movementsDates.push(new Date());
    recevierAcc.movementsDates.push(new Date());

    //Update UI
    updateUI(currentAccount);
    //Reset Timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    setTimeout(function () {
      //Add movement
      currentAccount.movements.push(amount);

      //Add transfer date
      currentAccount.movementsDates.push(new Date());

      //Update UI
      updateUI(currentAccount);

      //Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }

  inputLoanAmount.value = '';
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    // inputCloseUsername.value = inputClosePin.value = '';
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //Delete account;
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// Lectures;
//Map
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;
// const movementsUSD = movements.map(function (move) {
//   return move * eurToUsd;
// });
// console.log(movementsUSD);
// const movementsUS = movements.map(move => move * eurToUsd);
// console.log(movementsUS);

// const movementsDescription = movements.map(
//   (mov, i) =>
//    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdraw'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescription);
//Filter
// const movementUS = movements.filter(movement => movement > 70);
// console.log(movementUS);
//Reduce
// const value = movements.reduce((acc, cur, i, arr) => acc + cur, 0);
// console.log(value);
// const maxValue = movements.reduce((acc, mov) => {
//   if (acc < mov) {
//     return mov;
//   }
//   return acc;
// }, movements[0]);
// console.log(maxValue);
//Pipleine
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

// const firstwithdrawal = movements.find(mov => mov < 0);
// console.log(firstwithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => (acc.owner = 'Jessica Davis'));
// console.log(account);
// console.log(movements);
// console.log(movements.includes(-130));

// const anyDeposits = movements.every(mov => mov > 0);
// console.log(anyDeposits);

// const arr = [[1, 2, 3], 4, 5, [6, 7, 9]];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8, 9, 10];
// console.log(arrDeep.flat());
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements.flat());

//flat
// const overallBalance = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, move) => acc + move);
// console.log(overallBalance);

// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

//Numbers
// console.log(movements.sort());

//return <0 A,B
//return >0 B,A
//Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (b > a) return 1;
// });
// movements.sort((a, b) => a - b);
// console.log(movements);
// console.log([1, 2, 3, 4, 5, 6, 7]);
// console.log(new Array(1, 2, 3, 4, 5, 6));

// const x = new Array(7);
// console.log(x);
// x.fill(3);
// x.fill(1, 3, 5);
// console.log(x);

// Array.from
// const arrr = Array.from({ length: 7 }, () => 1);
// console.log(arrr);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// labelBalance.addEventListener('click', function () {
// s
// console.log(movementsUI.map(el => el.textContent.replace('€', '')));
// });

//Numbers
// console.log(23 === 23.0);

//Base 10-0 to 9
//Binary base - 0 1
// console.log(0.1 + 0.2);

// console.log(0.1 + 0.2 === 0.3);
// console.log(typeof 32 + '23');

//Parsing
// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseInt('px30', 10));
// console.log(Number.parseFloat('2.5rem'));
// console.log(Number.parseInt('2.5rem'));
// console.log(Number.isNaN(25));
// console.log(Number.isNaN('25'));
// console.log(Number.isNaN(+'25ab'));
// console.log(Number.isNaN(23 / 0));

//Checking if value is number
// console.log(Number.isFinite(23));
// console.log(Number.isFinite(+'23s'));
// console.log(Number.isFinite(2 / 0));
// console.log(Number.isFinite('23'));

// console.log(Number.isInteger(23));
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(Math.max(5, 19, '23', 1, 20));
// console.log(Math.max(23, '29px'));

// console.log(Math.PI);

// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;

// //Rounding integers
// console.log(Math.trunc(23.3));
// console.log(Math.round(23.4));
// console.log(Math.ceil(23.3));
// console.log(Math.floor(-23.9));
// console.log(Math.ceil(-23.9));

// console.log(5 % 2);
// console.log(8 / 3);

// const isEven = n => n % 2 === 0;
// console.log(isEven(2));
// console.log(isEven(23));

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     //0,2,4,6
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     //0,3,6,9
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });
//Nth

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(Number.MAX_SAFE_INTEGER + 1);

// console.log(499340921984947591038974198347729n);
// console.log(BigInt(40399283981038403940214890238413438));

// Operations
// console.log(10000n + 10000n);
// console.log(362867267263234135144424213451351415n * 1000n);

// const huge = 20281098311203948109318n;
// const num = 23;
// console.log(huge * BigInt(num));

// console.log(20n > 15);
// console.log(20n === 20);
// console.log(typeof 20n);
// console.log(20n == '20');

// console.log(huge + ' is Really big!!!');

//Divisons
// console.log(10n / 3n);
// console.log(10 / 3);

//Create  a date
// const now = new Date();
// console.log(new Date());
// console.log(new Date());

// console.log(new Date('December 24,2015'));
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 11, 32, 15, 23, 5));

// console.log(new Date(0));
// console.log(3 * 24 * 60 * 60 * 1000);

//Working with dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDay());
// console.log(future.getDate());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(2142237180000));

// console.log(Date.now());

// future.setFullYear(2040);
// console.log(future)
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

// const calcdayPassed = (date1, date2) =>
//   Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));
// const day1 = calcdayPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
// console.log(day1);

const num = 3884764.23;
const options = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
  // useGrouping: false,
};
console.log('US:', new Intl.NumberFormat('en-US', options).format(num));
console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num));
console.log('Syria: ', new Intl.NumberFormat('ar-SY', options).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num)
);
const ingredients = ['olives', ''];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
);
console.log('Waiting...');

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

//setInterval
setInterval(function () {
  const now = new Date();
  console.log(now);
}, 1000);
