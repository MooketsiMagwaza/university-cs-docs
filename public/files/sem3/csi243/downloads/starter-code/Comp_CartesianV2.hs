-- Title: Build a table of pairwise sums
{-
QUESTION
Write sumTable :: [Integer] -> [Integer] -> [Integer] using a comprehension. [4]
Produce x+y for every pair, with x from the first list varying slowest.
-}

sumTable :: [Integer] -> [Integer] -> [Integer]
sumTable = undefined  -- Your answer here

main :: IO ()
main = do
  print (sumTable [] [1])  -- expected: []
  print (sumTable [1] [])  -- expected: []
  print (sumTable [1] [2])  -- expected: [3]
  print (sumTable [1,2] [-3,0,3])  -- expected: [-2,1,4,-1,2,5]
  print (sumTable [0,0] [1,2])  -- expected: [1,2,1,2]
