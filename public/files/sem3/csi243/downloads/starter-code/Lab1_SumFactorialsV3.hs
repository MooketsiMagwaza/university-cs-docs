-- Title: Sum factorials at odd indices
{-
QUESTION
Give recursive definitions of fac and sumOddFac, both Integer -> Integer.
Define sumOddFac n = fac 1 + fac 3 + ... + fac (2*n+1).
Assume n >= 0; reject negative arguments.
-}

fac :: Integer -> Integer
fac = undefined -- Your answer here

sumOddFac :: Integer -> Integer
sumOddFac = undefined -- Your answer here

main :: IO ()
main = do
  print (sumOddFac 0)  -- expected: 1
  print (sumOddFac 1)  -- expected: 7
  print (sumOddFac 2)  -- expected: 127
  print (sumOddFac 3)  -- expected: 5167
  print (sumOddFac 4)  -- expected: 368047
