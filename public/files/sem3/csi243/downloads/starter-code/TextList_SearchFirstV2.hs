-- Title: Find the index of the first even integer
{-
QUESTION
Write firstEvenIndex :: [Int] -> Maybe Int using findIndex.
Indices start at zero. Return Nothing when there is no even integer.
-}

firstEvenIndex :: [Int] -> Maybe Int
firstEvenIndex = undefined -- Your answer here

main :: IO ()
main = do
  print (firstEvenIndex [])  -- expected: Nothing
  print (firstEvenIndex [7])  -- expected: Nothing
  print (firstEvenIndex [8])  -- expected: Just 0
  print (firstEvenIndex [1,3,4,6])  -- expected: Just 2
  print (firstEvenIndex [2,2])  -- expected: Just 0
