import Grid from "./grid";


describe('Grid tests', function () {

  it('should generate grid', function () {
    const dimensions = [5, 6];
    const grid = new Grid(dimensions);
    grid.initializeNodes();

    expect(grid.nodes.length).toBe(dimensions[1]);
    expect(grid.nodes[0].length).toBe(dimensions[0]);

    for (let i = 0; i < dimensions[1]; i++) {
      for (let j = 0; j < dimensions[0]; j++) {
        expect(grid.nodes[i][j].id).toEqual([i, j]);
      }
    }
  });

  it('should determine if node exists', function () {
    const dimensions = [3, 4];
    const grid = new Grid(dimensions);
    grid.initializeNodes();

    for (let i = 0; i < dimensions[1]; i++) {
      for (let j = 0; j < dimensions[0]; j++) {
        expect(grid.nodeExists(grid.nodes[i][j].id)).toBe(true);
      }
    }

    expect(grid.nodeExists([-1, 0])).toBe(false);
    expect(grid.nodeExists([-1, -1])).toBe(false);
    expect(grid.nodeExists([0, 4])).toBe(false);
    expect(grid.nodeExists([4, 0])).toBe(false);
    expect(grid.nodeExists([4, 3])).toBe(false);
  });

  it('should compute neighbors for node', function () {
    const dimensions = [4, 3];
    const grid = new Grid(dimensions);
    grid.initializeNodes();

    const edges0 = grid.neighbors(grid.nodes[0][0]);
    expect(edges0).toEqual([[0, 1], [1, 0]]);

    const edges1 = grid.neighbors(grid.nodes[1][1]);
    expect(edges1).toEqual([[0, 1], [1, 2], [2, 1], [1, 0]]);

    const edges2 = grid.neighbors(grid.nodes[2][3]);
    expect(edges2).toEqual([[1, 3], [2, 2]]);
  });

});
