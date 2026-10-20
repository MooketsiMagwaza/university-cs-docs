-- Title: Produce running differences using scanl
{-
QUESTION
Write running :: [Integer] -> [Integer] using scanl (-) 0. [4]
Retain the initial seed and every intermediate accumulator.
-}

running :: [Integer] -> [Integer]
running = undefined  -- Your answer here

main :: IO ()
main = do
  print (running [])  -- expected: [0]
  print (running [5])  -- expected: [0,-5]
  print (running [1,2])  -- expected: [0,-1,-3]
  print (running [1,2,3])  -- expected: [0,-1,-3,-6]
  print (running [2,3,4])  -- expected: [0,-2,-5,-9]
