-- Title: Select all nonnegative integers recursively
{-
QUESTION
Write nonnegativeNumbers :: [Int] -> [Int] recursively.
Return all nonnegative integers, including zero, as a new list.
Keep the original order and duplicates; empty input returns [].
-}

-- Read the question: Write nonnegativeNumbers :: [Int] -> [Int].
-- Plan: Test each head against the condition and recursively select from the tail.
-- Dry run: nonnegativeNumbers [-3,0,2,2] = 0 : (2 : (2 : [])) = [0,2,2].
nonnegativeNumbers :: [Int] -> [Int]
nonnegativeNumbers [] = [] -- Base: empty selection.
nonnegativeNumbers (x:xs)
  | x >= 0 = x : nonnegativeNumbers xs
  | otherwise = nonnegativeNumbers xs

main :: IO ()
main = do
  print (nonnegativeNumbers [-1,5,-3,8])  -- expected: [5,8]
  print (nonnegativeNumbers [])  -- expected: []
  print (nonnegativeNumbers [0])  -- expected: [0]
  print (nonnegativeNumbers [5])  -- expected: [5]
  print (nonnegativeNumbers [-3,0,2,2])  -- expected: [0,2,2]
