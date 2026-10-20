-- Title: Sum the squares from 1 up to n
{-
QUESTION
Write a recursive function sumSquares :: Integer -> Integer.
Compute 1^2 + 2^2 + ... + n^2.
For n = 0 return 0; reject negative n. State the base and recursive cases.
-}

sumSquares :: Integer -> Integer
sumSquares = undefined -- Your answer here

main :: IO ()
main = do
  print (sumSquares 0)  -- expected: 0
  print (sumSquares 1)  -- expected: 1
  print (sumSquares 2)  -- expected: 5
  print (sumSquares 3)  -- expected: 14
  print (sumSquares 5)  -- expected: 55
