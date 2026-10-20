-- Title: Count occurrences in a list of Int values
{-
QUESTION
Specify and implement occurs recursively. Count occurrences of a given
Int in a list. Use target first, list second.
For example, occurs 1 [1,2,3,1,3,1] = 3.
-}

occurs :: Int -> [Int] -> Int
occurs = undefined -- Your answer here

main :: IO ()
main = do
  print (occurs 1 [1,2,3,1,3,1])  -- expected: 3
  print (occurs 1 [])  -- expected: 0
  print (occurs 1 [1])  -- expected: 1
  print (occurs 1 [2,3])  -- expected: 0
  print (occurs 1 [1,1])  -- expected: 2
