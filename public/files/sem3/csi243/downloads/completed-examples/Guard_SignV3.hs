-- Title: Compute an absolute difference with guards
{-
QUESTION
Write distance :: Integer -> Integer -> Integer using guards. [3]
Return the non-negative distance between the arguments without abs.
-}

-- Read the question: Write distance :: Integer -> Integer -> Integer.
-- Plan: Compare first so that subtraction always gives a non-negative result.
distance :: Integer -> Integer -> Integer
distance x y
  | x >= y = x - y  -- Subtract smaller from larger.
  | otherwise = y - x

main :: IO ()
main = do
  print (distance 0 0)  -- expected: 0
  print (distance 1 1)  -- expected: 0
  print (distance 3 8)  -- expected: 5
  print (distance 8 3)  -- expected: 5
  print (distance (-2) 3)  -- expected: 5
