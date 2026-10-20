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

treeReport :: [Int] -> ([Int], Bool, Bool)
treeReport = undefined -- Your answer here

main :: IO ()
main = do
  print (treeReport [])  -- expected: ([],True,True)
  print (treeReport [0])  -- expected: ([0],True,True)
  print (treeReport [1,2])  -- expected: ([2,4],True,True)
  print (treeReport [-2,0,3])  -- expected: ([-4,0,6],True,True)
  print (treeReport [4,4])  -- expected: ([8,8],True,True)
