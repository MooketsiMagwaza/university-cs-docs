-- Title: Subtract the second component from the first
{-
QUESTION
Write difference :: (Integer, Integer) -> Integer.
Return the first component minus the second component.
-}

difference :: (Integer, Integer) -> Integer
difference = undefined -- Your answer here

main :: IO ()
main = do
  print (difference (0, 0))  -- expected: 0
  print (difference (3, 5))  -- expected: -2
  print (difference (7, 1))  -- expected: 6
  print (difference ((-2), 4))  -- expected: -6
  print (difference (5, (-2)))  -- expected: 7
