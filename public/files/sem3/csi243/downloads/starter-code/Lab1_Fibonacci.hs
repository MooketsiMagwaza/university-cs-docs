-- Title: Define Fibonacci numbers and dry run F5
{-
QUESTION
Write fib :: Integer -> Integer for nonnegative indices.
Use fib 0 = 0, fib 1 = 1, and fib n = fib (n-1) + fib (n-2).
Dry run F5; the result is 5.
Reject negative indices with an informative error.
-}

fib :: Integer -> Integer
fib = undefined -- Your answer here

main :: IO ()
main = do
  print (fib 0)  -- expected: 0
  print (fib 1)  -- expected: 1
  print (fib 2)  -- expected: 1
  print (fib 5)  -- expected: 5
  print (fib 6)  -- expected: 8
