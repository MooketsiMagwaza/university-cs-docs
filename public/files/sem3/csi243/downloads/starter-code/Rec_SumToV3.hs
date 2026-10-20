-- Title: Sum the first n odd numbers recursively
{-
QUESTION
Write total :: Integer -> Integer using recursion for n >= 0. [4]
Return the sum of the first n odd numbers. The empty sum is 0.
-}

total :: Integer -> Integer
total = undefined  -- Your answer here

main :: IO ()
main = do
  print (total 0)  -- expected: 0
  print (total 1)  -- expected: 1
  print (total 3)  -- expected: 9
  print (total 4)  -- expected: 16
  print (total 5)  -- expected: 25
