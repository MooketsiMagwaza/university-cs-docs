-- Title: Find test and assignment totals for each student.
{-
QUESTION
Write markTotals :: [[Int]] -> [(Int,Int)] using a comprehension.
Each row is [T1,T2,A1,A2,A3]. Return the total of the two tests and
the total of the three assignments. Skip malformed rows.
-}

-- Read the question: Write an Int row-to-pair comprehension.
-- Plan: Add each group of marks instead of dividing.
markTotals :: [[Int]] -> [(Int, Int)]
-- Only a five-element row matches this generator pattern.
markTotals rows = [(t1+t2,a1+a2+a3) | [t1,t2,a1,a2,a3] <- rows]

main :: IO ()
main = do
  print (markTotals [])  -- expected: []
  print (markTotals [[0,0,0,0,0]])  -- expected: [(0,0)]
  print (markTotals [[1,2,3,4,5]])  -- expected: [(3,12)]
  print (markTotals [[20,35,67,89,11]])  -- expected: [(55,167)]
  print (markTotals [[1],[10,20,30,40,50]])  -- expected: [(30,120)]
