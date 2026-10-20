-- Title: Count decimal digits recursively
{-
QUESTION
Write digits :: Integer -> Integer recursively for n >= 0. [4]
Zero has one digit; do not convert the number to a String.
-}

digits :: Integer -> Integer
digits = undefined  -- Your answer here

main :: IO ()
main = do
  print (digits 0)  -- expected: 1
  print (digits 7)  -- expected: 1
  print (digits 10)  -- expected: 2
  print (digits 105)  -- expected: 3
  print (digits 9999)  -- expected: 4
