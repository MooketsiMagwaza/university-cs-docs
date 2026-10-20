-- Title: Take the initial run of values below four
{-
QUESTION
Write prefix :: [Integer] -> [Integer] using takeWhile. [3]
Return the longest initial run of values below four. Stop at the first failure.
-}

-- Read the question: Write prefix :: [Integer] -> [Integer].
-- Plan: Supply the condition to takeWhile.
prefix :: [Integer] -> [Integer]
prefix = takeWhile (<4)  -- Later matches after a failure are excluded.

main :: IO ()
main = do
  print (prefix [])  -- expected: []
  print (prefix [4])  -- expected: []
  print (prefix [1])  -- expected: [1]
  print (prefix [1,2,3,9,1])  -- expected: [1,2,3]
  print (prefix [-1,0,4,2])  -- expected: [-1,0]
