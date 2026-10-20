-- Title: Compute an absolute difference with guards
{-
QUESTION
Write distance :: Integer -> Integer -> Integer using guards. [3]
Return the non-negative distance between the arguments without abs.
-}

distance :: Integer -> Integer -> Integer
distance = undefined  -- Your answer here

main :: IO ()
main = do
  print (distance 0 0)  -- expected: 0
  print (distance 1 1)  -- expected: 0
  print (distance 3 8)  -- expected: 5
  print (distance 8 3)  -- expected: 5
  print (distance (-2) 3)  -- expected: 5
