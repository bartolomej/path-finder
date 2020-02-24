import { random, remove } from "./utils";


export const NodeType = {
  CURRENT: 'current',
  UNVISITED: 'unvisited',
  VISITED: 'visited',
  START: 'start',
  END: 'end',
  WALL: 'wall',
  PATH: 'path'
};

export default class Node {

  constructor (id) {
    this.id = id;
    this.edges = null;
    this.type = NodeType.UNVISITED;
    this.domElement = null;
    this.visited = false;
  }

  removeEdges () {
    for (let i = this.edges.length - 1; i >= 0; i--) {
      this.removeEdge(this.edges[i]);
    }
  }

  isStartOrEnd () {
    return this.type === NodeType.START || this.type === NodeType.END;
  }

  mark (type) {
    this.type = type;
    this.updateDom();
  }

  markVisited () {
    this.visited = true;
  }

  markWall () {
    this.type = NodeType.WALL;
    this.updateDom();
  }

  invert () {
    if (this.type === NodeType.WALL) {
      this.type = NodeType.UNVISITED;
    } else if (this.type === NodeType.UNVISITED) {
      this.type = NodeType.WALL;
    }
    this.updateDom();
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

  unvisitedNeighbours () {
    const unvisited = [];
    for (let edge of this.edges) {
      if (!edge.visited) {
        unvisited.push(edge);
      }
    }
    return unvisited;
  }

  removeEdge (node) {
    remove(node.edges, this);
    remove(this.edges, node);
  }

  equals (node) {
    return (
      this.id[0] === node.id[0] &&
      this.id[1] === node.id[1]
    )
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

}
