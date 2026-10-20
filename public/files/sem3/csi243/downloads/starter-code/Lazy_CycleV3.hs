-- Title: Use cycle for alternating Boolean values
{-
QUESTION
Write patternStream :: [Bool] using cycle [True,False]. [3]
Produce alternating Boolean values infinitely. Use only finite observations in main.
-}

patternStream :: [Bool]
patternStream = undefined  -- Your answer here

main :: IO ()
main = do
  print (take 0 patternStream)  -- expected: []
  print (take 1 patternStream)  -- expected: [True]
  print (take 4 patternStream)  -- expected: [True,False,True,False]
  print (take 5 patternStream)  -- expected: [True,False,True,False,True]
  print (patternStream !! 3)  -- expected: False
