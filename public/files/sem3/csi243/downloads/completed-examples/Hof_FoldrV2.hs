-- Title: Compute a weighted right fold
{-
QUESTION
Write collapse :: [Integer] -> Integer using foldr (\x acc -> x + 2*acc) 0. [4]
Apply the combining function from the right; use 0 for [].
-}

-- Read the question: Write collapse :: [Integer] -> Integer.
-- Plan: Replace each cons by the combining function and [] by the seed.
collapse :: [Integer] -> Integer
collapse = foldr (\x acc -> x + 2*acc) 0  -- The tail is folded before combining the head.

main :: IO ()
main = do
  print (collapse [])  -- expected: 0
  print (collapse [5])  -- expected: 5
  print (collapse [1,2])  -- expected: 5
  print (collapse [1,2,3])  -- expected: 17
  print (collapse [2,3,4])  -- expected: 24
