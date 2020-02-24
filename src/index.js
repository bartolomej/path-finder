import "./styles/style.css";
import "./styles/grid.css";
import "./styles/controls.css";
import Grid from "./grid";
import { SelectionInput } from "./inputs";


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
  const algorithmsInput = new SelectionInput('Algorithms', [
    { name: "Dijkstra's algorithm", id: 'da' }
  ], controlsContainer);
  algorithmsInput.onInput = function (value) {
    console.log(value)
  };

  const patternsInput = new SelectionInput('Wall patterns', [
    { name: 'Recursive backtrack maze', id: 'rbm' }
  ], controlsContainer);
  patternsInput.onInput = async function (value) {
    if (value === 'rbm') {
      await grid.generateMaze();
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
