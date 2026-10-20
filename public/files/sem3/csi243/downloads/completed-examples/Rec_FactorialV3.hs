-- Title: Sum factorials using recursion
{-
QUESTION
Write factorial and sumFactorials :: Integer -> Integer for n >= 0. [6]
sumFactorials n returns factorial 0 + ... + factorial n.
-}

-- Read the question: Write factorial :: Integer -> Integer; sumFactorials :: Integer -> Integer.
-- Plan: Define factorial first, then add its values recursively.
factorial :: Integer -> Integer
factorial 0 = 1
factorial n = n * factorial (n - 1)

sumFactorials :: Integer -> Integer
sumFactorials 0 = 1  -- Includes factorial 0.
sumFactorials n = factorial n + sumFactorials (n - 1)

main :: IO ()
main = do
  print (sumFactorials 0)  -- expected: 1
  print (sumFactorials 1)  -- expected: 2
  print (sumFactorials 2)  -- expected: 4
  print (sumFactorials 3)  -- expected: 10
  print (sumFactorials 4)  -- expected: 34
