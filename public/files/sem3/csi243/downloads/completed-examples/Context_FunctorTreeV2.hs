-- Title: Map a custom Tree and check the Functor laws
{-
QUESTION
Write treeReport :: [Int] -> ([Int], Bool, Bool). In this program define
data Tree a = Leaf | Node (Tree a) a (Tree a) deriving (Eq, Show).
Write a hand-written Functor instance mapping every stored value.
Build a right-spined tree from the input in list order. Use fmap to
double each value; return its inorder list, the identity-law check, and
the composition-law check for f = (+ 1), g = (* 2).
Check laws on the original tree. Tree is a type constructor; Tree Int
is a concrete type. A Haskell Functor is not a parameterised module.
Finite tests illustrate laws; justify the instance for both constructors.
-}

-- Read the question: Write a definition; treeReport has input/result type [Int] -> ([Int], Bool, Bool).
-- Plan: Build the tree, map its values, then compare both sides of each law.
data Tree a = Leaf | Node (Tree a) a (Tree a) deriving (Eq, Show)

instance Functor Tree where
  -- Leaf has no value; Node maps its value and both subtrees.
  fmap _ Leaf = Leaf
  fmap f (Node l x r) = Node (fmap f l) (f x) (fmap f r)

{- Law proof by structural induction:
Leaf: both laws reduce to Leaf.
Node: identity follows from id x = x and each subtree hypothesis.
Composition follows from (f . g) x = f (g x) and both hypotheses.
-}

treeReport :: [Int] -> ([Int], Bool, Bool)
treeReport xs =
  (walk (fmap (* 2) t), fmap id t == t,
   fmap ((+ 1) . (* 2)) t == (fmap (+ 1) . fmap (* 2)) t)
  where
    t = foldr (Node Leaf) Leaf xs
    walk Leaf = []
    walk (Node l x r) = walk l ++ [x] ++ walk r

main :: IO ()
main = do
  print (treeReport [])  -- expected: ([],True,True)
  print (treeReport [0])  -- expected: ([0],True,True)
  print (treeReport [1,2])  -- expected: ([2,4],True,True)
  print (treeReport [-2,0,3])  -- expected: ([-4,0,6],True,True)
  print (treeReport [4,4])  -- expected: ([8,8],True,True)
