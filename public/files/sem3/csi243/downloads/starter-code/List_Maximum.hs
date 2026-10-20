-- Title: Find a safe maximum
{-
QUESTION
Write best :: [Integer] -> Maybe Integer recursively. [5]
Return Nothing for [], otherwise Just the maximum. Do not use maximum or minimum.
-}

best :: [Integer] -> Maybe Integer
best = undefined  -- Your answer here

main :: IO ()
main = do
  print (best [])  -- expected: Nothing
  print (best [7])  -- expected: Just 7
  print (best [1,9,3])  -- expected: Just 9
  print (best [-4,-2,-7])  -- expected: Just (-2)
  print (best [5,5])  -- expected: Just 5
