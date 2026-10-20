-- Title: Design power by exponentiation by squaring
{-
QUESTION
Write power with the signature below. Return Nothing for a negative
exponent; define x^0 as 1, including 0^0 for this algorithm.
Use exponentiation by squaring and share the half-power result.
-}

-- Read the question: Write power with the stated domain and result type.
-- Plan: Use the exponent magnitude as the decreasing measure; zero yields one.
power :: Integer -> Int -> Maybe Integer
-- Base cases stop recursion; each recursive call reduces the stated measure.
power x n
  | n < 0 = Nothing
  | otherwise = Just (go n)
  where
    go 0 = 1
    go k
      | even k = half * half
      | otherwise = x * half * half
      where
        half = go (k `div` 2)

main :: IO ()
main = do
  print (power 0 0)  -- expected: Just 1
  print (power 2 5)  -- expected: Just 32
  print (power (-2) 3)  -- expected: Just (-8)
  print (power 3 1)  -- expected: Just 3
  print (power 2 (-1))  -- expected: Nothing
