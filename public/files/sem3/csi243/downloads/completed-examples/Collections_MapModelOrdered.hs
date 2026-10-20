-- Title: Model an ordered map with last duplicate key winning
{-
QUESTION
Use only base to model ordered map behaviour with a list of key/value
pairs. Actual Data.Map requires the containers package; this exercise
is a list model, not an implementation of its balanced tree.
Write the three functions with the signatures below. buildMap outputs
unique keys in ascending order; the last duplicate key wins.
probeMap returns (lookup result, membership, size, keys, values) after
building the map. editMap takes an inserted key/value and a key to delete;
return (original, after insertion, after deletion). Insertion replaces an existing value.
Deleting an absent key has no effect. Ordered traversal is by key,
not by insertion order. Do not mutate the original list.
-}

import qualified Data.List as List

-- Read the question: Write the listed pure collection functions.
-- Plan: Canonicalise keys after each persistent update; use Prelude.lookup for a Maybe result.
buildMap :: [(String,Int)] -> [(String,Int)]
buildMap = foldl put []
  where
    put table (key, value) = List.sortBy compareKey ((key, newValue) : rest)
      where
        rest = filter ((/= key) . fst) table
        newValue = value
    compareKey a b = compare (fst a) (fst b)

probeMap :: String -> [(String,Int)] -> (Maybe Int,Bool,Int,[String],[Int])
probeMap key pairs = (found, present, length table, map fst table, map snd table)
  where
    table = buildMap pairs
    found = lookup key table
    present = maybe False (const True) found

editMap :: String -> Int -> String -> [(String,Int)] -> ([(String,Int)],[(String,Int)],[(String,Int)])
editMap key value removed pairs = (original, updated, deleted)
  where
    original = buildMap pairs
    -- Construct new values; the original remains available in the result.
    updated = buildMap (original ++ [(key, value)])
    deleted = filter ((/= removed) . fst) updated

main :: IO ()
main = do
  print (buildMap [])  -- expected: []
  print (buildMap [("b",2),("a",1),("b",9)])  -- expected: [("a",1),("b",9)]
  print (probeMap "a" [("b",2),("a",1)])  -- expected: (Just 1,True,2,["a","b"],[1,2])
  print (probeMap "z" [("a",1)])  -- expected: (Nothing,False,1,["a"],[1])
  print (editMap "a" 8 "b" [("b",2),("a",1)])  -- expected: ([("a",1),("b",2)],[("a",8),("b",2)],[("a",8)])
  print (editMap "c" 3 "z" [("a",1)])  -- expected: ([("a",1)],[("a",1),("c",3)],[("a",1),("c",3)])
  print (probeMap "x" [])  -- expected: (Nothing,False,0,[],[])
