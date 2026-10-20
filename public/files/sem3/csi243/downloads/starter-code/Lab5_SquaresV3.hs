-- Title: Square integers divisible by three.
{-
QUESTION
Write tripleSquares :: [Int] -> [Int] using a comprehension. Square
only integers divisible by 3, preserving input order.
-}

tripleSquares :: [Int] -> [Int]
tripleSquares = undefined -- Your answer here

main :: IO ()
main = do
  print (tripleSquares [])  -- expected: []
  print (tripleSquares [0])  -- expected: [0]
  print (tripleSquares [1,2,3,6,9])  -- expected: [9,36,81]
  print (tripleSquares [-3,4,12])  -- expected: [9,144]
  print (tripleSquares [1,2,4])  -- expected: []
