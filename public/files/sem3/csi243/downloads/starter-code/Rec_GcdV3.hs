-- Title: Calculate lcm through a recursive gcd
{-
QUESTION
Write gcdR and lcmR :: Integer -> Integer -> Integer. [6]
Arguments are non-negative. Use recursive Euclid gcd, and define lcm as 0
when either input is 0; otherwise use (a div gcdR a b) * b.
-}

gcdR :: Integer -> Integer -> Integer
gcdR = undefined  -- Your answer here

lcmR :: Integer -> Integer -> Integer
lcmR = undefined  -- Your answer here

main :: IO ()
main = do
  print (lcmR 0 0)  -- expected: 0
  print (lcmR 0 9)  -- expected: 0
  print (lcmR 4 6)  -- expected: 12
  print (lcmR 7 5)  -- expected: 35
  print (lcmR 8 12)  -- expected: 24
