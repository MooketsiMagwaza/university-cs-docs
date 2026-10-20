-- Title: Sum factorials below an exclusive bound
{-
QUESTION
Write sumFac with the signature below. Reject negative n with Nothing.
Return Just (0!+1!+...+(n-1)!). The empty sum at n=0 is zero.
-}

-- Read the question: Write sumFac with the stated domain and result type.
-- Plan: Stop the index at its lower bound; factorial itself decreases to zero.
sumFac :: Int -> Maybe Integer
-- Base cases stop recursion; each recursive call reduces the stated measure.
sumFac n
  | n < 0 = Nothing
  | otherwise = Just (total (n-1))
  where
    fac 0 = 1
    fac k = toInteger k * fac (k-1)
    total k
      | k < 0 = 0
      | otherwise = fac k + total (k-1)

main :: IO ()
main = do
  print (sumFac (-1))  -- expected: Nothing
  print (sumFac 0)  -- expected: Just 0
  print (sumFac 1)  -- expected: Just 1
  print (sumFac 2)  -- expected: Just 2
  print (sumFac 4)  -- expected: Just 10
