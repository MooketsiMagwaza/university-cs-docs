-- Title: Compare repeated addition with multiplication
{-
QUESTION
Write multiply for two signed Integers using repeated addition.
Return the product and whether it equals the built-in product.
Recurse only on the absolute multiplier; do not use (*) to compute it.
-}

multiply :: Integer -> Integer -> (Integer,Bool)
multiply = undefined -- Your answer here

main :: IO ()
main = do
  print (multiply 3 4)  -- expected: (12,True)
  print (multiply 3 (-4))  -- expected: (-12,True)
  print (multiply (-3) (-4))  -- expected: (12,True)
  print (multiply 7 0)  -- expected: (0,True)
  print (multiply 0 5)  -- expected: (0,True)
