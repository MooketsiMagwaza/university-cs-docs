-- Title: Keep list elements larger than a threshold
{-
QUESTION
Given a list and integer y, define largerY recursively.
Return all integers strictly larger than y, retaining their order.
For example, largerY [3,1,7,10] 4 = [7,10].
An empty input returns an empty list. Give the signature and a dry run.
-}

-- Read the question: Write largerY :: [Int] -> Int -> [Int].
-- Plan: Retain matching heads and skip the others; always recurse on the tail.
-- Dry run: largerY [3,1,7,10] 4 = largerY [1,7,10] 4 = 7 : (10 : []) = [7,10].
largerY :: [Int] -> Int -> [Int]
largerY [] _ = [] -- Base: no elements left.
largerY (x:xs) y
  | x > y = x : largerY xs y
  | otherwise = largerY xs y

main :: IO ()
main = do
  print (largerY [3,1,7,10] 4)  -- expected: [7,10]
  print (largerY [] 4)  -- expected: []
  print (largerY [4] 4)  -- expected: []
  print (largerY [5] 4)  -- expected: [5]
  print (largerY [-2,0,3] (-1))  -- expected: [0,3]
