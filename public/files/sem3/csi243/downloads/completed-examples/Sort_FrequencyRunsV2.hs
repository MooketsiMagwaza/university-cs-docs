-- Title: Count words in lexicographic key order
{-
QUESTION
Write frequencies :: [String] -> [(String,Int)].
Count case-sensitive words and output keys in lexicographic order.
Use group after sort, rather than counting only consecutive runs.
-}

import Data.List (group, sort)

-- Read the question: Write the declared functions with the specified ordering.
-- Plan: Follow the ordering rule; preserve ties as stated and handle empty input.
frequencies :: [String] -> [(String,Int)]
-- group produces nonempty runs; the empty input produces no runs.
frequencies = map (\run -> (head run, length run)) . group . sort

main :: IO ()
main = do
  print (frequencies [])  -- expected: []
  print (frequencies [""])  -- expected: [("",1)]
  print (frequencies ["cat","ant","cat"])  -- expected: [("ant",1),("cat",2)]
  print (frequencies ["a","A","a"])  -- expected: [("A",1),("a",2)]
  print (frequencies ["x","y","x","y"])  -- expected: [("x",2),("y",2)]
