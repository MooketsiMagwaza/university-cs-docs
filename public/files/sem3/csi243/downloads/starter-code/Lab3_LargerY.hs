-- Title: Keep list elements larger than a threshold
{-
QUESTION
Given a list and integer y, define largerY recursively.
Return all integers strictly larger than y, retaining their order.
For example, largerY [3,1,7,10] 4 = [7,10].
An empty input returns an empty list. Give the signature and a dry run.
-}

largerY :: [Int] -> Int -> [Int]
largerY = undefined -- Your answer here

main :: IO ()
main = do
  print (largerY [3,1,7,10] 4)  -- expected: [7,10]
  print (largerY [] 4)  -- expected: []
  print (largerY [4] 4)  -- expected: []
  print (largerY [5] 4)  -- expected: [5]
  print (largerY [-2,0,3] (-1))  -- expected: [0,3]
