-- Title: Define the infinite ones stream
{-
QUESTION
Write ones :: [Integer] as a self-referential list using (:), not repeat. [4]
Every element must be 1. The supplied tests observe only finite prefixes.
-}

ones :: [Integer]
ones = undefined  -- Your answer here

main :: IO ()
main = do
  print (take 0 ones)  -- expected: []
  print (take 1 ones)  -- expected: [1]
  print (take 2 ones)  -- expected: [1,1]
  print (take 3 ones)  -- expected: [1,1,1]
  print (take 5 ones)  -- expected: [1,1,1,1,1]
