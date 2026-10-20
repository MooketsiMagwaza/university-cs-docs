-- Title: Use cycle for alternating Boolean values
{-
QUESTION
Write patternStream :: [Bool] using cycle [True,False]. [3]
Produce alternating Boolean values infinitely. Use only finite observations in main.
-}

-- Read the question: Write patternStream :: [Bool].
-- Plan: Repeat a finite non-empty pattern with cycle.
patternStream :: [Bool]
patternStream = cycle [True,False]  -- The seed pattern is non-empty.

main :: IO ()
main = do
  print (take 0 patternStream)  -- expected: []
  print (take 1 patternStream)  -- expected: [True]
  print (take 4 patternStream)  -- expected: [True,False,True,False]
  print (take 5 patternStream)  -- expected: [True,False,True,False,True]
  print (patternStream !! 3)  -- expected: False
