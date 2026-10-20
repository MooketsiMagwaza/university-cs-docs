-- Title: Count decimal digits with a zero convention
{-
QUESTION
Write digits :: Integer -> Integer using decimal decomposition
with div and mod, without converting to a string.
Return the number of digits of abs n; zero has one digit.
-}

-- Read the question: Write digits with the stated domain and result type.
-- Plan: Divide the non-negative magnitude by ten at each recursive step.
digits :: Integer -> Integer
-- Base cases stop recursion; each recursive call reduces the stated measure.
digits n = go (abs n)
  where
    go k
      | k < 10 = 1
      | otherwise = 1 + go (k `div` 10)

main :: IO ()
main = do
  print (digits 0)  -- expected: 1
  print (digits 7)  -- expected: 1
  print (digits 123)  -- expected: 3
  print (digits (-120))  -- expected: 3
  print (digits 1000)  -- expected: 4
