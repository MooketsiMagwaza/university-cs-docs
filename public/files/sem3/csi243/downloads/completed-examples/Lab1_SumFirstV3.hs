-- Title: Sum the squares of the first n sequence terms
{-
QUESTION
Specify, dry run and implement sumFirstSquares :: Int -> [Int] -> Int.
Sum the squares of the first n elements of a sequence.
Use all available terms when n exceeds the length.
For n <= 0 or an empty list return 0.
-}

-- Read the question: Write sumFirstSquares :: Int -> [Int] -> Int.
-- Plan: Reduce both the requested count and the remaining list at every step.
-- Dry run: sumFirstSquares 2 [2,3] = 4 + (9 + sumFirstSquares 0 []) = 13.
sumFirstSquares :: Int -> [Int] -> Int
sumFirstSquares n _ | n <= 0 = 0 -- Base: no terms requested.
sumFirstSquares _ [] = 0 -- Base: no terms available.
sumFirstSquares n (x:xs) = x * x + sumFirstSquares (n - 1) xs

main :: IO ()
main = do
  print (sumFirstSquares 0 [1,2,3])  -- expected: 0
  print (sumFirstSquares 5 [1,2,3,4,5,6])  -- expected: 55
  print (sumFirstSquares 3 [])  -- expected: 0
  print (sumFirstSquares 1 [7,8])  -- expected: 49
  print (sumFirstSquares 5 [2,3])  -- expected: 13
  print (sumFirstSquares (-1) [2,3])  -- expected: 0
