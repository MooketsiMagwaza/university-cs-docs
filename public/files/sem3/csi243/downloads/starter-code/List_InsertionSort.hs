-- Title: Implement ascending insertion sort
{-
QUESTION
Write insertR :: Integer -> [Integer] -> [Integer] and sortR :: [Integer] -> [Integer]. [8]
insertR inserts into an already ascending list. sortR sorts any finite list
by recursively sorting its tail then inserting its head. Retain duplicates.
-}

insertR :: Integer -> [Integer] -> [Integer]
insertR = undefined  -- Your answer here

sortR :: [Integer] -> [Integer]
sortR = undefined  -- Your answer here

main :: IO ()
main = do
  print (sortR [])  -- expected: []
  print (sortR [7])  -- expected: [7]
  print (sortR [3,1,2])  -- expected: [1,2,3]
  print (sortR [2,1,2])  -- expected: [1,2,2]
  print (sortR [-1,3,0])  -- expected: [-1,0,3]
