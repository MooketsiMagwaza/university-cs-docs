-- Title: Compute a product by right fold
{-
QUESTION
Write collapse :: [Integer] -> Integer using foldr (*) 1. [4]
Apply the combining function from the right; use 1 for [].
-}

collapse :: [Integer] -> Integer
collapse = undefined  -- Your answer here

main :: IO ()
main = do
  print (collapse [])  -- expected: 1
  print (collapse [5])  -- expected: 5
  print (collapse [1,2])  -- expected: 2
  print (collapse [1,2,3])  -- expected: 6
  print (collapse [2,3,4])  -- expected: 24
