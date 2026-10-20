-- Title: Compare factorial sum with a running-factorial algorithm
{-
QUESTION
Write sumFac with the signature below. Reject negative n with Nothing.
Return whether a recursive sum of factorials agrees with an accumulator
that updates the factorial once per index. These are finite checks.
-}

-- Read the question: Write sumFac with the stated domain and result type.
-- Plan: Stop the index at its lower bound; factorial itself decreases to zero.
sumFac :: Int -> Maybe Bool
-- Base cases stop recursion; each recursive call reduces the stated measure.
sumFac n
  | n < 0 = Nothing
  | otherwise = Just (total n == running 0 1 0)
  where
    fac 0 = 1
    fac k = toInteger k * fac (k-1)
    total k
      | k < 0 = 0
      | otherwise = fac k + total (k-1)
    running k f acc
      | k > n = acc
      | otherwise = running (k+1) (f * toInteger (k+1)) (acc+f)

main :: IO ()
main = do
  print (sumFac (-1))  -- expected: Nothing
  print (sumFac 0)  -- expected: Just True
  print (sumFac 1)  -- expected: Just True
  print (sumFac 2)  -- expected: Just True
  print (sumFac 4)  -- expected: Just True
