-- Title: Return the sum and signed difference of two Double values.
{-
QUESTION
Write sumDifference :: (Double,Double) -> (Double,Double). Return the sum
and the first number minus the second, using a tuple pattern.
-}

sumDifference :: (Double, Double) -> (Double, Double)
sumDifference = undefined -- Your answer here

main :: IO ()
main = do
  print (sumDifference (2.5,1.5))  -- expected: (4.0,1.0)
  print (sumDifference (0,0))  -- expected: (0.0,0.0)
  print (sumDifference (1,3))  -- expected: (4.0,-2.0)
  print (sumDifference (-2,1))  -- expected: (-1.0,-3.0)
  print (sumDifference (4,4))  -- expected: (8.0,0.0)
