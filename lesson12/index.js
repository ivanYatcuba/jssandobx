function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

const generator1 = generator();

console.log(generator1.next().value);
console.log(generator1.next().value);
console.log(generator1.next().value);

function createGenerator() {
  let count = 0;
  return function () {
    if (count < 3) {
      count++
      return count
    } else {
      return undefined
    }
  };
}

const generator2 = createGenerator();

console.log(generator2()); // 1
console.log(generator2()); // 2
console.log(generator2()); // 3
console.log(generator2()); // undefined
