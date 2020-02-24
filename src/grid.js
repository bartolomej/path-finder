import Node, { NodeType } from "./node";


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
    // TODO: better design this interaction (maybe abstract in its own class)
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
      (this.overNode.equals(this.startNode) || this.draggingNodeType === NodeType.START)
    ) {
      this.draggingNodeType = NodeType.START;
      this.overNode.mark(NodeType.START);
      handleDrag();
    }
    if (
      this.mouseDown &&
      (this.overNode.equals(this.endNode) || this.draggingNodeType === NodeType.END)
    ) {
      this.draggingNodeType = NodeType.END;
      this.overNode.mark(NodeType.END);
      handleDrag();
    } else if (this.mouseDown) {
      this.overNode.invert();
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
  }

  registerListeners () {
    this.parent.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.parent.addEventListener('mouseup', this.onMouseUp.bind(this));
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

  onMouseOverNode (e) {
    const id = Node.strIdToArray(e.target.id);
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
