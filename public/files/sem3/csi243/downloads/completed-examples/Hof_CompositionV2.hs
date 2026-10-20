-- Title: Compose mapping and a product
{-
QUESTION
Write total :: [Integer] -> Integer without naming its list argument. [4]
Use (.) to compose product with map (+1).
-}

-- Read the question: Write total :: [Integer] -> Integer.
-- Plan: Map the section first, then collapse with product.
total :: [Integer] -> Integer
total = product . map (+1)  -- Shift all values before multiplying.

main :: IO ()
main = do
  print (total [])  -- expected: 1
  print (total [0])  -- expected: 1
  print (total [2])  -- expected: 3
  print (total [1,2,3])  -- expected: 24
  print (total [-1,5])  -- expected: 0
