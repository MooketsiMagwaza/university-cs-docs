-- Title: Raise an integer to a non-negative power
{-
QUESTION
Write power :: Integer -> Integer -> Integer using recursion. [4]
The exponent is non-negative. Define power b 0 = 1, including b = 0.
-}

-- Read the question: Write power :: Integer -> Integer -> Integer.
-- Plan: Count down the exponent and multiply by the base.
power :: Integer -> Integer -> Integer
power _ 0 = 1  -- Zero factors.
power b n = b * power b (n - 1)

main :: IO ()
main = do
  print (power 0 0)  -- expected: 1
  print (power 2 0)  -- expected: 1
  print (power 2 5)  -- expected: 32
  print (power (-3) 3)  -- expected: -27
  print (power 5 2)  -- expected: 25
