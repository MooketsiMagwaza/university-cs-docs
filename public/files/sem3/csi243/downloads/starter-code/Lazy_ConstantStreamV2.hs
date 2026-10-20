-- Title: Define the infinite zeros stream
{-
QUESTION
Write zeros :: [Integer] as a self-referential list using (:), not repeat. [4]
Every element must be 0. The supplied tests observe only finite prefixes.
-}

zeros :: [Integer]
zeros = undefined  -- Your answer here

main :: IO ()
main = do
  print (take 0 zeros)  -- expected: []
  print (take 1 zeros)  -- expected: [0]
  print (take 2 zeros)  -- expected: [0,0]
  print (take 3 zeros)  -- expected: [0,0,0]
  print (take 5 zeros)  -- expected: [0,0,0,0,0]
