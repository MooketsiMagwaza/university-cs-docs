-- Title: Sum factorials from zero to n
{-
QUESTION
Give recursive definitions of fac and sumFac, both Integer -> Integer.
Define sumFac n = fac 0 + fac 1 + ... + fac n.
Assume n >= 0; reject negative arguments.
-}

fac :: Integer -> Integer
fac = undefined -- Your answer here

sumFac :: Integer -> Integer
sumFac = undefined -- Your answer here

main :: IO ()
main = do
  print (sumFac 0)  -- expected: 1
  print (sumFac 1)  -- expected: 2
  print (sumFac 2)  -- expected: 4
  print (sumFac 3)  -- expected: 10
  print (sumFac 4)  -- expected: 34
