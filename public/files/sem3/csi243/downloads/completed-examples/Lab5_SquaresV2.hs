-- Title: Cube the even integers in a list.
{-
QUESTION
Write evenCubes :: [Int] -> [Int] using a comprehension. Keep only even
integers and cube them, preserving input order.
-}

-- Read the question: Write a list-to-list function using a comprehension.
-- Plan: Generate each element, filter it, and calculate its power.
evenCubes :: [Int] -> [Int]
-- The guard selects values before the output expression transforms them.
evenCubes xs = [x*x*x | x <- xs, even x]

main :: IO ()
main = do
  print (evenCubes [])  -- expected: []
  print (evenCubes [0])  -- expected: [0]
  print (evenCubes [1,2,3,4])  -- expected: [8,64]
  print (evenCubes [-2,-1,2])  -- expected: [-8,8]
  print (evenCubes [3,5])  -- expected: []
