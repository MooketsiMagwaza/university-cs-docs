-- Title: Compute a factorial recursively
{-
QUESTION
Write factorial :: Integer -> Integer recursively for n >= 0. [4]
The empty product is 1. Do not use product.
-}

factorial :: Integer -> Integer
factorial = undefined  -- Your answer here

main :: IO ()
main = do
  print (factorial 0)  -- expected: 1
  print (factorial 1)  -- expected: 1
  print (factorial 3)  -- expected: 6
  print (factorial 4)  -- expected: 24
  print (factorial 5)  -- expected: 120
