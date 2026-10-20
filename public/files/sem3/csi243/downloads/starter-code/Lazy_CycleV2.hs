-- Title: Use cycle for alternating letters
{-
QUESTION
Write patternStream :: String using cycle "ab". [3]
Produce alternating letters infinitely. Use only finite observations in main.
-}

patternStream :: String
patternStream = undefined  -- Your answer here

main :: IO ()
main = do
  print (take 0 patternStream)  -- expected: ""
  print (take 1 patternStream)  -- expected: "a"
  print (take 5 patternStream)  -- expected: "ababa"
  print (take 6 patternStream)  -- expected: "ababab"
  print (patternStream !! 3)  -- expected: 'b'
