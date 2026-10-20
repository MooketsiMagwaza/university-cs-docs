-- Title: Compare a functional formula with an explicit state model
{-
QUESTION
Write compareModels :: [Integer] -> (Integer, Integer, Bool).
Compute the sum of squares first using sum and map, then by a recursive
simulation of a procedural loop carrying a running total. Return both
totals and equality. Both implementations here are pure Haskell.
Classify the descriptions in comments: the formula is declarative/
functional; a mutable running-total loop is procedural/imperative;
an object storing a total and exposing methods would be object-oriented.
OO is about objects and encapsulated behaviour, not just inheritance.
These models agree on all finite lists; tests alone are not a proof.
-}

compareModels :: [Integer] -> (Integer, Integer, Bool)
compareModels = undefined -- Your answer here

main :: IO ()
main = do
  print (compareModels [])  -- expected: (0,0,True)
  print (compareModels [0])  -- expected: (0,0,True)
  print (compareModels [3])  -- expected: (9,9,True)
  print (compareModels [-2,1])  -- expected: (5,5,True)
  print (compareModels [1,2,3])  -- expected: (14,14,True)
