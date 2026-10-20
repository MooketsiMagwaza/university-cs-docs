-- Title: Concatenate two lists of String values
{-
QUESTION
Specify and implement concatLists recursively, without using (++).
It takes two lists of String values and returns their concatenation.
Keep the elements in their original order, including repetitions.
-}

-- Read the question: Write concatLists :: [String] -> [String] -> [String].
-- Plan: Copy each head of the first list, then return the second list at the base.
-- Dry run: concatLists ["a","b"] ["c"] = "a" : ("b" : ["c"]).
concatLists :: [String] -> [String] -> [String]
concatLists xs ys
  | null xs = ys -- Base: nothing remains in the first list.
  | otherwise = head xs : concatLists (tail xs) ys

main :: IO ()
main = do
  print (concatLists [] [])  -- expected: []
  print (concatLists  ["a"] [])  -- expected: ["a"]
  print (concatLists [] ["b"])  -- expected: ["b"]
  print (concatLists ["a","b"] ["c"])  -- expected: ["a","b","c"]
  print (concatLists [""] ["x"])  -- expected: ["","x"]
