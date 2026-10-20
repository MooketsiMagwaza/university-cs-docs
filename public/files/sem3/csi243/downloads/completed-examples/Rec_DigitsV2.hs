-- Title: Count decimal digits recursively
{-
QUESTION
Write digits :: Integer -> Integer recursively for n >= 0. [4]
Zero has one digit; do not convert the number to a String.
-}

-- Read the question: Write digits :: Integer -> Integer.
-- Plan: Stop at one digit and count each division by ten.
digits :: Integer -> Integer
digits n
  | n < 10 = 1  -- Includes zero.
  | otherwise = 1 + digits (div n 10)

main :: IO ()
main = do
  print (digits 0)  -- expected: 1
  print (digits 7)  -- expected: 1
  print (digits 10)  -- expected: 2
  print (digits 105)  -- expected: 3
  print (digits 9999)  -- expected: 4
