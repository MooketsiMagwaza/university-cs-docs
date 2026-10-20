-- Title: Keep or remove a head using an as-pattern
{-
QUESTION
Write trimNegative :: [Integer] -> [Integer] using an as-pattern and guards. [4]
Remove the head only if it is negative; otherwise return the whole list.
-}

trimNegative :: [Integer] -> [Integer]
trimNegative = undefined  -- Your answer here

main :: IO ()
main = do
  print (trimNegative [])  -- expected: []
  print (trimNegative [-1])  -- expected: []
  print (trimNegative [0])  -- expected: [0]
  print (trimNegative [-2,-3,4])  -- expected: [-3,4]
  print (trimNegative [2,-3])  -- expected: [2,-3]
