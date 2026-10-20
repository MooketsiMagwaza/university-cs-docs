-- Title: Square integers divisible by three.
{-
QUESTION
Write tripleSquares :: [Int] -> [Int] using a comprehension. Square
only integers divisible by 3, preserving input order.
-}

-- Read the question: Write a list-to-list function using a comprehension.
-- Plan: Generate each element, filter it, and calculate its power.
tripleSquares :: [Int] -> [Int]
-- The guard selects values before the output expression transforms them.
tripleSquares xs = [x*x | x <- xs, x `mod` 3 == 0]

main :: IO ()
main = do
  print (tripleSquares [])  -- expected: []
  print (tripleSquares [0])  -- expected: [0]
  print (tripleSquares [1,2,3,6,9])  -- expected: [9,36,81]
  print (tripleSquares [-3,4,12])  -- expected: [9,144]
  print (tripleSquares [1,2,4])  -- expected: []
