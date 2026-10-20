-- Title: Count values at least a threshold
{-
QUESTION
Write countAtLeast y xs. Count elements at least y, including equal
values. Return zero for the empty list.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write countAtLeast with the stated list and result types.
-- Plan: Test the head, then select, count or search in the remaining tail.
countAtLeast :: Integer -> [Integer] -> Int
-- Base cases handle missing data; the recursive case consumes list structure.
countAtLeast _ [] = 0
countAtLeast y (x:xs)
  | x >= y = 1 + countAtLeast y xs
  | otherwise = countAtLeast y xs

main :: IO ()
main = do
  print (countAtLeast 2 [])  -- expected: 0
  print (countAtLeast 2 [2])  -- expected: 1
  print (countAtLeast 2 [3,2,5,3])  -- expected: 4
  print (countAtLeast 0 [1,2,3])  -- expected: 3
  print (countAtLeast 5 [1,2,3])  -- expected: 0
