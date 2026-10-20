-- Title: Classify a pair using guarded case alternatives
{-
QUESTION
Write relation :: (Integer,Integer) -> String using case and guards. [5]
Return "Equal" for equal components, "Increasing" if the first is smaller,
and "Decreasing" otherwise.
-}

-- Read the question: Write relation :: (Integer,Integer) -> String.
-- Plan: Bind the two components once and try guards in order.
relation :: (Integer,Integer) -> String
relation pair = case pair of
  (x,y) | x == y -> "Equal"
        | x < y -> "Increasing"
        | otherwise -> "Decreasing"  -- Final guard covers the rest.

main :: IO ()
main = do
  print (relation (0,0))  -- expected: "Equal"
  print (relation (1,2))  -- expected: "Increasing"
  print (relation (2,1))  -- expected: "Decreasing"
  print (relation (-3,-1))  -- expected: "Increasing"
  print (relation (7,7))  -- expected: "Equal"
