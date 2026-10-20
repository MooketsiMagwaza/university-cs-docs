-- Title: Use iterate to produce powers of two
{-
QUESTION
Write stream :: [Integer] using iterate (*2) 1. [4]
This generates powers of two. The seed is the first output element.
The checking main uses take and takeWhile to demand finite results.
-}

-- Read the question: Write stream :: [Integer].
-- Plan: Pass the state transition and seed to iterate.
stream :: [Integer]
stream = iterate (*2) 1  -- Each next value is computed only when demanded.

main :: IO ()
main = do
  print (take 0 stream)  -- expected: []
  print (take 1 stream)  -- expected: [1]
  print (take 5 stream)  -- expected: [1,2,4,8,16]
  print (takeWhile (<20) stream)  -- expected: [1,2,4,8,16]
  print (takeWhile (<1) stream)  -- expected: []
