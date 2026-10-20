-- Title: Implement Euclid gcd with remainders
{-
QUESTION
Write gcdR :: Integer -> Integer -> Integer recursively for a,b >= 0. [5]
Use the remainder algorithm; gcdR 0 0 is defined to be 0.
-}

gcdR :: Integer -> Integer -> Integer
gcdR = undefined  -- Your answer here

main :: IO ()
main = do
  print (gcdR 0 0)  -- expected: 0
  print (gcdR 12 0)  -- expected: 12
  print (gcdR 0 9)  -- expected: 9
  print (gcdR 48 18)  -- expected: 6
  print (gcdR 35 12)  -- expected: 1
