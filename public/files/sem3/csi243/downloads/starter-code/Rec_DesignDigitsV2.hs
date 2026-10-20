-- Title: Count decimal digits with a zero convention
{-
QUESTION
Write digits :: Integer -> Integer using decimal decomposition
with div and mod, without converting to a string.
Return the number of digits of abs n; zero has one digit.
-}

digits :: Integer -> Integer
digits = undefined -- Your answer here

main :: IO ()
main = do
  print (digits 0)  -- expected: 1
  print (digits 7)  -- expected: 1
  print (digits 123)  -- expected: 3
  print (digits (-120))  -- expected: 3
  print (digits 1000)  -- expected: 4
