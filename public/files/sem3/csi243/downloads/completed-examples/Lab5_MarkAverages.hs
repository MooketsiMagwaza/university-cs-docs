-- Title: Find each student's test and assignment averages.
{-
QUESTION
Given student marks [T1,T2,A1,A2,A3], create a comprehension returning
a pair of test and assignment averages for each student. Define
markAverages :: [[Double]] -> [(Double,Double)]. Round each average to
one decimal place, as in the sheet example:
[[20,35,67,89,11],[45,78,90,12,34],[90,67,89,56,78]] gives
[(27.5,55.7),(61.5,45.3),(78.5,74.3)]. Skip rows not containing five marks.
-}

-- Read the question: Write a function from rows of marks to pairs of averages.
-- Plan: Match five marks per row and average the two groups separately.
markAverages :: [[Double]] -> [(Double, Double)]
-- A list pattern selects complete records; round only the final averages.
markAverages rows =
  [(oneDecimal ((t1+t2)/2), oneDecimal ((a1+a2+a3)/3))
  | [t1,t2,a1,a2,a3] <- rows]
  where
    oneDecimal :: Double -> Double
    oneDecimal x = fromIntegral (round (10*x) :: Integer) / 10

main :: IO ()
main = do
  print (markAverages [])  -- expected: []
  print (markAverages [[0,0,0,0,0]])  -- expected: [(0.0,0.0)]
  print (markAverages [[10,20,30,60,90]])  -- expected: [(15.0,60.0)]
  print (markAverages [[20,35,67,89,11],[45,78,90,12,34],[90,67,89,56,78]])  -- expected: [(27.5,55.7),(61.5,45.3),(78.5,74.3)]
  print (markAverages [[1,2],[2,3,6,6,6]])  -- expected: [(2.5,6.0)]
