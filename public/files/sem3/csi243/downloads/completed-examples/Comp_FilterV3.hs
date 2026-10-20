-- Title: Select valid passing marks with a comprehension
{-
QUESTION
Write select :: [Integer] -> [Integer] using a comprehension. [4]
Keep only valid passing marks, preserving order and duplicates.
-}

-- Read the question: Write select :: [Integer] -> [Integer].
-- Plan: Generate each element and retain it when the predicate is true.
select :: [Integer] -> [Integer]
select xs = [x | x <- xs, x >= 50 && x <= 100]  -- Test after generation.

main :: IO ()
main = do
  print (select [])  -- expected: []
  print (select [50])  -- expected: [50]
  print (select [49,50,100,101])  -- expected: [50,100]
  print (select [-1,0,99])  -- expected: [99]
  print (select [60,60,40])  -- expected: [60,60]
