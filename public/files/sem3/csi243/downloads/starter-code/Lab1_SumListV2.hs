-- Title: Multiply the terms of a sequence recursively
{-
QUESTION
Provide a recursive definition, including a base case and recursive step,
for productList :: [Int] -> Int.
Return the product of all terms of the input sequence. Empty product is 1.
-}

productList :: [Int] -> Int
productList = undefined -- Your answer here

main :: IO ()
main = do
  print (productList [])  -- expected: 1
  print (productList [5])  -- expected: 5
  print (productList [1,2,3])  -- expected: 6
  print (productList [-2,2])  -- expected: -4
  print (productList [4,4,1])  -- expected: 16
