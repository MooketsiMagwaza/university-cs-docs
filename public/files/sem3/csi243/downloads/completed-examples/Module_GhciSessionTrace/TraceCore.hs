module TraceCore (total) where

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- The nonpositive base case terminates; the positive branch decreases n by one.

total :: Int -> Int
total n
  | n <= 0 = 0
  | otherwise = n + total (n - 1)
