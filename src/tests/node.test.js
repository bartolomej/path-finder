import Node, { NodeType } from "../graph/node";


describe('Node tests', function () {

  it('should mark node as wall', function () {
    const n1 = new Node([0, 0]);
    const n2 = new Node([0, 1]);
    const n3 = new Node([1, 0]);

    n1.edges = [n2, n3];
    n2.edges = [n1];
    n3.edges = [n1];

    expect(n1.neighbours().length).toBe(2);

    n2.mark(NodeType.WALL);

    expect(n1.neighbours().length).toBe(1);
    expect(n2.neighbours().length).toBe(0);
  });

});
