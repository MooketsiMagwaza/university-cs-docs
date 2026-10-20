-- Title: Implement binary tree inorder
{-
QUESTION
Given the declaration below, write inorder :: Tree a -> [a]. [7]
Return the node values in left subtree, root, right subtree order.
data Tree a = Leaf | Node (Tree a) a (Tree a) deriving (Show,Eq)
-}

data Tree a = Leaf | Node (Tree a) a (Tree a) deriving (Show,Eq)

inorder :: Tree a -> [a]
inorder = undefined  -- Your answer here

main :: IO ()
main = do
  print (inorder (Leaf :: Tree Int))  -- expected: []
  print (inorder (Node Leaf 7 Leaf))  -- expected: [7]
  print (inorder (Node (Node Leaf 1 Leaf) 2 (Node Leaf 3 Leaf)))  -- expected: [1,2,3]
  print (inorder (Node Leaf 'a' (Node Leaf 'b' Leaf)))  -- expected: "ab"
  print (inorder (Node (Node Leaf True Leaf) False Leaf))  -- expected: [True,False]
