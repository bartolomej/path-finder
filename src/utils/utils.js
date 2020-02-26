export function random (max, min = 0) {
  return Math.round(Math.random() * (max - min) + min);
}

export function pause (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}

export function cloneObjectOfClass (object) {
  return Object.assign(Object.create(Object.getPrototypeOf(object)), object)
}
