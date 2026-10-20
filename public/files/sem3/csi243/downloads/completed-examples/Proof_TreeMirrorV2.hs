-- Title: Prove mirroring preserves tree height
{-
QUESTION
Claim: height (mirror t) = height t for every finite total tree t.
Prove the claim by structural induction on t. [8]
Give separate hypotheses for the two subtrees and a reason on every line.
Use the following definitions.
-}

-- Read the question: Prove the universal claim for the stated domain by induction.
-- Plan: Handle Leaf, then apply both hypotheses in the Node case.
data Tree a = Leaf | Node (Tree a) a (Tree a) deriving (Eq,Show)

mirror :: Tree a -> Tree a
mirror Leaf = Leaf
mirror (Node l x r) = Node (mirror r) x (mirror l)

height :: Tree a -> Integer
height Leaf = 0
height (Node l _ r) = 1 + max (height l) (height r)

{-
Claim: height (mirror t) = height t for every finite total tree t. -- stated goal
Induct on: t. -- mirror follows the tree structure
Base case: t = Leaf. -- constructor with no subtrees
height (mirror Leaf) = height Leaf -- mirror base equation
Hypotheses: height (mirror l) = height l and height (mirror r) = height r. -- two smaller subtrees
Step: t = Node l x r. -- node constructor
height (mirror (Node l x r)) = height (Node (mirror r) x (mirror l)) -- mirror recursive equation
= 1 + max (height (mirror r)) (height (mirror l)) -- height recursive equation
= 1 + max (height r) (height l) -- both inductive hypotheses
= 1 + max (height l) (height r) -- symmetry of max
= height (Node l x r) -- height recursive equation, backwards
Conclusion: the claim holds for every finite total tree. -- structural induction with two hypotheses
-}

main :: IO ()
main = do
  print (all (\t -> height (mirror t) == height t) ([Leaf] :: [Tree Integer]))  -- expected: True
  print (all (\t -> height (mirror t) == height t) ([Leaf,Node Leaf 1 Leaf] :: [Tree Integer]))  -- expected: True
  print (all (\t -> height (mirror t) == height t) ([Leaf,Node Leaf 1 Leaf,Node (Node Leaf 1 Leaf) 2 Leaf] :: [Tree Integer]))  -- expected: True
  print (all (\t -> height (mirror t) == height t) ([Leaf,Node Leaf 1 Leaf,Node (Node Leaf 1 Leaf) 2 Leaf,Node Leaf 2 (Node Leaf 3 Leaf)] :: [Tree Integer]))  -- expected: True
  print (all (\t -> height (mirror t) == height t) ([Leaf,Node Leaf 1 Leaf,Node (Node Leaf 1 Leaf) 2 Leaf,Node Leaf 2 (Node Leaf 3 Leaf),Node (Node Leaf 1 Leaf) 2 (Node Leaf 3 Leaf)] :: [Tree Integer]))  -- expected: True
