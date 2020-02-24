import "./styles/style.css";
import "./styles/grid.css";
import "./styles/controls.css";
import Grid from "./grid";
import { SelectionInput } from "./inputs";
import { pattern, search } from "./algorithms";


let grid;
let controlsContainer;
let gridContainer;

window.addEventListener('load', init);

async function init () {
  controlsContainer = document.getElementById('controls-container');
  gridContainer = document.createElement('div');
  gridContainer.id = 'grid-container';
  document.body.append(gridContainer);
  renderControls();
  renderGrid();
}

function renderControls () {
  const searchInput = new SelectionInput('Algorithms', [
    { name: "Breath First Search", id: 'BFS' }
  ], controlsContainer);
  searchInput.onInput = async function (value) {
    if (value === 'BFS') {
      await search.breathFirstSearch(grid.startNode, grid.endNode);
    }
  };

  const patternInput = new SelectionInput('Wall patterns', [
    { name: 'Recursive backtrack maze', id: 'RBT' }
  ], controlsContainer);
  patternInput.onInput = async function (value) {
    if (value === 'RBT') {
      await pattern.recursiveBacktrack(grid.nodes);
    }
  };
}

function renderGrid () {
  const ratio = window.innerWidth / (window.innerHeight - controlsContainer.clientHeight);
  const x = 40;
  const y = x / (Math.round(ratio * 10) / 10);
  grid = null;
  grid = new Grid([x, y], gridContainer);
  window.grid = grid;
}
