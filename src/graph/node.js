export const NodeType = {
  UNVISITED: 'unvisited',
  VISITED: 'visited',
  START: 'start',
  END: 'end',
  WALL: 'wall',
  PATH: 'path'
};

export default class Node {

  constructor (id) {
    this.position = id;
    this.edges = null;
    this.type = NodeType.UNVISITED;
    this.domElement = null;
    this.visited = false;
  }

  get id () {
    return `${this.position[0]}-${this.position[1]}`;
  }

  neighbours (includeWalls = false) {
    let results = [];
    if (this.type === NodeType.WALL) {
      return [];
    }
    for (let e of this.edges) {
      if (e.type !== NodeType.WALL || includeWalls) {
        results.push(e);
      }
    }
    return results;
  }

  visitedNeighbours () {
    const visited = [];
    for (let edge of this.edges) {
      if (edge.visited) {
        visited.push(edge);
      }
    }
    return visited;
  }

  unvisitedNeighbours (includeWalls = false) {
    const unvisited = [];
    for (let edge of this.edges) {
      if (!edge.visited && (edge.type !== NodeType.WALL || includeWalls)) {
        unvisited.push(edge);
      }
    }
    return unvisited;
  }

  isStartOrEnd () {
    return this.type === NodeType.START || this.type === NodeType.END;
  }

  mark (type) {
    this.type = type;
    this.updateDom();
  }

  invert () {
    if (this.type === NodeType.WALL) {
      this.mark(NodeType.UNVISITED);
    } else if (this.type === NodeType.UNVISITED) {
      this.mark(NodeType.WALL);
    }
    this.updateDom();
  }

  reset () {
    this.visited = false;
  }

  equals (node) {
    return node.id === this.id;
  }

  updateDom () {
    if (this.domElement) {
      this.domElement.classList = [this.type];
    }
  }

  generateDom () {
    this.domElement = document.createElement('td');
    this.domElement.id = this.id;
    this.domElement.class = this.type;
    this.updateDom();
  }

  static strIdToArray (str) {
    return str.split('-').map(parseFloat);
  }

  static resetNodes (nodes) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes[i].length; j++) {
        nodes[i][j].reset();
      }
    }
  }

}
