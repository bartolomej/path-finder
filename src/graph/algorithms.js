import { pause, random } from "../utils/utils";
import Node, { NodeType } from "./node";


export const pattern = {
  recursiveBacktrack
};

export const search = {
  breathFirstSearch,
  depthFirstSearch
};

async function recursiveBacktrack (nodes) {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes[0].length; j++) {
      if (i % 5 === 0) await pause(1);
      const node = nodes[i][j];
      if (!node.isStartOrEnd()) {
        nodes[i][j].mark(NodeType.WALL);
      }
    }
  }
  let current = nodes[0][0];
  current.visited = true;
  let stack = [current];
  while (stack.length > 0) {
    await pause(3);
    let edges = current.unvisitedNeighbours(true);
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
  Node.resetNodes(nodes);
}

async function depthFirstSearch (startNode, endNode) {
  let from = {};
  let branch = [startNode];
  from[startNode.id] = startNode;
  startNode.visited = true;
  let current = startNode;
  while (!from[endNode.id]) {
    if (current === undefined) {
      throw new Error("Path doesn't exist");
    }
    let edges = current.unvisitedNeighbours();
    await pause(3);
    if (edges.length === 0) {
      current = branch.pop();
    } else {
      const next = edges[0];
      next.mark(NodeType.VISITED);
      current.visited = true;
      from[next.id] = current;
      branch.push(next);
      current = branch[branch.length - 1];
    }
  }
  await animatePath(from, endNode, startNode)
}

async function breathFirstSearch (startNode, endNode) {
  let from = {};
  let frontier = [startNode];
  from[startNode.id] = startNode;
  while (!from[endNode.id]) {
    let current = frontier.shift();
    if (current === undefined) {
      throw new Error("Path doesn't exist")
    }
    // color the node if not start or end node
    if (!current.isStartOrEnd()) {
      current.mark(NodeType.VISITED);
    }
    for (let next of current.neighbours()) {
      await pause(3);
      if (!from[next.id]) {
        if (!next.isStartOrEnd()) {
          next.mark(NodeType.VISITED);
        }
        frontier.push(next);
        from[next.id] = current;
      }
    }
  }
  await animatePath(from, endNode, startNode)
}


async function animatePath (pathMap, fromNode, startNode) {
  while (!fromNode.equals(startNode)) {
    await pause(5);
    const toNode = pathMap[fromNode.id];
    if (!toNode.isStartOrEnd()) {
      toNode.mark(NodeType.PATH);
    }
    fromNode = toNode;
  }
}
