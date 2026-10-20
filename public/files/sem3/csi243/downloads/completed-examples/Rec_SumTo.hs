-- Title: Sum the first n integers recursively
{-
QUESTION
Write total :: Integer -> Integer using recursion for n >= 0. [4]
Return the sum of the first n integers. The empty sum is 0.
-}

-- Read the question: Write total :: Integer -> Integer.
-- Plan: Add the nth term to the total for n - 1.
total :: Integer -> Integer
total 0 = 0  -- Empty sum.
total n = n + total (n - 1)

main :: IO ()
main = do
  print (total 0)  -- expected: 0
  print (total 1)  -- expected: 1
  print (total 3)  -- expected: 6
  print (total 4)  -- expected: 10
  print (total 5)  -- expected: 15
