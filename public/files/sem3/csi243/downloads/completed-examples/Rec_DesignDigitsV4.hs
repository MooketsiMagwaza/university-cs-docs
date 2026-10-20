-- Title: Multiply decimal digits recursively
{-
QUESTION
Write digits :: Integer -> Integer using decimal decomposition
with div and mod, without converting to a string.
Return the product of the digits of abs n; the result for zero is zero.
-}

-- Read the question: Write digits with the stated domain and result type.
-- Plan: Divide the non-negative magnitude by ten at each recursive step.
digits :: Integer -> Integer
-- Base cases stop recursion; each recursive call reduces the stated measure.
digits n = go (abs n)
  where
    go k
      | k < 10 = k
      | otherwise = (k `mod` 10) * go (k `div` 10)

main :: IO ()
main = do
  print (digits 0)  -- expected: 0
  print (digits 7)  -- expected: 7
  print (digits 123)  -- expected: 6
  print (digits (-120))  -- expected: 0
  print (digits 1000)  -- expected: 0
