import Node, { NodeType } from "./node";
import "./grid.css";


export default class Grid {

  constructor (dimensions) {
    this.dimensions = dimensions;
    this.nodes = [];
    this.edges = [];
    this.mouseDown = false;
    this.overNode = null;
    this.domElement = null;
    this.stepDuration = 100;
  }

  update () {
    if (this.mouseDown) {
      this.overNode.invert();
    }
  }

  registerListeners () {
    document.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onMouseDown () {
    this.mouseDown = true;
    this.update();
  }

  onMouseUp () {
    this.mouseDown = false;
    this.update();
  }

  initializeNodes () {
    for (let i = 0; i < this.dimensions[1]; i++) {
      const row = [];
      for (let j = 0; j < this.dimensions[0]; j++) {
        row.push(new Node([i, j]));
      }
      this.nodes.push(row)
    }

    const y = Math.round(this.nodes.length / 2);
    const x0 = Math.round(this.nodes[0].length / 3);
    const x1 = this.nodes[0].length - x0;
    this.nodes[y][x0].type = NodeType.START;
    this.nodes[y][x1].type = NodeType.END;
  }

  initializeEdges () {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[0].length; j++) {
        const node = this.nodes[i][j];
        node.edges = this.neighbors(node);
      }
    }
  }

  choosePath () {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[0].length; j++) {
        this.nodes[i][j].domElement.addEventListener(
          'mouseover',
          this.onMouseOverNode.bind(this)
        );
      }
    }
  }

  onMouseOverNode(e) {
    const id = e.target.id.split(',').map(parseFloat);
    this.overNode = this.nodes[id[0]][id[1]];
    this.update();
  }

  generateDom (parentDiv) {
    this.domElement = document.createElement('table');
    parentDiv.appendChild(this.domElement);
    const tbody = document.createElement('tbody');
    this.domElement.appendChild(tbody);
    for (let i = 0; i < this.nodes.length; i++) {
      const tr = document.createElement('tr');
      tbody.appendChild(tr);
      for (let j = 0; j < this.nodes[0].length; j++) {
        this.nodes[i][j].generateDom();
        tr.appendChild(this.nodes[i][j].domElement);
      }
    }
  }

  neighbors (node) {
    const result = [];
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    for (let dir of directions) {
      const x = node.id[0] + dir[0];
      const y = node.id[1] + dir[1];
      if (this.nodeExists([x, y])) {
        result.push([x, y]);
      }
    }
    return result;
  }

  nodeExists (id) {
    try {
      return (
        this.nodes[id[0]][id[1]] !== undefined &&
        this.nodes[id[0]][id[1]].type !== NodeType.WALL
      );
    } catch {
      return false
    }
  }

}
