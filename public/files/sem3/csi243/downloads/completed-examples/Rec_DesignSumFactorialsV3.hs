-- Title: Sum factorials at even indices
{-
QUESTION
Write sumFac with the signature below. Reject negative n with Nothing.
Return the sum of k! for even k between zero and n inclusive.
-}

-- Read the question: Write sumFac with the stated domain and result type.
-- Plan: Stop the index at its lower bound; factorial itself decreases to zero.
sumFac :: Int -> Maybe Integer
-- Base cases stop recursion; each recursive call reduces the stated measure.
sumFac n
  | n < 0 = Nothing
  | otherwise = Just (total n)
  where
    fac 0 = 1
    fac k = toInteger k * fac (k-1)
    total k
      | k < 0 = 0
      | otherwise = if even k then fac k + total (k-1) else total (k-1)

main :: IO ()
main = do
  print (sumFac (-1))  -- expected: Nothing
  print (sumFac 0)  -- expected: Just 1
  print (sumFac 1)  -- expected: Just 1
  print (sumFac 2)  -- expected: Just 3
  print (sumFac 4)  -- expected: Just 27
