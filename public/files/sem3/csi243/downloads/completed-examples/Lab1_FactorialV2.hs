-- Title: Multiply the first n positive odd integers
{-
QUESTION
Give a recursive definition of oddProduct :: Integer -> Integer.
For n >= 0, multiply the first n positive odd integers.
The empty product is 1; reject negative n.
-}

-- Read the question: Write oddProduct :: Integer -> Integer.
-- Plan: Use 1 for the empty product; multiply the final term by the smaller product.
-- Dry run: oddProduct 3 = 5 * (3 * (1 * 1)) = 15.
oddProduct :: Integer -> Integer
oddProduct n
  | n < 0 = error "oddProduct: negative argument"
  | n == 0 = 1 -- Base: empty product.
  | otherwise = (2 * n - 1) * oddProduct (n - 1)

main :: IO ()
main = do
  print (oddProduct 0)  -- expected: 1
  print (oddProduct 1)  -- expected: 1
  print (oddProduct 2)  -- expected: 3
  print (oddProduct 3)  -- expected: 15
  print (oddProduct 5)  -- expected: 945
