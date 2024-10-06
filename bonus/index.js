
//=====Homework 1=============

function modulus3or5or7(n= 0) {
    const nums = []

    if (n < 3) {
        return nums
    }

    for (let i = 3; i <= n; i++) {
        if (i % 3 === 0 || i % 5 === 0 || i % 7 === 0) {
            nums.push(i)
        }
    }
    return nums
}


console.log(modulus3or5or7(22))


//=====Homework 2=============

function palindrome(n) {
    if (n < 0) {
        return false
    }

    const nums = []

    while (n !== 0) {
        nums.push(n % 10);
        n = Math.trunc(n / 10);
    }

    if (nums.length === 1) {
        return true
    }

    for (let i = 0; i < Math.round(nums.length / 2); i++) {
        if (nums[i] !== nums[nums.length - 1 - i]) {
            return false
        }
    }

    return true
}

console.log('is palindrome ' + palindrome(132))

//=====Homework 3=============

function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms)
    });
}

delay(2000).then(() => console.log('Пройшло 2 секунди'));


//=====Homework 4=============

const value = 5;

const double = (value) => new Promise((resolve) => resolve(value * 2));

const addTen = (value) => new Promise((resolve) => resolve(value + 10));

double(value)
    .then(addTen)
    .then((result) => {
        console.log(result);
    });
