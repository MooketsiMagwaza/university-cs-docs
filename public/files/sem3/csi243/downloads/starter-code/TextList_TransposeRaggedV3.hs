-- Title: Sum columns of a ragged integer matrix
{-
QUESTION
Write columnTotals :: [[Int]] -> [Int] using transpose and map sum.
Ignore missing positions, rather than truncating at the shortest row.
-}

columnTotals :: [[Int]] -> [Int]
columnTotals = undefined -- Your answer here

main :: IO ()
main = do
  print (columnTotals [])  -- expected: []
  print (columnTotals [[]])  -- expected: []
  print (columnTotals [[1,2],[3,4]])  -- expected: [4,6]
  print (columnTotals [[1,2,3],[4],[5,6]])  -- expected: [10,8,3]
  print (columnTotals [[],[-2,5],[2]])  -- expected: [0,5]
