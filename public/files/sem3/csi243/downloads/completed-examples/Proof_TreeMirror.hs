-- Title: Prove mirroring preserves tree size
{-
QUESTION
Claim: size (mirror t) = size t for every finite total tree t.
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

size :: Tree a -> Integer
size Leaf = 0
size (Node l _ r) = size l + 1 + size r

{-
Claim: size (mirror t) = size t for every finite total tree t. -- stated goal
Induct on: t. -- mirror follows the tree structure
Base case: t = Leaf. -- constructor with no subtrees
size (mirror Leaf) = size Leaf -- mirror base equation
Hypotheses: size (mirror l) = size l and size (mirror r) = size r. -- two smaller subtrees
Step: t = Node l x r. -- node constructor
size (mirror (Node l x r)) = size (Node (mirror r) x (mirror l)) -- mirror recursive equation
= size (mirror r) + 1 + size (mirror l) -- size recursive equation
= size r + 1 + size l -- both inductive hypotheses
= size l + 1 + size r -- commutativity and associativity of addition
= size (Node l x r) -- size recursive equation, backwards
Conclusion: the claim holds for every finite total tree. -- structural induction with two hypotheses
-}

main :: IO ()
main = do
  print (all (\t -> size (mirror t) == size t) ([Leaf] :: [Tree Integer]))  -- expected: True
  print (all (\t -> size (mirror t) == size t) ([Leaf,Node Leaf 1 Leaf] :: [Tree Integer]))  -- expected: True
  print (all (\t -> size (mirror t) == size t) ([Leaf,Node Leaf 1 Leaf,Node (Node Leaf 1 Leaf) 2 Leaf] :: [Tree Integer]))  -- expected: True
  print (all (\t -> size (mirror t) == size t) ([Leaf,Node Leaf 1 Leaf,Node (Node Leaf 1 Leaf) 2 Leaf,Node Leaf 2 (Node Leaf 3 Leaf)] :: [Tree Integer]))  -- expected: True
  print (all (\t -> size (mirror t) == size t) ([Leaf,Node Leaf 1 Leaf,Node (Node Leaf 1 Leaf) 2 Leaf,Node Leaf 2 (Node Leaf 3 Leaf),Node (Node Leaf 1 Leaf) 2 (Node Leaf 3 Leaf)] :: [Tree Integer]))  -- expected: True
