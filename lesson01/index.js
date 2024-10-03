const arr = [1, 2, 3, 4, 5]

console.log('running using iteration')

for (let i = 0; i < arr.length; i++) {
    console.log(arr[i])
}

function recursiveIteration(array, index = 0) {
    if (index === array.length) {
        return
    }
    console.log(array[index])
    recursiveIteration(array, ++index)
}

console.log('running using recursion')

recursiveIteration(arr)
