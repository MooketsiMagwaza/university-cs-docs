-- Title: Find the index of the first even integer
{-
QUESTION
Write firstEvenIndex :: [Int] -> Maybe Int using findIndex.
Indices start at zero. Return Nothing when there is no even integer.
-}

import Data.List (findIndex)

-- Read the question: Write firstEvenIndex :: [Int] -> Maybe Int; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
firstEvenIndex :: [Int] -> Maybe Int
-- Key step: the library operation also handles empty input.
firstEvenIndex = findIndex even

main :: IO ()
main = do
  print (firstEvenIndex [])  -- expected: Nothing
  print (firstEvenIndex [7])  -- expected: Nothing
  print (firstEvenIndex [8])  -- expected: Just 0
  print (firstEvenIndex [1,3,4,6])  -- expected: Just 2
  print (firstEvenIndex [2,2])  -- expected: Just 0
