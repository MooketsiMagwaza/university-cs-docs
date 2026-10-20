-- Title: Take the initial run of values below four
{-
QUESTION
Write prefix :: [Integer] -> [Integer] using takeWhile. [3]
Return the longest initial run of values below four. Stop at the first failure.
-}

prefix :: [Integer] -> [Integer]
prefix = undefined  -- Your answer here

main :: IO ()
main = do
  print (prefix [])  -- expected: []
  print (prefix [4])  -- expected: []
  print (prefix [1])  -- expected: [1]
  print (prefix [1,2,3,9,1])  -- expected: [1,2,3]
  print (prefix [-1,0,4,2])  -- expected: [-1,0]
