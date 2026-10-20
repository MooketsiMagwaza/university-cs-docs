-- Title: Prove mirroring a tree twice restores it
{-
QUESTION
Claim: mirror (mirror t) = t for every finite total tree t.
Prove the claim by structural induction on t. [8]
Give separate hypotheses for the two subtrees and a reason on every line.
Use the following definitions.
-}

data Tree a = Leaf | Node (Tree a) a (Tree a) deriving (Eq,Show)

mirror :: Tree a -> Tree a
mirror Leaf = Leaf
mirror (Node l x r) = Node (mirror r) x (mirror l)

{- Write your proof here -}

main :: IO ()
main = do
  print (all (\t -> mirror (mirror t) == t) ([Leaf] :: [Tree Integer]))  -- expected: True
  print (all (\t -> mirror (mirror t) == t) ([Leaf,Node Leaf 1 Leaf] :: [Tree Integer]))  -- expected: True
  print (all (\t -> mirror (mirror t) == t) ([Leaf,Node Leaf 1 Leaf,Node (Node Leaf 1 Leaf) 2 Leaf] :: [Tree Integer]))  -- expected: True
  print (all (\t -> mirror (mirror t) == t) ([Leaf,Node Leaf 1 Leaf,Node (Node Leaf 1 Leaf) 2 Leaf,Node Leaf 2 (Node Leaf 3 Leaf)] :: [Tree Integer]))  -- expected: True
  print (all (\t -> mirror (mirror t) == t) ([Leaf,Node Leaf 1 Leaf,Node (Node Leaf 1 Leaf) 2 Leaf,Node Leaf 2 (Node Leaf 3 Leaf),Node (Node Leaf 1 Leaf) 2 (Node Leaf 3 Leaf)] :: [Tree Integer]))  -- expected: True
