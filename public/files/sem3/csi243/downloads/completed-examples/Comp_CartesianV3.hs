-- Title: Generate index pairs above the diagonal
{-
QUESTION
Write upperPairs :: Int -> [(Int,Int)] with dependent generators. [4]
Return all (i,j) with 1 <= i < j <= n, in increasing i then j order.
-}

-- Read the question: Write upperPairs :: Int -> [(Int,Int)].
-- Plan: Start the second generator just above the first index.
upperPairs :: Int -> [(Int,Int)]
upperPairs n = [(i,j) | i <- [1..n], j <- [i+1..n]]  -- Strict upper triangle.

main :: IO ()
main = do
  print (upperPairs 0)  -- expected: []
  print (upperPairs 1)  -- expected: []
  print (upperPairs 2)  -- expected: [(1,2)]
  print (upperPairs 3)  -- expected: [(1,2),(1,3),(2,3)]
  print (upperPairs 4)  -- expected: [(1,2),(1,3),(1,4),(2,3),(2,4),(3,4)]
