export const flashcardData = [
  { front: "Adjacency Matrix", back: "2D Array (V x V). O(1) edge lookup, O(V^2) space. Best for dense graphs." },
  { front: "Adjacency List", back: "Array of Lists. O(V + E) space. Best for sparse graphs. Edge lookup takes O(degree)." },
  { front: "BFS (Breadth-First Search)", back: "Uses a Queue. Explores level-by-level. Finds the shortest path in unweighted graphs. Time: O(V + E)." },
  { front: "DFS (Depth-First Search)", back: "Uses a Stack (or recursion). Explores as deep as possible before backtracking. Time: O(V + E)." },
  { front: "Dijkstra's Algorithm", back: "Finds shortest path from a single source. Uses a Min-Priority Queue. Fails on negative edge weights. Time: O((V + E) log V)." },
  { front: "Bellman-Ford Algorithm", back: "Finds shortest path and detects negative weight cycles. Relaxes all edges V-1 times. Time: O(V * E)." },
  { front: "Topological Sort", back: "Linear ordering of vertices in a DAG. Can be done via DFS (post-order) or Kahn's Algorithm (BFS with in-degrees)." },
  { front: "Kruskal's MST", back: "Sort all edges by weight. Add to MST if it doesn't form a cycle (checked via Union-Find). Time: O(E log E)." },
  { front: "Prim's MST", back: "Grow a single tree from a starting node. Always pick the cheapest edge connecting the tree to a new node. Time: O(E log V)." },
  { front: "Union-Find (Disjoint Set)", back: "Tracks connected components. Uses Path Compression and Union by Rank to achieve near O(1) amortized time." }
];