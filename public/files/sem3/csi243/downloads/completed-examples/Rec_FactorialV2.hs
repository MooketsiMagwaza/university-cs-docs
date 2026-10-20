-- Title: Compute a double factorial recursively
{-
QUESTION
Write doubleFactorial :: Integer -> Integer for n >= 0. [4]
Multiply n, n-2, ... down to 1 or 2; both 0 and 1 return 1.
-}

-- Read the question: Write doubleFactorial :: Integer -> Integer.
-- Plan: Use two base cases because the step subtracts two.
doubleFactorial :: Integer -> Integer
doubleFactorial 0 = 1
doubleFactorial 1 = 1
doubleFactorial n = n * doubleFactorial (n - 2)  -- Reduce by two.

main :: IO ()
main = do
  print (doubleFactorial 0)  -- expected: 1
  print (doubleFactorial 1)  -- expected: 1
  print (doubleFactorial 4)  -- expected: 8
  print (doubleFactorial 5)  -- expected: 15
  print (doubleFactorial 6)  -- expected: 48
