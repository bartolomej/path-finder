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

export function showAlert (message) {
  const container = document.createElement('div');
  container.classList.add('alert');
  const text = document.createElement('span');
  text.innerText = message;
  container.appendChild(text);
  document.body.appendChild(container);
  setTimeout(() => {
    container.style.display = 'none';
  }, 3500);
}
