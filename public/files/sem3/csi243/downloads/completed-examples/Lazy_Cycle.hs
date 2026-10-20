-- Title: Use cycle for a repeating three-number pattern
{-
QUESTION
Write patternStream :: [Integer] using cycle [1,2,3]. [3]
Produce a repeating three-number pattern infinitely. Use only finite observations in main.
-}

-- Read the question: Write patternStream :: [Integer].
-- Plan: Repeat a finite non-empty pattern with cycle.
patternStream :: [Integer]
patternStream = cycle [1,2,3]  -- The seed pattern is non-empty.

main :: IO ()
main = do
  print (take 0 patternStream)  -- expected: []
  print (take 1 patternStream)  -- expected: [1]
  print (take 5 patternStream)  -- expected: [1,2,3,1,2]
  print (take 7 patternStream)  -- expected: [1,2,3,1,2,3,1]
  print (patternStream !! 4)  -- expected: 2
