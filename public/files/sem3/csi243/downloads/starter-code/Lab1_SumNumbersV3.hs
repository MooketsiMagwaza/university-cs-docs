-- Title: Sum the first n positive odd integers
{-
QUESTION
Write a recursive function sumOdds :: Integer -> Integer.
Compute 1 + 3 + ... + (2*n - 1).
For n = 0 return 0; reject negative n. State the base and recursive cases.
-}

sumOdds :: Integer -> Integer
sumOdds = undefined -- Your answer here

main :: IO ()
main = do
  print (sumOdds 0)  -- expected: 0
  print (sumOdds 1)  -- expected: 1
  print (sumOdds 2)  -- expected: 4
  print (sumOdds 3)  -- expected: 9
  print (sumOdds 5)  -- expected: 25
