-- Title: Keep list elements at least a threshold
{-
QUESTION
Given a list and integer y, define atLeastY recursively.
Return all integers greater than or equal to y, retaining their order.
An empty input returns an empty list. Give the signature and a dry run.
-}

atLeastY :: [Int] -> Int -> [Int]
atLeastY = undefined -- Your answer here

main :: IO ()
main = do
  print (atLeastY [3,1,7,10] 3)  -- expected: [3,7,10]
  print (atLeastY [] 4)  -- expected: []
  print (atLeastY [4] 4)  -- expected: [4]
  print (atLeastY [3] 4)  -- expected: []
  print (atLeastY [-2,0,3] 0)  -- expected: [0,3]
