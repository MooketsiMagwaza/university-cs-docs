-- Title: Multiply the first n positive even integers
{-
QUESTION
Give a recursive definition of evenProduct :: Integer -> Integer.
For n >= 0, multiply the first n positive even integers.
The empty product is 1; reject negative n.
-}

-- Read the question: Write evenProduct :: Integer -> Integer.
-- Plan: Use 1 for the empty product; multiply the final term by the smaller product.
-- Dry run: evenProduct 3 = 6 * (4 * (2 * 1)) = 48.
evenProduct :: Integer -> Integer
evenProduct n
  | n < 0 = error "evenProduct: negative argument"
  | n == 0 = 1 -- Base: empty product.
  | otherwise = (2 * n) * evenProduct (n - 1)

main :: IO ()
main = do
  print (evenProduct 0)  -- expected: 1
  print (evenProduct 1)  -- expected: 2
  print (evenProduct 2)  -- expected: 8
  print (evenProduct 3)  -- expected: 48
  print (evenProduct 5)  -- expected: 3840
