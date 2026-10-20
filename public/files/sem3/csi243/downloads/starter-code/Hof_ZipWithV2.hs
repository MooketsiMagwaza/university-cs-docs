-- Title: Calculate pairwise products using zipWith
{-
QUESTION
Write combine :: [Integer] -> [Integer] -> [Integer] using zipWith. [3]
Return pairwise products; stop when either input ends.
-}

combine :: [Integer] -> [Integer] -> [Integer]
combine = undefined  -- Your answer here

main :: IO ()
main = do
  print (combine [] [])  -- expected: []
  print (combine [1] [])  -- expected: []
  print (combine [2] [3])  -- expected: [6]
  print (combine [1,2,3] [10,20])  -- expected: [10,40]
  print (combine [-1,0] [4,3,9])  -- expected: [-4,0]
