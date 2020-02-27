import "./styles/style.css";
import "./styles/grid.css";
import "./styles/controls.css";
import "./styles/select-theme.css"
import Grid from "./graph/grid";
import { pattern, search } from "./graph/algorithms";


window.addEventListener('load', init);

async function init () {
  renderControls();
  renderGrid();
  renderModal();
}

function renderControls () {
  easydropdown('#algorithms-input', {
    callbacks: {
      onSelect: async value => {
        grid.resetPath();
        if (value === 'bfs') {
          await search.breathFirstSearch(grid.startNode, grid.endNode);
        }
        if (value === 'dfs') {
          await search.depthFirstSearch(grid.startNode, grid.endNode);
        }
      }
    }
  });
  easydropdown('#patterns-input', {
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
  const x = 40;
  const y = x / (Math.round(ratio * 10) / 10);
  const grid = new Grid([x, y], gridContainer);
  grid.init();
  window.grid = grid;
}

function renderModal () {
  renderPage(0);
  document.getElementById('intro-modal').style.display = 'unset';
  $("#intro-modal").modal({
    fadeDuration: 1000,
    fadeDelay: 0.50,
    closeClass: 'close-modal'
  });
  const buttons = document.querySelectorAll('button.has-next');
  const closeButton = document.getElementById('close-modal');
  buttons.forEach((btn, i) => btn.addEventListener('click', e => {
    renderPage(i + 1);
  }));
  closeButton.addEventListener('click', () => {
    $('#intro-modal').modal('toggle');
    $('.jquery-modal').fadeOut('normal');
  });
  function renderPage (index) {
    const container = document.getElementsByClassName('modal-inner')[0];
    for (let i = 0; i < container.children.length; i++) {
      if (i === index) {
        container.children[i].style.display = 'flex'
      } else {
        container.children[i].style.display = 'none'
      }
    }
  }
}
