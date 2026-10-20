-- Title: Calculate lcm through a recursive gcd
{-
QUESTION
Write gcdR and lcmR :: Integer -> Integer -> Integer. [6]
Arguments are non-negative. Use recursive Euclid gcd, and define lcm as 0
when either input is 0; otherwise use (a div gcdR a b) * b.
-}

-- Read the question: Write gcdR :: Integer -> Integer -> Integer; lcmR :: Integer -> Integer -> Integer.
-- Plan: Use the recursive gcd to remove common factors.
gcdR :: Integer -> Integer -> Integer
gcdR a 0 = a
gcdR a b = gcdR b (mod a b)

lcmR :: Integer -> Integer -> Integer
lcmR 0 _ = 0
lcmR _ 0 = 0  -- Avoid division by zero.
lcmR a b = div a (gcdR a b) * b

main :: IO ()
main = do
  print (lcmR 0 0)  -- expected: 0
  print (lcmR 0 9)  -- expected: 0
  print (lcmR 4 6)  -- expected: 12
  print (lcmR 7 5)  -- expected: 35
  print (lcmR 8 12)  -- expected: 24
