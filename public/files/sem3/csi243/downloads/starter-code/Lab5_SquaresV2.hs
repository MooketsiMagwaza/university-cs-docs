-- Title: Cube the even integers in a list.
{-
QUESTION
Write evenCubes :: [Int] -> [Int] using a comprehension. Keep only even
integers and cube them, preserving input order.
-}

evenCubes :: [Int] -> [Int]
evenCubes = undefined -- Your answer here

main :: IO ()
main = do
  print (evenCubes [])  -- expected: []
  print (evenCubes [0])  -- expected: [0]
  print (evenCubes [1,2,3,4])  -- expected: [8,64]
  print (evenCubes [-2,-1,2])  -- expected: [-8,8]
  print (evenCubes [3,5])  -- expected: []
