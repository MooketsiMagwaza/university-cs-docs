-- Title: Subtract the second component from the first
{-
QUESTION
Write difference :: (Integer, Integer) -> Integer.
Return the first component minus the second component.
-}

-- Read the question: Write difference :: (Integer, Integer) -> Integer.
-- Plan: Use a pair pattern to name the two components, then apply the operator.
-- Dry run: difference (3,5) = 3-5 = -2.
-- Key step: the function takes one tuple argument, rather than two arguments.
difference :: (Integer, Integer) -> Integer
difference (x, y) = x - y

main :: IO ()
main = do
  print (difference (0, 0))  -- expected: 0
  print (difference (3, 5))  -- expected: -2
  print (difference (7, 1))  -- expected: 6
  print (difference ((-2), 4))  -- expected: -6
  print (difference (5, (-2)))  -- expected: 7
