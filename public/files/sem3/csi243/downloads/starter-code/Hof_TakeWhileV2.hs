-- Title: Take the initial run of even values
{-
QUESTION
Write prefix :: [Integer] -> [Integer] using takeWhile. [3]
Return the longest initial run of even values. Stop at the first failure.
-}

prefix :: [Integer] -> [Integer]
prefix = undefined  -- Your answer here

main :: IO ()
main = do
  print (prefix [])  -- expected: []
  print (prefix [1])  -- expected: []
  print (prefix [2])  -- expected: [2]
  print (prefix [2,4,3,6])  -- expected: [2,4]
  print (prefix [0,-2,5,2])  -- expected: [0,-2]
