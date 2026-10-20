-- Title: Calculate factorial recursively
{-
QUESTION
Give a recursive definition of fac :: Integer -> Integer.
For n >= 0, fac n = n!. Include a short informative error for n < 0.
Dry run fac 3, which returns 6.
-}

-- Read the question: Write fac :: Integer -> Integer.
-- Plan: Use 1 for the empty product; multiply the final term by the smaller product.
-- Dry run: fac 3 = 3 * fac 2 = 3 * (2 * fac 1) = 3 * (2 * (1 * 1)) = 6.
fac :: Integer -> Integer
fac n
  | n < 0 = error "fac: negative argument"
  | n == 0 = 1 -- Base: empty product.
  | otherwise = n * fac (n - 1)

main :: IO ()
main = do
  print (fac 0)  -- expected: 1
  print (fac 1)  -- expected: 1
  print (fac 2)  -- expected: 2
  print (fac 3)  -- expected: 6
  print (fac 5)  -- expected: 120
