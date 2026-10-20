-- Title: Find all positive factors
{-
QUESTION
For positive n, write factors :: Integer -> [Integer] using a comprehension. [4]
Return all positive factors in increasing order.
-}

factors :: Integer -> [Integer]
factors = undefined  -- Your answer here

main :: IO ()
main = do
  print (factors 1)  -- expected: [1]
  print (factors 2)  -- expected: [1,2]
  print (factors 6)  -- expected: [1,2,3,6]
  print (factors 12)  -- expected: [1,2,3,4,6,12]
  print (factors 13)  -- expected: [1,13]
