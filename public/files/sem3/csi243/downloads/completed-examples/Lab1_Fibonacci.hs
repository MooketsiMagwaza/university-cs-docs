-- Title: Define Fibonacci numbers and dry run F5
{-
QUESTION
Write fib :: Integer -> Integer for nonnegative indices.
Use fib 0 = 0, fib 1 = 1, and fib n = fib (n-1) + fib (n-2).
Dry run F5; the result is 5.
Reject negative indices with an informative error.
-}

-- Read the question: Write fib :: Integer -> Integer.
-- Plan: Supply two base cases because each recursive step uses two earlier terms.
-- Dry run: fib 5 = fib 4 + fib 3 = (2 + 1) + (1 + 1) = 5.
fib :: Integer -> Integer
fib n
  | n < 0 = error "fib: negative index"
  | n == 0 = 0 -- First base case.
  | n == 1 = 1 -- Second base case.
  | otherwise = fib (n - 1) + fib (n - 2)

main :: IO ()
main = do
  print (fib 0)  -- expected: 0
  print (fib 1)  -- expected: 1
  print (fib 2)  -- expected: 1
  print (fib 5)  -- expected: 5
  print (fib 6)  -- expected: 8
