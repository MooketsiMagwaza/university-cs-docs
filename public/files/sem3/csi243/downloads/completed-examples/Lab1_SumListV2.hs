-- Title: Multiply the terms of a sequence recursively
{-
QUESTION
Provide a recursive definition, including a base case and recursive step,
for productList :: [Int] -> Int.
Return the product of all terms of the input sequence. Empty product is 1.
-}

-- Read the question: Write productList :: [Int] -> Int.
-- Plan: Combine the first term with the recursively combined remaining terms.
-- Dry run: productList [1,2,3] = 1 * (2 * (3 * productList [])) = 6.
productList :: [Int] -> Int
productList [] = 1 -- Base: no terms.
productList (x:xs) = x * productList xs

main :: IO ()
main = do
  print (productList [])  -- expected: 1
  print (productList [5])  -- expected: 5
  print (productList [1,2,3])  -- expected: 6
  print (productList [-2,2])  -- expected: -4
  print (productList [4,4,1])  -- expected: 16
