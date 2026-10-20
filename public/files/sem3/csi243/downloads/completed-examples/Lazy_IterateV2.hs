-- Title: Use iterate to produce multiples of three
{-
QUESTION
Write stream :: [Integer] using iterate (+3) 0. [4]
This generates multiples of three. The seed is the first output element.
The checking main uses take and takeWhile to demand finite results.
-}

-- Read the question: Write stream :: [Integer].
-- Plan: Pass the state transition and seed to iterate.
stream :: [Integer]
stream = iterate (+3) 0  -- Each next value is computed only when demanded.

main :: IO ()
main = do
  print (take 0 stream)  -- expected: []
  print (take 1 stream)  -- expected: [0]
  print (take 5 stream)  -- expected: [0,3,6,9,12]
  print (takeWhile (<10) stream)  -- expected: [0,3,6,9]
  print (takeWhile (<0) stream)  -- expected: []
