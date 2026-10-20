-- Title: Find the first integer meeting a threshold
{-
QUESTION
Write firstAtLeast :: Int -> [Int] -> Maybe Int using find.
Return the first value at least the threshold, or Nothing if none exists.
-}

import Data.List (find)

-- Read the question: Write firstAtLeast :: Int -> [Int] -> Maybe Int; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
firstAtLeast :: Int -> [Int] -> Maybe Int
-- Key step: the library operation also handles empty input.
firstAtLeast n = find (>= n)

main :: IO ()
main = do
  print (firstAtLeast 3 [])  -- expected: Nothing
  print (firstAtLeast 3 [2])  -- expected: Nothing
  print (firstAtLeast 3 [3])  -- expected: Just 3
  print (firstAtLeast 3 [5,3,8])  -- expected: Just 5
  print (firstAtLeast 0 [-2,0,1])  -- expected: Just 0
