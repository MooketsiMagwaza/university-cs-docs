-- Title: Define a self-referential Lucas stream
{-
QUESTION
Write fibs :: [Integer] with first two values 2 and 1. [5]
Every later value is the sum of the previous two. Use zipWith (+),
fibs and tail fibs; do not use indexing or explicit numeric recursion.
-}

fibs :: [Integer]
fibs = undefined  -- Your answer here

main :: IO ()
main = do
  print (take 0 fibs)  -- expected: []
  print (take 1 fibs)  -- expected: [2]
  print (take 2 fibs)  -- expected: [2,1]
  print (take 8 fibs)  -- expected: [2,1,3,4,7,11,18,29]
  print (takeWhile (<10) fibs)  -- expected: [2,1,3,4,7]
