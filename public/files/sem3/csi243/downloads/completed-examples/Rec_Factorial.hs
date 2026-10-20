-- Title: Compute a factorial recursively
{-
QUESTION
Write factorial :: Integer -> Integer recursively for n >= 0. [4]
The empty product is 1. Do not use product.
-}

-- Read the question: Write factorial :: Integer -> Integer.
-- Plan: Stop at zero; multiply by the answer for n - 1.
factorial :: Integer -> Integer
factorial 0 = 1  -- Empty product.
factorial n = n * factorial (n - 1)

main :: IO ()
main = do
  print (factorial 0)  -- expected: 1
  print (factorial 1)  -- expected: 1
  print (factorial 3)  -- expected: 6
  print (factorial 4)  -- expected: 24
  print (factorial 5)  -- expected: 120
