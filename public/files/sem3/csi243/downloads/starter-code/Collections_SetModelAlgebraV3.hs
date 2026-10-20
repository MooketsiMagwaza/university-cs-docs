-- Title: Model character sets with duplicate-free string results
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

buildSet :: [Char] -> [Char]
buildSet = undefined -- Your answer here

editSet :: Char -> Char -> [Char] -> ([Char],[Char],[Char],Bool,Int)
editSet = undefined -- Your answer here

setAlgebra :: [Char] -> [Char] -> ([Char],[Char],[Char])
setAlgebra = undefined -- Your answer here

main :: IO ()
main = do
  print (buildSet "")  -- expected: ""
  print (buildSet "caba")  -- expected: "abc"
  print (editSet 'b' 'a' "aba")  -- expected: ("ab","ab","b",True,2)
  print (editSet 'c' 'z' "ab")  -- expected: ("ab","abc","abc",False,2)
  print (setAlgebra "caa" "bc")  -- expected: ("abc","c","a")
  print (setAlgebra "" "x")  -- expected: ("x","","")
