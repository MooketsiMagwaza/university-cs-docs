-- Title: Compute right-associated subtraction
{-
QUESTION
Write collapse :: [Integer] -> Integer using foldr (-) 0. [4]
Apply the combining function from the right; use 0 for [].
-}

collapse :: [Integer] -> Integer
collapse = undefined  -- Your answer here

main :: IO ()
main = do
  print (collapse [])  -- expected: 0
  print (collapse [5])  -- expected: 5
  print (collapse [1,2])  -- expected: -1
  print (collapse [1,2,3])  -- expected: 2
  print (collapse [2,3,4])  -- expected: 3
