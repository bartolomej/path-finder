import "./styles/style.css";
import "./styles/grid.css";
import "./styles/controls.css";
import "./styles/select.css";
import "./styles/modal.css";
import Grid from "./graph/grid";
import { pattern, search } from "./graph/algorithms";
import { showAlert } from "./utils";
import links from "./links";


window.addEventListener('load', init);
let algorithmsInput;
let patternsInput;

async function init () {
  renderControls();
  renderGrid();
  renderLinks();
  renderModal();
}

function renderLinks () {
  const container = document.getElementById('cool-links');
  const title = document.createElement('h1');
  title.innerText = '🔥 Awesome projects 🔥';
  container.appendChild(title);
  const list = document.createElement('div');
  list.classList.add('link-list');
  container.appendChild(list);
  for (let link of links) {
    list.appendChild(createListItem(link));
  }
  const btnContainer = document.createElement('div');
  btnContainer.innerHTML = `
    <button class="naked has-prev">Back</button>
    <button class="has-next">Next</button>
  `;
  container.appendChild(btnContainer);

  function createListItem (item) {
    const container = document.createElement('a');
    container.href = item.url;
    container.target = '_blank';
    container.classList.add('link-item');
    const image = document.createElement('img');
    image.src = item.image || 'https://retohercules.com/images/link-png-icon-1.png';
    container.appendChild(image);
    if (item.title) {
      const title = document.createElement('span');
      title.innerText = item.title;
      container.appendChild(title);
    }
    if (item.description) {
      const description = document.createElement('p');
      description.innerText = item.description;
      container.appendChild(description);
    }
    return container;
  }
}

function renderControls () {
  algorithmsInput = easydropdown('#algorithms-input', {
    callbacks: {
      onSelect: async value => {
        grid.resetPath();
        try {
          if (value === 'bfs') {
            await search.breathFirstSearch(grid.startNode, grid.endNode);
          }
          if (value === 'dfs') {
            await search.depthFirstSearch(grid.startNode, grid.endNode);
          }
        } catch (e) {
          showAlert(e.message);
        }
      }
    }
  });
  patternsInput = easydropdown('#patterns-input', {
    callbacks: {
      onSelect: async value => {
        grid.resetPath();
        if (value === 'bm') {
          await pattern.recursiveBacktrack(grid.nodes);
        }
      }
    }
  });
  easydropdown.all();
  document.getElementById('reset').addEventListener('click', () => {
    window.grid.reset();
    algorithmsInput.value = 'none';
    patternsInput.value = 'none';
  });
  document.getElementById('about').addEventListener('click', () => {
    renderModal();
  });
}

function renderGrid () {
  const gridContainer = document.createElement('div');
  const controlsContainer = document.getElementById('controls-container');
  gridContainer.id = 'grid-container';
  document.getElementById('container').append(gridContainer);
  const ratio = window.innerWidth / (window.innerHeight - controlsContainer.clientHeight);
  const x = 50;
  const y = x / (Math.round(ratio * 10) / 10);
  const grid = new Grid([x, y], gridContainer);
  grid.init();
  window.grid = grid;
}

function renderModal () {
  resetDomState();
  renderPage(-1, 0);
  $("#intro-modal").modal({
    fadeDuration: 700,
    fadeDelay: 0.30,
  });
  const nextButtons = document.querySelectorAll('button.has-next');
  const backButtons = document.querySelectorAll('button.has-prev');
  const closeButton = document.getElementById('close-modal');
  nextButtons.forEach((btn, i) => btn.addEventListener('click', _ => renderPage(i, i + 1)));
  backButtons.forEach((btn, i) => btn.addEventListener('click', _ => renderPage(i + 1, i)));
  closeButton.addEventListener('click', () => {
    $('#intro-modal').modal('toggle');
    $('.jquery-modal').fadeOut('normal');
  });

  function renderPage (prevIndex = -1, nextIndex = 0) {
    const container = document.getElementsByClassName('modal-inner')[0];
    const nextPage = container.children[nextIndex];
    const prevPage = container.children[prevIndex] || null;
    if (nextIndex > prevIndex) {
      nextPage.classList.add('float-in');
      if (prevPage) {
        prevPage.classList.replace('float-in', 'float-out');
      }
    }
    if (nextIndex < prevIndex) {
      nextPage.classList.replace('float-out', 'float-in');
      prevPage.classList.remove('float-in')
    }
  }

  function resetDomState () {
    const container = document.getElementsByClassName('modal-inner')[0];
    const children = container.children;
    for (let child of children) {
      child.classList.remove('float-out');
      child.classList.remove('float-in');
    }
  }
}
