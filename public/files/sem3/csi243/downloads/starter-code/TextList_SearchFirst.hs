-- Title: Find the first integer meeting a threshold
{-
QUESTION
Write firstAtLeast :: Int -> [Int] -> Maybe Int using find.
Return the first value at least the threshold, or Nothing if none exists.
-}

firstAtLeast :: Int -> [Int] -> Maybe Int
firstAtLeast = undefined -- Your answer here

main :: IO ()
main = do
  print (firstAtLeast 3 [])  -- expected: Nothing
  print (firstAtLeast 3 [2])  -- expected: Nothing
  print (firstAtLeast 3 [3])  -- expected: Just 3
  print (firstAtLeast 3 [5,3,8])  -- expected: Just 5
  print (firstAtLeast 0 [-2,0,1])  -- expected: Just 0
