-- Title: Compare reverse algorithms on lists of words
{-
QUESTION
Write reverseCosts :: [String] -> (Bool, Int, Int). Implement both
append-based reverse and accumulator reverse; return whether their
results agree, copied left cells in append, and accumulator cons steps.
Fully demand finite results. For length n the counters are n(n-1)/2
and n. These counts exclude equality checking and the test harness.
-}

-- Read the question: Write a definition; reverseCosts has input/result type [String] -> (Bool, Int, Int).
-- Plan: Carry a counter for the specified list construction or append traversal.
reverseCosts :: [String] -> (Bool, Int, Int)
reverseCosts xs = (slowResult == fastResult, sc, fc)
  where
    (slowResult,sc) = slow xs
    (fastResult,fc) = fast xs [] 0
    slow [] = ([],0)
    slow (x:rest) = (r ++ [x], c + length r)
      where (r,c) = slow rest
    fast [] acc c = (acc,c)
    fast (x:rest) acc c = fast rest (x:acc) (c+1)

main :: IO ()
main = do
  print (reverseCosts [])  -- expected: (True,0,0)
  print (reverseCosts ["one"])  -- expected: (True,0,1)
  print (reverseCosts ["a","b"])  -- expected: (True,1,2)
  print (reverseCosts ["a","b","c"])  -- expected: (True,3,3)
  print (reverseCosts ["a","b","c","d","e"])  -- expected: (True,10,5)
