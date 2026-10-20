-- Title: Average three tests and two assignments per student.
{-
QUESTION
Write revisedAverages :: [[Double]] -> [(Double,Double)] using a
comprehension. Each row now holds [T1,T2,T3,A1,A2]. Return the average
of the three tests and the average of the two assignments, without
rounding. Skip malformed rows.
-}

-- Read the question: Write a Double row-to-pair comprehension.
-- Plan: Match the revised layout and divide each group by its size.
revisedAverages :: [[Double]] -> [(Double, Double)]
-- The changed record layout needs different groups and divisors.
revisedAverages rows =
  [((t1+t2+t3)/3,(a1+a2)/2) | [t1,t2,t3,a1,a2] <- rows]

main :: IO ()
main = do
  print (revisedAverages [])  -- expected: []
  print (revisedAverages [[0,0,0,0,0]])  -- expected: [(0.0,0.0)]
  print (revisedAverages [[3,6,9,10,15]])  -- expected: [(6.0,12.5)]
  print (revisedAverages [[90,60,75,80,100]])  -- expected: [(75.0,90.0)]
  print (revisedAverages [[1,2],[1,1,1,2,3]])  -- expected: [(1.0,2.5)]
