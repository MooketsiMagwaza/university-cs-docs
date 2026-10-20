-- Title: Produce running products using scanl
{-
QUESTION
Write running :: [Integer] -> [Integer] using scanl (*) 1. [4]
Retain the initial seed and every intermediate accumulator.
-}

running :: [Integer] -> [Integer]
running = undefined  -- Your answer here

main :: IO ()
main = do
  print (running [])  -- expected: [1]
  print (running [5])  -- expected: [1,5]
  print (running [1,2])  -- expected: [1,1,2]
  print (running [1,2,3])  -- expected: [1,1,2,6]
  print (running [2,3,4])  -- expected: [1,2,6,24]
