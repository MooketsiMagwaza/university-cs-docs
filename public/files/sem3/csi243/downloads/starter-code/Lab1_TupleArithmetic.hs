-- Title: Add the components of an integer pair
{-
QUESTION
Write add :: (Integer, Integer) -> Integer.
Return the sum of the two components of the input pair.
-}

add :: (Integer, Integer) -> Integer
add = undefined -- Your answer here

main :: IO ()
main = do
  print (add (0, 0))  -- expected: 0
  print (add (3, 5))  -- expected: 8
  print (add (7, 1))  -- expected: 8
  print (add ((-2), 4))  -- expected: 2
  print (add (5, (-2)))  -- expected: 3
