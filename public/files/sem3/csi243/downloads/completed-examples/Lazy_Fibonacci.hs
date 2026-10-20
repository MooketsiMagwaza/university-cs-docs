-- Title: Define a self-referential Fibonacci stream
{-
QUESTION
Write fibs :: [Integer] with first two values 0 and 1. [5]
Every later value is the sum of the previous two. Use zipWith (+),
fibs and tail fibs; do not use indexing or explicit numeric recursion.
-}

-- Read the question: Write fibs :: [Integer].
-- Plan: Seed two cells, then add two shifted views of the stream.
fibs :: [Integer]
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)  -- Seeds make the stream productive.

main :: IO ()
main = do
  print (take 0 fibs)  -- expected: []
  print (take 1 fibs)  -- expected: [0]
  print (take 2 fibs)  -- expected: [0,1]
  print (take 8 fibs)  -- expected: [0,1,1,2,3,5,8,13]
  print (takeWhile (<10) fibs)  -- expected: [0,1,1,2,3,5,8]
