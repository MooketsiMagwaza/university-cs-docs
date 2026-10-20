-- Title: Model retained input roots after a prefix is consumed
{-
QUESTION
Write retentionModel :: Int -> [Char] -> (Int, Int, Int).
Clamp requested consumption k to 0..n. Under a model with fully traversed
list spines and no external aliases, return consumed prefix length,
input cells still reachable when the original root is retained, and
input cells reachable when only the suffix root is retained.
These are k,n,n-k; result storage and control stack are excluded.
Keeping a reference to the original head retains the whole spine.
Reachability counts do not establish exact allocation or garbage
collector behaviour. Negative consumption means consume nothing.
-}

retentionModel :: Int -> [Char] -> (Int, Int, Int)
retentionModel = undefined -- Your answer here

main :: IO ()
main = do
  print (retentionModel 0 "")  -- expected: (0,0,0)
  print (retentionModel (-2) "abc")  -- expected: (0,3,3)
  print (retentionModel 0 "a")  -- expected: (0,1,1)
  print (retentionModel 2 "abcd")  -- expected: (2,4,2)
  print (retentionModel 9 "abc")  -- expected: (3,3,0)
