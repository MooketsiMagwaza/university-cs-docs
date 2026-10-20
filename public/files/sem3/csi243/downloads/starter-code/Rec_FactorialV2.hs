-- Title: Compute a double factorial recursively
{-
QUESTION
Write doubleFactorial :: Integer -> Integer for n >= 0. [4]
Multiply n, n-2, ... down to 1 or 2; both 0 and 1 return 1.
-}

doubleFactorial :: Integer -> Integer
doubleFactorial = undefined  -- Your answer here

main :: IO ()
main = do
  print (doubleFactorial 0)  -- expected: 1
  print (doubleFactorial 1)  -- expected: 1
  print (doubleFactorial 4)  -- expected: 8
  print (doubleFactorial 5)  -- expected: 15
  print (doubleFactorial 6)  -- expected: 48
