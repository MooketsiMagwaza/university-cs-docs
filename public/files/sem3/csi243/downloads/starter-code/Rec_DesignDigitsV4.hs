-- Title: Multiply decimal digits recursively
{-
QUESTION
Write digits :: Integer -> Integer using decimal decomposition
with div and mod, without converting to a string.
Return the product of the digits of abs n; the result for zero is zero.
-}

digits :: Integer -> Integer
digits = undefined -- Your answer here

main :: IO ()
main = do
  print (digits 0)  -- expected: 0
  print (digits 7)  -- expected: 7
  print (digits 123)  -- expected: 6
  print (digits (-120))  -- expected: 0
  print (digits 1000)  -- expected: 0
