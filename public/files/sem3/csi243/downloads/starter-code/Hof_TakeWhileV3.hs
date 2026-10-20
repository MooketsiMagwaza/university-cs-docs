-- Title: Take the initial run of non-negative values
{-
QUESTION
Write prefix :: [Integer] -> [Integer] using takeWhile. [3]
Return the longest initial run of non-negative values. Stop at the first failure.
-}

prefix :: [Integer] -> [Integer]
prefix = undefined  -- Your answer here

main :: IO ()
main = do
  print (prefix [])  -- expected: []
  print (prefix [-1])  -- expected: []
  print (prefix [0])  -- expected: [0]
  print (prefix [1,2,-3,4])  -- expected: [1,2]
  print (prefix [0,4,-1,2])  -- expected: [0,4]
