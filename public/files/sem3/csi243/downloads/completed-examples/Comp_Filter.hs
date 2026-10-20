-- Title: Select even numbers with a comprehension
{-
QUESTION
Write select :: [Integer] -> [Integer] using a comprehension. [4]
Keep only even numbers, preserving order and duplicates.
-}

-- Read the question: Write select :: [Integer] -> [Integer].
-- Plan: Generate each element and retain it when the predicate is true.
select :: [Integer] -> [Integer]
select xs = [x | x <- xs, even x]  -- Test after generation.

main :: IO ()
main = do
  print (select [])  -- expected: []
  print (select [1])  -- expected: []
  print (select [0,1,2,3,4])  -- expected: [0,2,4]
  print (select [-3,-2,-1])  -- expected: [-2]
  print (select [6,6,7])  -- expected: [6,6]
