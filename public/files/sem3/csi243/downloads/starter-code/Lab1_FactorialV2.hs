-- Title: Multiply the first n positive odd integers
{-
QUESTION
Give a recursive definition of oddProduct :: Integer -> Integer.
For n >= 0, multiply the first n positive odd integers.
The empty product is 1; reject negative n.
-}

oddProduct :: Integer -> Integer
oddProduct = undefined -- Your answer here

main :: IO ()
main = do
  print (oddProduct 0)  -- expected: 1
  print (oddProduct 1)  -- expected: 1
  print (oddProduct 2)  -- expected: 3
  print (oddProduct 3)  -- expected: 15
  print (oddProduct 5)  -- expected: 945
