-- Title: Count occurrences in a list of String values
{-
QUESTION
Specify and implement occurs recursively. Count occurrences of a given
String in a list. Use target first, list second.
For example, occurs "red" ["red","blue","red"] = 2.
-}

occurs :: String -> [String] -> Int
occurs = undefined -- Your answer here

main :: IO ()
main = do
  print (occurs "red" ["red","blue","red"])  -- expected: 2
  print (occurs "red" [])  -- expected: 0
  print (occurs "red" ["red"])  -- expected: 1
  print (occurs "red" ["blue"])  -- expected: 0
  print (occurs "" ["",""])  -- expected: 2
