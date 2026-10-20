-- Title: Define a self-referential shifted Fibonacci stream
{-
QUESTION
Write fibs :: [Integer] with first two values 1 and 1. [5]
Every later value is the sum of the previous two. Use zipWith (+),
fibs and tail fibs; do not use indexing or explicit numeric recursion.
-}

fibs :: [Integer]
fibs = undefined  -- Your answer here

main :: IO ()
main = do
  print (take 0 fibs)  -- expected: []
  print (take 1 fibs)  -- expected: [1]
  print (take 2 fibs)  -- expected: [1,1]
  print (take 8 fibs)  -- expected: [1,1,2,3,5,8,13,21]
  print (takeWhile (<10) fibs)  -- expected: [1,1,2,3,5,8]
