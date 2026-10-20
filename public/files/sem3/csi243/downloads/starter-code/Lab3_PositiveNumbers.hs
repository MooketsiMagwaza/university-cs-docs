-- Title: Select all positive integers recursively
{-
QUESTION
Write positiveNumbers :: [Int] -> [Int] recursively.
Return all positive integers from the list as a new list.
For example, positiveNumbers [-1,5,-3,8] = [5,8]. Zero is not positive.
Keep the original order and duplicates; empty input returns [].
-}

positiveNumbers :: [Int] -> [Int]
positiveNumbers = undefined -- Your answer here

main :: IO ()
main = do
  print (positiveNumbers [-1,5,-3,8])  -- expected: [5,8]
  print (positiveNumbers [])  -- expected: []
  print (positiveNumbers [0])  -- expected: []
  print (positiveNumbers [5])  -- expected: [5]
  print (positiveNumbers [-3,0,2,2])  -- expected: [2,2]
