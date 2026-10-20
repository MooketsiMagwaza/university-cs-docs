-- Title: Define the infinite zeros stream
{-
QUESTION
Write zeros :: [Integer] as a self-referential list using (:), not repeat. [4]
Every element must be 0. The supplied tests observe only finite prefixes.
-}

-- Read the question: Write zeros :: [Integer].
-- Plan: Tie the tail back to the stream; take limits the demand.
zeros :: [Integer]
zeros = 0 : zeros  -- Produce a head before referring to the tail.

main :: IO ()
main = do
  print (take 0 zeros)  -- expected: []
  print (take 1 zeros)  -- expected: [0]
  print (take 2 zeros)  -- expected: [0,0]
  print (take 3 zeros)  -- expected: [0,0,0]
  print (take 5 zeros)  -- expected: [0,0,0,0,0]
