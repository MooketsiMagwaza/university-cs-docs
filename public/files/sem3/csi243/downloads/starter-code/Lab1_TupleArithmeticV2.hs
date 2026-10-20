-- Title: Multiply the components of an integer pair
{-
QUESTION
Write multiply :: (Integer, Integer) -> Integer.
Return the product of the two components of the input pair.
-}

multiply :: (Integer, Integer) -> Integer
multiply = undefined -- Your answer here

main :: IO ()
main = do
  print (multiply (0, 0))  -- expected: 0
  print (multiply (3, 5))  -- expected: 15
  print (multiply (7, 1))  -- expected: 7
  print (multiply ((-2), 4))  -- expected: -8
  print (multiply (5, (-2)))  -- expected: -10
