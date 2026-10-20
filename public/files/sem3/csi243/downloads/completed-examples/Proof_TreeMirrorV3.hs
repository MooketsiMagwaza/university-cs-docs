-- Title: Prove mirroring a tree twice restores it
{-
QUESTION
Claim: mirror (mirror t) = t for every finite total tree t.
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

{-
Claim: mirror (mirror t) = t for every finite total tree t. -- stated goal
Induct on: t. -- mirror follows the tree structure
Base case: t = Leaf. -- constructor with no subtrees
mirror (mirror Leaf) = mirror Leaf -- inner mirror base equation
= Leaf -- outer mirror base equation
Hypotheses: mirror (mirror l) = l and mirror (mirror r) = r. -- smaller subtrees
Step: t = Node l x r. -- node constructor
mirror (mirror (Node l x r)) = mirror (Node (mirror r) x (mirror l)) -- inner mirror equation
= Node (mirror (mirror l)) x (mirror (mirror r)) -- outer mirror equation
= Node l x r -- both inductive hypotheses
Conclusion: the claim holds for every finite total tree. -- structural induction with two hypotheses
-}

main :: IO ()
main = do
  print (all (\t -> mirror (mirror t) == t) ([Leaf] :: [Tree Integer]))  -- expected: True
  print (all (\t -> mirror (mirror t) == t) ([Leaf,Node Leaf 1 Leaf] :: [Tree Integer]))  -- expected: True
  print (all (\t -> mirror (mirror t) == t) ([Leaf,Node Leaf 1 Leaf,Node (Node Leaf 1 Leaf) 2 Leaf] :: [Tree Integer]))  -- expected: True
  print (all (\t -> mirror (mirror t) == t) ([Leaf,Node Leaf 1 Leaf,Node (Node Leaf 1 Leaf) 2 Leaf,Node Leaf 2 (Node Leaf 3 Leaf)] :: [Tree Integer]))  -- expected: True
  print (all (\t -> mirror (mirror t) == t) ([Leaf,Node Leaf 1 Leaf,Node (Node Leaf 1 Leaf) 2 Leaf,Node Leaf 2 (Node Leaf 3 Leaf),Node (Node Leaf 1 Leaf) 2 (Node Leaf 3 Leaf)] :: [Tree Integer]))  -- expected: True
