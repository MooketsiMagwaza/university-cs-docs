-- Title: Compare factorial sum with a running-factorial algorithm
{-
QUESTION
Write sumFac with the signature below. Reject negative n with Nothing.
Return whether a recursive sum of factorials agrees with an accumulator
that updates the factorial once per index. These are finite checks.
-}

sumFac :: Int -> Maybe Bool
sumFac = undefined -- Your answer here

main :: IO ()
main = do
  print (sumFac (-1))  -- expected: Nothing
  print (sumFac 0)  -- expected: Just True
  print (sumFac 1)  -- expected: Just True
  print (sumFac 2)  -- expected: Just True
  print (sumFac 4)  -- expected: Just True
