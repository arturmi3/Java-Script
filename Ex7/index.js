// data = array of integers, length = 100 => 99 add calls 
let data = []
for (let i = 1; i <= 100; i++) {
  data.push(i)
}

let testedFn = ""

main()

async function main() {
  // Your async code here  
  testedFn = 'add 1'
  await measurePerformance(testedFn, () => addData1(data))  
  
  testedFn = 'add 2'
  await measurePerformance(testedFn, () => addData2(data))
  
  testedFn = 'add 3'
  await measurePerformance(testedFn, () => addData3(data))
  
  testedFn = 'add 4'
  await measurePerformance(testedFn, () => addData4(data))
}

// for z await
async function addData1(data) {
  let sum = 0
  for (let item of data) {
    sum = await asyncAdd(sum, item)
  }
  return sum
}
// reduce z sum jako Promise
async function addData2(data) {
  console.log('reduce start')
  const resultPromise = data.reduce(async (sumPromise, item) => {
    const sumValue = await sumPromise
    return asyncAdd(sumValue, item)
  }, 0)
  console.log('reduce end')
  return resultPromise
}
// równoległe operacje
async function addData3(values) {
  let data = [...values]

  while (data.length > 1) {
    let asyncTempSums = []
    while (data.length > 0) {
      if (data.length === 1) {
        asyncTempSums.push(Promise.resolve(data.pop()))
      } else {
        const a = data.pop()
        const b = data.pop()
        asyncTempSums.push(asyncAdd(a, b))
      }
    }
    data = await Promise.all(asyncTempSums)
  }
  return data.pop()
}

async function addData4(values) {
  if (values.length == 1) {
    return values[0]
  }
  else {
    let pivot = Math.floor(values.length / 2)
    let leftData = values.slice(0, pivot)
    let rightData = values.slice(pivot)
    return await asyncAdd(await addData4(leftData), await addData4(rightData))
  }
}

async function measurePerformance(name, cb) {
  console.log(`Start: ${name}`);
  performance.mark('mf-start')
  const result = await cb()
  performance.mark('mf-end')
  const runTime = performance.measure('Czas wykonania kodu', 'mf-start', 'mf-end')
  console.log(`Wynik z ${name}: ${result}`)
  console.log(`Czas wykonywania: ${runTime.duration.toFixed(2)}ms`)
}
async function asyncAdd(a, b) {
  console.count(`[async operation ${testedFn}]`)
  if (typeof a !== 'number' || typeof b !== 'number') {
    console.log('err', { a, b })
    return Promise.reject('Argumenty muszą mieć typ number!')
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + b)
    }, 10)
  })
}