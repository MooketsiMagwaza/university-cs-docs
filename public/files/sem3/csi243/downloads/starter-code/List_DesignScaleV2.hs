-- Title: Sum even values using explicit recursion
{-
QUESTION
Write sums xs, returning the sum of the even integers.
Ignore odd integers; zero is even and the empty sum is zero.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

sums :: [Integer] -> Integer
sums = undefined -- Your answer here

main :: IO ()
main = do
  print (sums [])  -- expected: 0
  print (sums [2])  -- expected: 2
  print (sums [1,3,5])  -- expected: 0
  print (sums [-4,-1,2,0,6])  -- expected: 4
  print (sums [2,2])  -- expected: 4
