-- Title: Sum whole numbers strictly below n
{-
QUESTION
Specify and implement a recursive function sumNumbers using guards.
Sum all positive whole numbers from 0 up to, but not including n.
For example, sumNumbers 10 returns 1+2+3+4+5+6+7+8+9 = 45.
For n <= 0 use the empty sum 0. State the base case and dry run an example.
-}

sumNumbers :: Int -> Int
sumNumbers = undefined -- Your answer here

main :: IO ()
main = do
  print (sumNumbers 0)  -- expected: 0
  print (sumNumbers 1)  -- expected: 0
  print (sumNumbers 2)  -- expected: 1
  print (sumNumbers 4)  -- expected: 6
  print (sumNumbers 10)  -- expected: 45
