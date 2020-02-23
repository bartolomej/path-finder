import "./style.css"
import Grid from "./grid";


window.addEventListener('load', init);

function init () {
  const controlsContainer = document.getElementById('controls-container');

  const gridContainer = document.createElement('div');
  gridContainer.id = 'grid-container';
  document.body.append(gridContainer);

  const ratio =  window.innerWidth / (window.innerHeight - controlsContainer.clientHeight);
  const x = 40;
  const y = x / (Math.round(ratio * 10) / 10);

  const grid = new Grid([x, y]);
  grid.initializeNodes();
  grid.generateDom(gridContainer);
  grid.registerListeners();
  grid.choosePath();
}
