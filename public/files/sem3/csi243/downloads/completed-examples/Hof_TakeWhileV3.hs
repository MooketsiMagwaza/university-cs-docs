-- Title: Take the initial run of non-negative values
{-
QUESTION
Write prefix :: [Integer] -> [Integer] using takeWhile. [3]
Return the longest initial run of non-negative values. Stop at the first failure.
-}

-- Read the question: Write prefix :: [Integer] -> [Integer].
-- Plan: Supply the condition to takeWhile.
prefix :: [Integer] -> [Integer]
prefix = takeWhile (>=0)  -- Later matches after a failure are excluded.

main :: IO ()
main = do
  print (prefix [])  -- expected: []
  print (prefix [-1])  -- expected: []
  print (prefix [0])  -- expected: [0]
  print (prefix [1,2,-3,4])  -- expected: [1,2]
  print (prefix [0,4,-1,2])  -- expected: [0,4]
