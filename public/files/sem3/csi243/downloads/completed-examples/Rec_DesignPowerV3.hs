-- Title: Extend recursive power to negative exponents
{-
QUESTION
Write power with the signature below. Return Nothing for a zero base
and negative exponent; otherwise return the signed integral power.
Use recursion and reciprocals, not a built-in power operator.
-}

-- Read the question: Write power with the stated domain and result type.
-- Plan: Use the exponent magnitude as the decreasing measure; zero yields one.
power :: Double -> Int -> Maybe Double
-- Base cases stop recursion; each recursive call reduces the stated measure.
power x n
  | x == 0 && n < 0 = Nothing
  | n < 0 = Just (recip (go (negate (toInteger n))))
  | otherwise = Just (go (toInteger n))
  where
    go 0 = 1
    go k = x * go (k-1)

main :: IO ()
main = do
  print (power 2 (-3))  -- expected: Just 0.125
  print (power 0 (-1))  -- expected: Nothing
  print (power 0 0)  -- expected: Just 1.0
  print (power (-2) 3)  -- expected: Just (-8.0)
  print (power 0.5 2)  -- expected: Just 0.25
