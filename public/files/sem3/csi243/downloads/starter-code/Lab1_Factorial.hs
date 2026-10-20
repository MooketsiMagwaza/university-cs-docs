-- Title: Calculate factorial recursively
{-
QUESTION
Give a recursive definition of fac :: Integer -> Integer.
For n >= 0, fac n = n!. Include a short informative error for n < 0.
Dry run fac 3, which returns 6.
-}

fac :: Integer -> Integer
fac = undefined -- Your answer here

main :: IO ()
main = do
  print (fac 0)  -- expected: 1
  print (fac 1)  -- expected: 1
  print (fac 2)  -- expected: 2
  print (fac 3)  -- expected: 6
  print (fac 5)  -- expected: 120
