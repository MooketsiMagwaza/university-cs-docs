-- Title: Find proper positive factors (excluding n)
{-
QUESTION
For positive n, write factors :: Integer -> [Integer] using a comprehension. [4]
Return proper positive factors (excluding n) in increasing order.
-}

-- Read the question: Write factors :: Integer -> [Integer].
-- Plan: Try positive candidate divisors and test the remainder.
factors :: Integer -> [Integer]
factors n = [d | d <- [1..n-1], mod n d == 0]  -- Never divide by zero.

main :: IO ()
main = do
  print (factors 1)  -- expected: []
  print (factors 2)  -- expected: [1]
  print (factors 6)  -- expected: [1,2,3]
  print (factors 12)  -- expected: [1,2,3,4,6]
  print (factors 13)  -- expected: [1]
