-- Title: Compare linear and halving power algorithms
{-
QUESTION
Write power with the signature below. Return Nothing for a negative
exponent; define x^0 as 1, including 0^0 for this algorithm.
Return whether linear recursion and halving recursion agree.
-}

-- Read the question: Write power with the stated domain and result type.
-- Plan: Use the exponent magnitude as the decreasing measure; zero yields one.
power :: Integer -> Int -> Maybe Bool
-- Base cases stop recursion; each recursive call reduces the stated measure.
power x n
  | n < 0 = Nothing
  | otherwise = Just (linear n == fast n)
  where
    linear 0 = 1
    linear k = x * linear (k-1)
    fast 0 = 1
    fast k
      | even k = h*h
      | otherwise = x*h*h
      where
        h = fast (k `div` 2)

main :: IO ()
main = do
  print (power 0 0)  -- expected: Just True
  print (power 2 5)  -- expected: Just True
  print (power (-2) 3)  -- expected: Just True
  print (power 3 1)  -- expected: Just True
  print (power 2 (-1))  -- expected: Nothing
