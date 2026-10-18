export const flashcardData = [
  { front: "BST Left Subtree Maximum", back: "Move left exactly once from the root, then move right as far as possible until `node.right == null`." },
  { front: "Post-Order Traversal", back: "Left $\\rightarrow$ Right $\\rightarrow$ Root. Used for tree deletion and generating postfix expressions." },
  { front: "Adjacency List to Matrix", back: "Initialize $V \\times V$ matrix with 0. Iterate list, set `matrix[u][v] = 1`. Time: $\\mathcal{O}(V^2 + E)$." },
  { front: "BST Construction", back: "Insert elements one by one. $\\mathcal{O}(N \\log N)$ average, $\\mathcal{O}(N^2)$ worst-case if inserted in sorted order." },
  { front: "In-Order Traversal", back: "Left $\\rightarrow$ Root $\\rightarrow$ Right. Yields elements in strictly ascending order for a valid BST." },
  { front: "Pre-Order Traversal", back: "Root $\\rightarrow$ Left $\\rightarrow$ Right. Used to copy the tree or generate prefix expressions." },
  { front: "AVL Tree Balance Factor", back: "Height(Left) - Height(Right). Must be -1, 0, or 1. Triggers rotation if violated." },
  { front: "Red-Black Tree", back: "Self-balancing BST using color properties. Allows slightly taller trees than AVL, resulting in fewer rotations during insertion." },
  { front: "Trie (Prefix Tree)", back: "Nodes represent characters. $\\mathcal{O}(L)$ search time where $L$ is string length. Ideal for autocomplete." },
  { front: "Heapify", back: "Converts an arbitrary array into a valid heap in $\\mathcal{O}(N)$ time by sifting down from the last non-leaf node." },
  { front: "Lowest Common Ancestor (BST)", back: "Traverse from root. If both targets are smaller, go left. If larger, go right. The split point is the LCA." },
  { front: "Morris Traversal", back: "In-order traversal in $\\mathcal{O}(1)$ space by temporarily creating 'threads' from the rightmost left-child back to the root." },
  { front: "Huffman Coding", back: "Builds a binary tree based on character frequency. Frequent chars get shorter binary codes. Lossless compression." },
  { front: "Complete Binary Tree", back: "All levels fully filled except possibly the last, which is filled left-to-right. Ideal for array-based heaps." },
  { front: "Graph Adjacency Matrix", back: "$V \\times V$ 2D array. $\\mathcal{O}(1)$ edge lookup, $\\mathcal{O}(V^2)$ space. Best for dense graphs." }
];