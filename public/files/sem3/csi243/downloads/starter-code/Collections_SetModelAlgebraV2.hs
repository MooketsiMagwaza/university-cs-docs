-- Title: Model string sets with case-sensitive ordered traversal
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

buildSet :: [String] -> [String]
buildSet = undefined -- Your answer here

editSet :: String -> String -> [String] -> ([String],[String],[String],Bool,Int)
editSet = undefined -- Your answer here

setAlgebra :: [String] -> [String] -> ([String],[String],[String])
setAlgebra = undefined -- Your answer here

main :: IO ()
main = do
  print (buildSet [])  -- expected: []
  print (buildSet ["b","A","b","a"])  -- expected: ["A","a","b"]
  print (editSet "b" "a" ["b","a","b"])  -- expected: (["a","b"],["a","b"],["b"],True,2)
  print (editSet "c" "z" ["a","b"])  -- expected: (["a","b"],["a","b","c"],["a","b","c"],False,2)
  print (setAlgebra ["c","a","a"] ["b","c"])  -- expected: (["a","b","c"],["c"],["a"])
  print (setAlgebra [] [""])  -- expected: ([""],[],[])
