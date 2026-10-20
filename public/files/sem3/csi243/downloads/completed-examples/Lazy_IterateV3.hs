-- Title: Use iterate to produce the recurrence n becomes 2*n+1 from zero
{-
QUESTION
Write stream :: [Integer] using iterate (\n -> 2*n+1) 0. [4]
This generates the recurrence n becomes 2*n+1 from zero. The seed is the first output element.
The checking main uses take and takeWhile to demand finite results.
-}

-- Read the question: Write stream :: [Integer].
-- Plan: Pass the state transition and seed to iterate.
stream :: [Integer]
stream = iterate (\n -> 2*n+1) 0  -- Each next value is computed only when demanded.

main :: IO ()
main = do
  print (take 0 stream)  -- expected: []
  print (take 1 stream)  -- expected: [0]
  print (take 5 stream)  -- expected: [0,1,3,7,15]
  print (takeWhile (<10) stream)  -- expected: [0,1,3,7]
  print (takeWhile (<0) stream)  -- expected: []
