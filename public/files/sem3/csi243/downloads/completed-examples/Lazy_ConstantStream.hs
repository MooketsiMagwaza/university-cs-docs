-- Title: Define the infinite ones stream
{-
QUESTION
Write ones :: [Integer] as a self-referential list using (:), not repeat. [4]
Every element must be 1. The supplied tests observe only finite prefixes.
-}

-- Read the question: Write ones :: [Integer].
-- Plan: Tie the tail back to the stream; take limits the demand.
ones :: [Integer]
ones = 1 : ones  -- Produce a head before referring to the tail.

main :: IO ()
main = do
  print (take 0 ones)  -- expected: []
  print (take 1 ones)  -- expected: [1]
  print (take 2 ones)  -- expected: [1,1]
  print (take 3 ones)  -- expected: [1,1,1]
  print (take 5 ones)  -- expected: [1,1,1,1,1]
