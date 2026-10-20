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

import qualified Data.List as List

-- Read the question: Write the listed pure collection functions.
-- Plan: Sort and remove duplicates, then build fresh lists for updates and algebra.
buildSet :: [String] -> [String]
buildSet = List.nub . List.sort

editSet :: String -> String -> [String] -> ([String],[String],[String],Bool,Int)
editSet added removed xs = (original, inserted, deleted, added `elem` original,
                           length original)
  where
    original = buildSet xs
    inserted = buildSet (added : original)
    deleted = filter (/= removed) inserted

setAlgebra :: [String] -> [String] -> ([String],[String],[String])
setAlgebra xs ys = (buildSet (left ++ right), common, difference)
  where
    left = buildSet xs
    right = buildSet ys
    -- Filter the canonical left set to preserve ascending unique order.
    common = filter (`elem` right) left
    difference = filter (`notElem` right) left

main :: IO ()
main = do
  print (buildSet [])  -- expected: []
  print (buildSet ["b","A","b","a"])  -- expected: ["A","a","b"]
  print (editSet "b" "a" ["b","a","b"])  -- expected: (["a","b"],["a","b"],["b"],True,2)
  print (editSet "c" "z" ["a","b"])  -- expected: (["a","b"],["a","b","c"],["a","b","c"],False,2)
  print (setAlgebra ["c","a","a"] ["b","c"])  -- expected: (["a","b","c"],["c"],["a"])
  print (setAlgebra [] [""])  -- expected: ([""],[],[])
