-- Title: Sum columns of a ragged integer matrix
{-
QUESTION
Write columnTotals :: [[Int]] -> [Int] using transpose and map sum.
Ignore missing positions, rather than truncating at the shortest row.
-}

import Data.List (transpose)

-- Read the question: Write columnTotals :: [[Int]] -> [Int]; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
columnTotals :: [[Int]] -> [Int]
-- Key step: the library operation also handles empty input.
columnTotals = map sum . transpose

main :: IO ()
main = do
  print (columnTotals [])  -- expected: []
  print (columnTotals [[]])  -- expected: []
  print (columnTotals [[1,2],[3,4]])  -- expected: [4,6]
  print (columnTotals [[1,2,3],[4],[5,6]])  -- expected: [10,8,3]
  print (columnTotals [[],[-2,5],[2]])  -- expected: [0,5]
