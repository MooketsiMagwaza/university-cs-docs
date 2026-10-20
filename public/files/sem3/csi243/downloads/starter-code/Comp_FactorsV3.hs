-- Title: Find even positive factors
{-
QUESTION
For positive n, write factors :: Integer -> [Integer] using a comprehension. [4]
Return even positive factors in increasing order.
-}

factors :: Integer -> [Integer]
factors = undefined  -- Your answer here

main :: IO ()
main = do
  print (factors 1)  -- expected: []
  print (factors 2)  -- expected: [2]
  print (factors 6)  -- expected: [2,6]
  print (factors 12)  -- expected: [2,4,6,12]
  print (factors 13)  -- expected: []
