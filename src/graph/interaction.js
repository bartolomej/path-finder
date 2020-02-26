import Node from "./node";
import { cloneObjectOfClass } from "../utils/utils";


export default class GridInteraction {

  constructor (parent, nodes) {
    this.nodes = nodes;
    this.parent = parent;
    this.overNode = null;
    this.prevOverNode = null;
    this.mouseDown = false;
    this.clickedTimestamp = null;

    this.onNodeOver = null;
    this.onNodeDrag = null;
    this.onNodeClick = null;

    this.registerListeners();
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
    if (!this.prevOverNode) {
      this.prevOverNode = this.overNode;
    }
    call(this.onNodeOver, this.overNode);
    if (this.dragNode && this.mouseDown) {
      call(this.onNodeDrag, [this.dragNode, this.overNode, this.prevOverNode]);
    }
    this.prevOverNode = this.overNode;
  }

  onMouseDown (e) {
    this.clickedTimestamp = e.timeStamp;
    this.mouseDown = true;
    this.dragNode = null;
    this.dragNode = cloneObjectOfClass(this.overNode)
  }

  onMouseUp (e) {
    this.mouseDown = false;
    const timestamp = e.timeStamp;
    if (timestamp - this.clickedTimestamp < 500) {
      call(this.onNodeClick, this.overNode);
    }
  }

}

function call (fn, params) {
  if (fn && typeof fn === "function") {
    if (params instanceof Array) {
      fn.apply(null, params);
    } else {
      fn.apply(null, [params]);
    }
  }
}
