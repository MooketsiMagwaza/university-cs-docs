-- Title: Model a map that sums values of duplicate keys
{-
QUESTION
Use only base to model ordered map behaviour with a list of key/value
pairs. Actual Data.Map requires the containers package; this exercise
is a list model, not an implementation of its balanced tree.
Write the three functions with the signatures below. buildMap outputs
unique keys in ascending order; sum values of duplicate keys.
probeMap returns (lookup result, membership, size, keys, values) after
building the map. editMap takes an inserted key/value and a key to delete;
return (original, after insertion, after deletion). Insertion adds to an existing value.
Deleting an absent key has no effect. Ordered traversal is by key,
not by insertion order. Do not mutate the original list.
-}

buildMap :: [(String,Int)] -> [(String,Int)]
buildMap = undefined -- Your answer here

probeMap :: String -> [(String,Int)] -> (Maybe Int,Bool,Int,[String],[Int])
probeMap = undefined -- Your answer here

editMap :: String -> Int -> String -> [(String,Int)] -> ([(String,Int)],[(String,Int)],[(String,Int)])
editMap = undefined -- Your answer here

main :: IO ()
main = do
  print (buildMap [])  -- expected: []
  print (buildMap [("b",2),("a",1),("b",9)])  -- expected: [("a",1),("b",11)]
  print (probeMap "b" [("b",2),("b",3)])  -- expected: (Just 5,True,1,["b"],[5])
  print (probeMap "z" [("a",1)])  -- expected: (Nothing,False,1,["a"],[1])
  print (editMap "a" 8 "b" [("b",2),("a",1)])  -- expected: ([("a",1),("b",2)],[("a",9),("b",2)],[("a",9)])
  print (editMap "c" 3 "z" [("a",1)])  -- expected: ([("a",1)],[("a",1),("c",3)],[("a",1),("c",3)])
  print (probeMap "x" [])  -- expected: (Nothing,False,0,[],[])
