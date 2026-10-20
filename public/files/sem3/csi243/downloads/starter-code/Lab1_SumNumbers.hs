-- Title: Sum positive integers up to and including n
{-
QUESTION
Write a recursive function sumNumbers :: Integer -> Integer.
Compute the sum of all positive whole numbers up to and including n.
For n = 0 return 0; reject negative n. State the base and recursive cases.
-}

sumNumbers :: Integer -> Integer
sumNumbers = undefined -- Your answer here

main :: IO ()
main = do
  print (sumNumbers 0)  -- expected: 0
  print (sumNumbers 1)  -- expected: 1
  print (sumNumbers 2)  -- expected: 3
  print (sumNumbers 3)  -- expected: 6
  print (sumNumbers 5)  -- expected: 15
