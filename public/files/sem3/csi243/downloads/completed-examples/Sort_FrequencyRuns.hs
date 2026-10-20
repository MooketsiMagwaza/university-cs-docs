-- Title: Build an ascending integer frequency table
{-
QUESTION
Write frequencies :: [Int] -> [(Int,Int)].
Count every integer, output keys in ascending order, and use group
after sort. Explain why each group passed to head is nonempty.
-}

import Data.List (group, sort)

-- Read the question: Write the declared functions with the specified ordering.
-- Plan: Follow the ordering rule; preserve ties as stated and handle empty input.
frequencies :: [Int] -> [(Int,Int)]
-- group produces nonempty runs; the empty input produces no runs.
frequencies = map (\run -> (head run, length run)) . group . sort

main :: IO ()
main = do
  print (frequencies [])  -- expected: []
  print (frequencies [4])  -- expected: [(4,1)]
  print (frequencies [2,1,2,3,1])  -- expected: [(1,2),(2,2),(3,1)]
  print (frequencies [0,0,0])  -- expected: [(0,3)]
  print (frequencies [-1,2,-1])  -- expected: [(-1,2),(2,1)]
