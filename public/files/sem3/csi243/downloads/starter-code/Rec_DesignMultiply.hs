-- Title: Multiply signed integers by repeated addition
{-
QUESTION
Write multiply for two signed Integers using repeated addition.
Return the product, handling zero and both multiplier signs.
Recurse only on the absolute multiplier; do not use (*) to compute it.
-}

multiply :: Integer -> Integer -> Integer
multiply = undefined -- Your answer here

main :: IO ()
main = do
  print (multiply 3 4)  -- expected: 12
  print (multiply 3 (-4))  -- expected: -12
  print (multiply (-3) (-4))  -- expected: 12
  print (multiply 7 0)  -- expected: 0
  print (multiply 0 5)  -- expected: 0
