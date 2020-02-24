import Node from "../node";


describe('Node tests', function () {

  it('should remove edge', function () {
    const n1 = new Node([0, 0]);
    const n2 = new Node([0, 1]);
    const n3 = new Node([1, 0]);

    n1.edges = [n2, n3];
    n2.edges = [n1];
    n3.edges = [n1];

    n1.removeEdge(n2);

    expect(n1.edges.length).toBe(1);
    expect(n1.edges[0].id).toEqual([1, 0]);
    expect(n2.edges.length).toBe(0);
    expect(n3.edges.length).toBe(1);
    expect(n3.edges[0].id).toEqual([0, 0]);
  });

  it('should return unvisited neighbours', function () {
    const n1 = new Node([0, 0]);
    const n2 = new Node([0, 1]);
    const n3 = new Node([1, 0]);

    n1.edges = [n2, n3];
    n2.edges = [n1];
    n3.edges = [n1];

    const unvisited2 = n1.unvisitedNeighbours();
    expect(unvisited2.length).toBe(2);

    n2.visited = true;

    const unvisited1 = n1.unvisitedNeighbours();
    expect(unvisited1.length).toBe(1);
  });

  it('should return visited neighbours', function () {
    const n1 = new Node([0, 0]);
    const n2 = new Node([0, 1]);
    const n3 = new Node([1, 0]);

    n1.edges = [n2, n3];
    n2.edges = [n1];
    n3.edges = [n1];

    const edges0 = n1.visitedNeighbours();
    expect(edges0.length).toEqual(0);

    n2.visited = true;
    n3.visited = true;

    const edges1 = n1.visitedNeighbours();
    expect(edges1.length).toEqual(2);
  });

});
