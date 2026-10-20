-- Title: Reverse decimal digits with an accumulator
{-
QUESTION
Write digits :: Integer -> Integer using decimal decomposition
with div and mod, without converting to a string.
Reverse the decimal digits of abs n and restore the original sign.
Leading zeroes in the reversed number disappear. Choose an accumulator.
-}

-- Read the question: Write digits with the stated domain and result type.
-- Plan: Divide the non-negative magnitude by ten at each recursive step.
digits :: Integer -> Integer
-- Base cases stop recursion; each recursive call reduces the stated measure.
digits n = signum n * go (abs n) 0
  where
    go 0 acc = acc
    go k acc = go (k `div` 10) (10*acc + k `mod` 10)

main :: IO ()
main = do
  print (digits 0)  -- expected: 0
  print (digits 7)  -- expected: 7
  print (digits 123)  -- expected: 321
  print (digits (-120))  -- expected: -21
  print (digits 1000)  -- expected: 1
