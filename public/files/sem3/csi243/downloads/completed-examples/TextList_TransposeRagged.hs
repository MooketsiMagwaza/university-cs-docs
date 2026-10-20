-- Title: Transpose integer rows using library ragged-list semantics
{-
QUESTION
Write columns :: [[Int]] -> [[Int]] using Data.List.transpose.
Empty rows contribute no element. A short row stops contributing without
truncating longer rows. Do not pad missing entries.
-}

import Data.List (transpose)

-- Read the question: Write columns :: [[Int]] -> [[Int]]; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
columns :: [[Int]] -> [[Int]]
-- Key step: the library operation also handles empty input.
columns = transpose

main :: IO ()
main = do
  print (columns [])  -- expected: []
  print (columns [[]])  -- expected: []
  print (columns [[1,2],[3,4]])  -- expected: [[1,3],[2,4]]
  print (columns [[1,2,3],[4],[5,6]])  -- expected: [[1,4,5],[2,6],[3]]
  print (columns [[],[7,8],[]])  -- expected: [[7],[8]]
