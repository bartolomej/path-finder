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
    this.id = id;
    this.type = NodeType.UNVISITED;
    this.domElement = null;
  }

  invert () {
    if (this.type === NodeType.WALL) {
      this.type = NodeType.UNVISITED;
    }
    else if (this.type === NodeType.UNVISITED) {
      this.type = NodeType.WALL;
    }
    this.updateDom();
  }

  updateDom () {
    this.domElement.classList = [this.type];
  }

  generateDom () {
    this.domElement = document.createElement('td');
    this.domElement.id = this.id;
    this.domElement.class = this.type;
    this.updateDom();
  }

}
