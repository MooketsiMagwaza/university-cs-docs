-- Title: Implement lexicographically ascending insertion sort
{-
QUESTION
Write insertR :: String -> [String] -> [String] and sortR :: [String] -> [String]. [8]
insertR inserts into an already lexicographically ascending list. sortR sorts any finite list
by recursively sorting its tail then inserting its head. Retain duplicates.
-}

-- Read the question: Write insertR :: String -> [String] -> [String]; sortR :: [String] -> [String].
-- Plan: Insert before the first suitable element; sort the tail first.
insertR :: String -> [String] -> [String]
insertR x [] = [x]
insertR x (y:ys)
  | x <= y = x:y:ys
  | otherwise = y : insertR x ys

sortR :: [String] -> [String]
sortR [] = []  -- Already sorted.
sortR (x:xs) = insertR x (sortR xs)

main :: IO ()
main = do
  print (sortR [])  -- expected: []
  print (sortR ["cat"])  -- expected: ["cat"]
  print (sortR ["zoo","ant","bee"])  -- expected: ["ant","bee","zoo"]
  print (sortR ["b","a","b"])  -- expected: ["a","b","b"]
  print (sortR ["x","","a"])  -- expected: ["","a","x"]
