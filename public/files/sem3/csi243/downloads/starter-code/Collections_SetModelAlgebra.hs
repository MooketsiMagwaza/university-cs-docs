-- Title: Model integer sets and their algebra using sorted lists
{-
QUESTION
Use only base to model a finite ordered set as a sorted duplicate-free
list. Actual Data.Set requires containers; this exercise models its
values and operations, not its balanced-tree representation. Write the
three functions with the signatures below. buildSet removes duplicates
and sorts ascending. editSet takes an inserted element, a deleted
element and input data, returning (original, after insertion, after
deletion, inserted-element membership in original, original size).
setAlgebra returns (union, intersection, left difference) with ascending
unique results. All updates are immutable; absent deletion does nothing.
-}

buildSet :: [Int] -> [Int]
buildSet = undefined -- Your answer here

editSet :: Int -> Int -> [Int] -> ([Int],[Int],[Int],Bool,Int)
editSet = undefined -- Your answer here

setAlgebra :: [Int] -> [Int] -> ([Int],[Int],[Int])
setAlgebra = undefined -- Your answer here

main :: IO ()
main = do
  print (buildSet [])  -- expected: []
  print (buildSet [3,1,3,2])  -- expected: [1,2,3]
  print (editSet 2 1 [2,1,2])  -- expected: ([1,2],[1,2],[2],True,2)
  print (editSet 3 9 [1,2])  -- expected: ([1,2],[1,2,3],[1,2,3],False,2)
  print (setAlgebra [3,1,1] [2,3])  -- expected: ([1,2,3],[3],[1])
  print (setAlgebra [] [2])  -- expected: ([2],[],[])
