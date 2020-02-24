import Node, { NodeType } from "./node";
import { pause, random } from "./utils";


export default class Grid {

  constructor (dimensions, parent) {
    this.parent = parent;
    this.dimensions = dimensions;
    this.nodes = [];
    this.edges = [];
    this.mouseDown = false;
    this.overNode = null;
    this.domElement = null;
    this.startNode = null;
    this.endNode = null;
    this.draggingNodeType = null;
    this.prevOverNode = null;
    this.init();
  }

  init () {
    this.initializeNodes();
    this.initializeEdges();
    this.generateDom(this.parent);
    this.registerListeners();
  }

  handleUserInteraction () {
    const handleDrag = () => {
      if (this.prevOverNode) {
        this.prevOverNode.mark(NodeType.UNVISITED);
        this.prevOverNode = this.overNode;
      } else {
        this.prevOverNode = this.overNode;
      }
    };
    if (
      this.mouseDown &&
      this.draggingNodeType !== NodeType.WALL &&
      (this.overNode.equals(this.startNode) || this.draggingNodeType === NodeType.START)
    ) {
      this.draggingNodeType = NodeType.START;
      this.overNode.mark(NodeType.START);
      handleDrag();
    }
    if (
      this.mouseDown &&
      this.draggingNodeType !== NodeType.WALL &&
      (this.overNode.equals(this.endNode) || this.draggingNodeType === NodeType.END)
    ) {
      this.draggingNodeType = NodeType.END;
      this.overNode.mark(NodeType.END);
      handleDrag();
    }
    else if (this.mouseDown) {
      this.overNode.invert();
      this.draggingNodeType = NodeType.WALL;
    }
    if (!this.mouseDown && this.draggingNodeType) {
      this.draggingNodeType = null;
      this.prevOverNode = null;
      if (this.overNode.type === NodeType.START) {
        this.startNode = this.overNode;
      }
      if (this.overNode.type === NodeType.END) {
        this.endNode = this.overNode;
      }
    }
    this.updateEdges();
  }

  registerListeners () {
    document.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.onMouseOverNodeListeners();
  }

  onMouseOverNodeListeners () {
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
    this.handleUserInteraction();
  }

  onMouseDown () {
    this.mouseDown = true;
    this.handleUserInteraction();
  }

  onMouseUp () {
    this.mouseDown = false;
    this.handleUserInteraction();
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

  updateEdges () {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[0].length; j++) {
        const node = this.nodes[i][j];
        if (node.type === NodeType.WALL) {
          node.removeEdges();
        }
      }
    }
  }

  initializeEdges () {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes[0].length; j++) {
        const node = this.nodes[i][j];
        node.edges = this.neighbors(node);
      }
    }
  }

  async generateMaze () {
    let stack = [];
    let current = this.nodes[0][0];
    current.markVisited();
    stack.push(current);
    while (stack.length > 0) {
      await pause(10);
      let edges = current.unvisitedNeighbours();
      let next = edges[random(edges.length - 1)];
      while (next && (next.visitedNeighbours().length > 1 || next.isStartOrEnd())) {
        let index = random(edges.length - 1);
        next = edges[index];
        edges.splice(index, 1);
      }
      if (next) {
        next.markVisited();
        current.markWall();
        stack.push(current);
        current = next;
      } else if (stack.length > 0) {
        current = stack.pop();
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
      const x = node.id[0] + dir[0];
      const y = node.id[1] + dir[1];
      if (this.nodeExists([x, y])) {
        result.push(this.nodes[x][y]);
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
