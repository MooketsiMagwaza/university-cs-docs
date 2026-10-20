-- Title: Write a sign function with guards
{-
QUESTION
Write signR :: Integer -> Integer using guards, without signum. [3]
Return -1 for negative input, 0 for zero, and 1 for positive input.
-}

signR :: Integer -> Integer
signR = undefined  -- Your answer here

main :: IO ()
main = do
  print (signR (-8))  -- expected: -1
  print (signR (-1))  -- expected: -1
  print (signR 0)  -- expected: 0
  print (signR 1)  -- expected: 1
  print (signR 9)  -- expected: 1
