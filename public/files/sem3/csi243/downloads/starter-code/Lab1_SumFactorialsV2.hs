-- Title: Sum factorials at even indices
{-
QUESTION
Give recursive definitions of fac and sumEvenFac, both Integer -> Integer.
Define sumEvenFac n = fac 0 + fac 2 + ... + fac (2*n).
Assume n >= 0; reject negative arguments.
-}

fac :: Integer -> Integer
fac = undefined -- Your answer here

sumEvenFac :: Integer -> Integer
sumEvenFac = undefined -- Your answer here

main :: IO ()
main = do
  print (sumEvenFac 0)  -- expected: 1
  print (sumEvenFac 1)  -- expected: 3
  print (sumEvenFac 2)  -- expected: 27
  print (sumEvenFac 3)  -- expected: 747
  print (sumEvenFac 4)  -- expected: 41067
