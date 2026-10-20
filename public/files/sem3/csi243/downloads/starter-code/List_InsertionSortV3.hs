-- Title: Implement lexicographically ascending insertion sort
{-
QUESTION
Write insertR :: String -> [String] -> [String] and sortR :: [String] -> [String]. [8]
insertR inserts into an already lexicographically ascending list. sortR sorts any finite list
by recursively sorting its tail then inserting its head. Retain duplicates.
-}

insertR :: String -> [String] -> [String]
insertR = undefined  -- Your answer here

sortR :: [String] -> [String]
sortR = undefined  -- Your answer here

main :: IO ()
main = do
  print (sortR [])  -- expected: []
  print (sortR ["cat"])  -- expected: ["cat"]
  print (sortR ["zoo","ant","bee"])  -- expected: ["ant","bee","zoo"]
  print (sortR ["b","a","b"])  -- expected: ["a","b","b"]
  print (sortR ["x","","a"])  -- expected: ["","a","x"]
