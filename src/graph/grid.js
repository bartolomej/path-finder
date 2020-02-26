import Node, { NodeType } from "./node";
import GridInteraction from "./interaction";


export default class Grid {

  constructor (dimensions, parent) {
    this.parent = parent;
    this.dimensions = dimensions;
    this.nodes = [];
    this.edges = [];
    this.domElement = null;
    this.startNode = null;
    this.endNode = null;
    this.interaction = null;
  }

  init () {
    if (!this.parent) {
      throw new Error('Parent not set');
    }
    this.initializeNodes();
    this.initializeEdges();
    this.generateDom(this.parent);
    this.initInteraction();
  }

  initInteraction () {
    this.interaction = new GridInteraction(this.parent, this.nodes);
    this.interaction.onNodeDrag = (drag, over, prev) => {
      const dragType = drag.type;
      if (dragType === NodeType.START || dragType === NodeType.END) {
        over.mark(dragType);
        prev.mark(NodeType.UNVISITED)
      }
      if (!over.isStartOrEnd() && !drag.isStartOrEnd()) {
        over.invert();
      }
    };
    this.interaction.onNodeClick = node => {
      if (!node.isStartOrEnd()) {
        node.invert();
      }
    }
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
    this.startNode = this.nodes[y][x0];
    this.startNode.mark(NodeType.START);
    this.endNode = this.nodes[y][x1];
    this.endNode.mark(NodeType.END);
  }

  initializeEdges () {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[0].length; j++) {
        const node = this.nodes[i][j];
        node.edges = this.neighbors(node);
      }
    }
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
      const x = node.position[0] + dir[0];
      const y = node.position[1] + dir[1];
      if (this.nodeExists([x, y])) {
        result.push(this.nodes[x][y]);
      }
    }
    return result;
  }

  nodeExists (pos) {
    try {
      return (
        this.nodes[pos[0]][pos[1]] !== undefined &&
        this.nodes[pos[0]][pos[1]].type !== NodeType.WALL
      );
    } catch {
      return false
    }
  }

}
