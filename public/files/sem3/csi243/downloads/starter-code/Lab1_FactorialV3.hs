-- Title: Multiply the first n positive even integers
{-
QUESTION
Give a recursive definition of evenProduct :: Integer -> Integer.
For n >= 0, multiply the first n positive even integers.
The empty product is 1; reject negative n.
-}

evenProduct :: Integer -> Integer
evenProduct = undefined -- Your answer here

main :: IO ()
main = do
  print (evenProduct 0)  -- expected: 1
  print (evenProduct 1)  -- expected: 2
  print (evenProduct 2)  -- expected: 8
  print (evenProduct 3)  -- expected: 48
  print (evenProduct 5)  -- expected: 3840
