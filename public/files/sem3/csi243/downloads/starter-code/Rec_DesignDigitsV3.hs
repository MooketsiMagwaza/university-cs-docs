-- Title: Reverse decimal digits with an accumulator
{-
QUESTION
Write digits :: Integer -> Integer using decimal decomposition
with div and mod, without converting to a string.
Reverse the decimal digits of abs n and restore the original sign.
Leading zeroes in the reversed number disappear. Choose an accumulator.
-}

digits :: Integer -> Integer
digits = undefined -- Your answer here

main :: IO ()
main = do
  print (digits 0)  -- expected: 0
  print (digits 7)  -- expected: 7
  print (digits 123)  -- expected: 321
  print (digits (-120))  -- expected: -21
  print (digits 1000)  -- expected: 1
