-- Title: Implement gcd by repeated subtraction
{-
QUESTION
Write gcdS :: Integer -> Integer -> Integer recursively for a,b >= 0. [5]
Handle zero explicitly, then subtract the smaller positive argument.
-}

gcdS :: Integer -> Integer -> Integer
gcdS = undefined  -- Your answer here

main :: IO ()
main = do
  print (gcdS 0 0)  -- expected: 0
  print (gcdS 0 7)  -- expected: 7
  print (gcdS 8 8)  -- expected: 8
  print (gcdS 27 18)  -- expected: 9
  print (gcdS 14 9)  -- expected: 1
