-- Title: Calculate pairwise differences using zipWith
{-
QUESTION
Write combine :: [Integer] -> [Integer] -> [Integer] using zipWith. [3]
Return pairwise differences; stop when either input ends.
-}

combine :: [Integer] -> [Integer] -> [Integer]
combine = undefined  -- Your answer here

main :: IO ()
main = do
  print (combine [] [])  -- expected: []
  print (combine [1] [])  -- expected: []
  print (combine [2] [3])  -- expected: [-1]
  print (combine [1,2,3] [10,20])  -- expected: [-9,-18]
  print (combine [-1,0] [4,3,9])  -- expected: [-5,-3]
