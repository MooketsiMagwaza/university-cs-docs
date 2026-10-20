-- Title: Implement binary tree insert
{-
QUESTION
Given the declaration below, write insert :: Ord a => a -> Tree a -> Tree a. [7]
Insert into a binary search tree. Values smaller than a node go left,
larger values go right; duplicates leave the tree unchanged.
data Tree a = Leaf | Node (Tree a) a (Tree a) deriving (Show,Eq)
-}

data Tree a = Leaf | Node (Tree a) a (Tree a) deriving (Show,Eq)

insert :: Ord a => a -> Tree a -> Tree a
insert = undefined  -- Your answer here

main :: IO ()
main = do
  print (insert (2 :: Int) Leaf)  -- expected: Node Leaf 2 Leaf
  print (insert 2 (Node Leaf 2 Leaf))  -- expected: Node Leaf 2 Leaf
  print (insert 1 (Node Leaf 2 Leaf))  -- expected: Node (Node Leaf 1 Leaf) 2 Leaf
  print (insert 3 (Node Leaf 2 Leaf))  -- expected: Node Leaf 2 (Node Leaf 3 Leaf)
  print (insert 0 (Node (Node Leaf 1 Leaf) 2 (Node Leaf 3 Leaf)))  -- expected: Node (Node (Node Leaf 0 Leaf) 1 Leaf) 2 (Node Leaf 3 Leaf)
