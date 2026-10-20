-- Title: Implement binary tree size
{-
QUESTION
Given the declaration below, write size :: Tree a -> Integer. [7]
Write size to count nodes, and height :: Tree a -> Integer to count levels.
Both functions return 0 for Leaf; height adds 1 to the larger subtree height.
data Tree a = Leaf | Node (Tree a) a (Tree a) deriving (Show,Eq)
-}

-- Read the question: Write size :: Tree a -> Integer; height :: Tree a -> Integer.
-- Plan: Match Leaf and Node; recurse on the relevant smaller subtrees.
data Tree a = Leaf | Node (Tree a) a (Tree a) deriving (Show,Eq)

size :: Tree a -> Integer
size Leaf = 0
size (Node l _ r) = size l + 1 + size r

height :: Tree a -> Integer
height Leaf = 0
height (Node l _ r) = 1 + max (height l) (height r)  -- Longest path.

main :: IO ()
main = do
  print ((size (Leaf :: Tree Int),height (Leaf :: Tree Int)))  -- expected: (0,0)
  print ((size (Node Leaf 7 Leaf),height (Node Leaf 7 Leaf)))  -- expected: (1,1)
  print ((size (Node (Node Leaf 1 Leaf) 2 (Node Leaf 3 Leaf)),height (Node (Node Leaf 1 Leaf) 2 (Node Leaf 3 Leaf))))  -- expected: (3,2)
  print (height (Node (Node (Node Leaf 1 Leaf) 2 Leaf) 3 Leaf))  -- expected: 3
  print (size (Node Leaf 0 (Node Leaf 1 Leaf)))  -- expected: 2
