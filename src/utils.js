export function random (max, min = 0) {
  return Math.round(Math.random() * (max - min) + min);
}

export function remove (array, element) {
  for (let i = 0; i < array.length; i++) {
    if (typeof element === "object") {
      if (array[i].equals(element)) {
        array.splice(i, 1);
      }
    }
    if (typeof element === "number") {
      if (array[i] === element) {
        array.slice(i, 1);
      }
    }
  }
}

export function pause (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}
