-- Title: Prove mirroring preserves tree height
{-
QUESTION
Claim: height (mirror t) = height t for every finite total tree t.
Prove the claim by structural induction on t. [8]
Give separate hypotheses for the two subtrees and a reason on every line.
Use the following definitions.
-}

data Tree a = Leaf | Node (Tree a) a (Tree a) deriving (Eq,Show)

mirror :: Tree a -> Tree a
mirror Leaf = Leaf
mirror (Node l x r) = Node (mirror r) x (mirror l)

height :: Tree a -> Integer
height Leaf = 0
height (Node l _ r) = 1 + max (height l) (height r)

{- Write your proof here -}

main :: IO ()
main = do
  print (all (\t -> height (mirror t) == height t) ([Leaf] :: [Tree Integer]))  -- expected: True
  print (all (\t -> height (mirror t) == height t) ([Leaf,Node Leaf 1 Leaf] :: [Tree Integer]))  -- expected: True
  print (all (\t -> height (mirror t) == height t) ([Leaf,Node Leaf 1 Leaf,Node (Node Leaf 1 Leaf) 2 Leaf] :: [Tree Integer]))  -- expected: True
  print (all (\t -> height (mirror t) == height t) ([Leaf,Node Leaf 1 Leaf,Node (Node Leaf 1 Leaf) 2 Leaf,Node Leaf 2 (Node Leaf 3 Leaf)] :: [Tree Integer]))  -- expected: True
  print (all (\t -> height (mirror t) == height t) ([Leaf,Node Leaf 1 Leaf,Node (Node Leaf 1 Leaf) 2 Leaf,Node Leaf 2 (Node Leaf 3 Leaf),Node (Node Leaf 1 Leaf) 2 (Node Leaf 3 Leaf)] :: [Tree Integer]))  -- expected: True
