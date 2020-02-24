import { pause, random } from "./utils";
import { NodeType } from "./node";


export const pattern = {
  recursiveBacktrack
};

export const search = {
  breathFirstSearch
};

async function recursiveBacktrack (nodes) {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes[0].length; j++) {
      if (i % 5 === 0) await pause(1);
      const node = nodes[i][j];
      if (!node.isStartOrEnd()) {
        nodes[i][j].mark(NodeType.WALL, false); // TODO: quirky solutions !!
      }
    }
  }
  let current = nodes[0][0];
  current.visited = true;
  let stack = [current];
  while (stack.length > 0) {
    await pause(3);
    let edges = current.unvisitedNeighbours();
    let next = edges[random(edges.length - 1)];
    while (next && (
      next.visitedNeighbours().length > 2 || // TODO: multiple complexity options
      next.isStartOrEnd()
    )) {
      let index = random(edges.length - 1);
      next = edges[index];
      edges.splice(index, 1);
    }
    if (next) {
      next.visited = true;
      current.mark(NodeType.UNVISITED);
      stack.push(current);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    }
  }
  // TODO: very quirky indeed
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes[0].length; j++) {
      const node = nodes[i][j];
      if (node.type === NodeType.WALL) {
        node.removeEdges();
      }
    }
  }
}

async function breathFirstSearch (startNode, endNode) {
  let from = {};
  let frontier = [startNode];
  from[startNode.strId] = startNode;
  while (!from[endNode.strId]) {
    let current = frontier.shift();
    // color the node if not start or end node
    if (!current.isStartOrEnd()) {
      current.mark(NodeType.VISITED);
    }
    for (let next of current.edges) {
      await pause(5);
      if (!from[next.strId]) {
        if (!next.isStartOrEnd()) {
          next.mark(NodeType.VISITED);
        }
        frontier.push(next);
        from[next.strId] = current;
      }
    }
  }
  let fromNode = endNode;
  while (!fromNode.equals(startNode)) {
    await pause(5);
    const toNode = from[fromNode.strId];
    if (!toNode.isStartOrEnd()) {
      toNode.mark(NodeType.PATH);
    }
    fromNode = toNode;
  }
}


