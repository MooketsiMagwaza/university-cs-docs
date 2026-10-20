-- Title: Keep or remove a head using an as-pattern
{-
QUESTION
Write trimNegative :: [Integer] -> [Integer] using an as-pattern and guards. [4]
Remove the head only if it is negative; otherwise return the whole list.
-}

-- Read the question: Write trimNegative :: [Integer] -> [Integer].
-- Plan: Use the whole-list binding in the branch that keeps the head.
trimNegative :: [Integer] -> [Integer]
trimNegative [] = []
trimNegative whole@(x:xs)
  | x < 0 = xs
  | otherwise = whole  -- Preserve the original list.

main :: IO ()
main = do
  print (trimNegative [])  -- expected: []
  print (trimNegative [-1])  -- expected: []
  print (trimNegative [0])  -- expected: [0]
  print (trimNegative [-2,-3,4])  -- expected: [-3,4]
  print (trimNegative [2,-3])  -- expected: [2,-3]
