-- Title: Calculate pairwise sums using zipWith
{-
QUESTION
Write combine :: [Integer] -> [Integer] -> [Integer] using zipWith. [3]
Return pairwise sums; stop when either input ends.
-}

-- Read the question: Write combine :: [Integer] -> [Integer] -> [Integer].
-- Plan: Use the arithmetic operator as the two-argument combining function.
combine :: [Integer] -> [Integer] -> [Integer]
combine = zipWith (+)  -- Unmatched elements are ignored.

main :: IO ()
main = do
  print (combine [] [])  -- expected: []
  print (combine [1] [])  -- expected: []
  print (combine [2] [3])  -- expected: [5]
  print (combine [1,2,3] [10,20])  -- expected: [11,22]
  print (combine [-1,0] [4,3,9])  -- expected: [3,3]
