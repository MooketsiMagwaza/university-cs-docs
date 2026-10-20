-- Title: Square the odd integers in a list.
{-
QUESTION
Create a list comprehension that, given a list of integers between 1
and 79, returns the square of each integer only if it is odd. Define
oddSquares :: [Int] -> [Int], preserving input order.
-}

-- Read the question: Write a list-to-list function using a comprehension.
-- Plan: Generate each element, filter it, and calculate its power.
oddSquares :: [Int] -> [Int]
-- The guard selects values before the output expression transforms them.
oddSquares xs = [x*x | x <- xs, odd x]

main :: IO ()
main = do
  print (oddSquares [])  -- expected: []
  print (oddSquares [1])  -- expected: [1]
  print (oddSquares [1,2,3,4,5])  -- expected: [1,9,25]
  print (oddSquares [2,4,6])  -- expected: []
  print (oddSquares [77,78,79])  -- expected: [5929,6241]
