-- Title: Compose mapping and a product
{-
QUESTION
Write total :: [Integer] -> Integer without naming its list argument. [4]
Use (.) to compose product with map (+1).
-}

total :: [Integer] -> Integer
total = undefined  -- Your answer here

main :: IO ()
main = do
  print (total [])  -- expected: 1
  print (total [0])  -- expected: 1
  print (total [2])  -- expected: 3
  print (total [1,2,3])  -- expected: 24
  print (total [-1,5])  -- expected: 0
