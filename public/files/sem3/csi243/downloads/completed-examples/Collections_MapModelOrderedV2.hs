-- Title: Model an ordered integer-key map holding text
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
buildMap :: [(Int,String)] -> [(Int,String)]
buildMap = foldl put []
  where
    put table (key, value) = List.sortBy compareKey ((key, newValue) : rest)
      where
        rest = filter ((/= key) . fst) table
        newValue = value
    compareKey a b = compare (fst a) (fst b)

probeMap :: Int -> [(Int,String)] -> (Maybe String,Bool,Int,[Int],[String])
probeMap key pairs = (found, present, length table, map fst table, map snd table)
  where
    table = buildMap pairs
    found = lookup key table
    present = maybe False (const True) found

editMap :: Int -> String -> Int -> [(Int,String)] -> ([(Int,String)],[(Int,String)],[(Int,String)])
editMap key value removed pairs = (original, updated, deleted)
  where
    original = buildMap pairs
    -- Construct new values; the original remains available in the result.
    updated = buildMap (original ++ [(key, value)])
    deleted = filter ((/= removed) . fst) updated

main :: IO ()
main = do
  print (buildMap [])  -- expected: []
  print (buildMap [(2,"old"),(1,"one"),(2,"new")])  -- expected: [(1,"one"),(2,"new")]
  print (probeMap 2 [(2,"two"),(1,"one")])  -- expected: (Just "two",True,2,[1,2],["one","two"])
  print (probeMap 9 [(1,"one")])  -- expected: (Nothing,False,1,[1],["one"])
  print (editMap 1 "ONE" 2 [(2,"two"),(1,"one")])  -- expected: ([(1,"one"),(2,"two")],[(1,"ONE"),(2,"two")],[(1,"ONE")])
  print (editMap 3 "three" 9 [(1,"one")])  -- expected: ([(1,"one")],[(1,"one"),(3,"three")],[(1,"one"),(3,"three")])
  print (probeMap 0 [])  -- expected: (Nothing,False,0,[],[])
