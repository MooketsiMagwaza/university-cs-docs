-- Title: Write a sign function with guards
{-
QUESTION
Write signR :: Integer -> Integer using guards, without signum. [3]
Return -1 for negative input, 0 for zero, and 1 for positive input.
-}

-- Read the question: Write signR :: Integer -> Integer.
-- Plan: Partition all integers into negative, zero and positive.
signR :: Integer -> Integer
signR n
  | n < 0 = -1
  | n == 0 = 0  -- Boundary between the two signs.
  | otherwise = 1

main :: IO ()
main = do
  print (signR (-8))  -- expected: -1
  print (signR (-1))  -- expected: -1
  print (signR 0)  -- expected: 0
  print (signR 1)  -- expected: 1
  print (signR 9)  -- expected: 1
