-- Title: Concatenate two lists of String values
{-
QUESTION
Specify and implement concatLists recursively, without using (++).
It takes two lists of String values and returns their concatenation.
Keep the elements in their original order, including repetitions.
-}

concatLists :: [String] -> [String] -> [String]
concatLists = undefined -- Your answer here

main :: IO ()
main = do
  print (concatLists [] [])  -- expected: []
  print (concatLists  ["a"] [])  -- expected: ["a"]
  print (concatLists [] ["b"])  -- expected: ["b"]
  print (concatLists ["a","b"] ["c"])  -- expected: ["a","b","c"]
  print (concatLists [""] ["x"])  -- expected: ["","x"]
