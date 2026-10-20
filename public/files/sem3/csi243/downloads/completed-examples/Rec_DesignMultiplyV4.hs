-- Title: Compare repeated addition with multiplication
{-
QUESTION
Write multiply for two signed Integers using repeated addition.
Return the product and whether it equals the built-in product.
Recurse only on the absolute multiplier; do not use (*) to compute it.
-}

-- Read the question: Write multiply with the stated domain and result type.
-- Plan: Separate the multiplier sign, then decrease its absolute value to zero.
multiply :: Integer -> Integer -> (Integer,Bool)
-- Base cases stop recursion; each recursive call reduces the stated measure.
multiply a b = (result,result == a*b)
  where
    result = if b < 0 then negate (go (negate b)) else go b
    go 0 = 0
    go k = a + go (k-1)

main :: IO ()
main = do
  print (multiply 3 4)  -- expected: (12,True)
  print (multiply 3 (-4))  -- expected: (-12,True)
  print (multiply (-3) (-4))  -- expected: (12,True)
  print (multiply 7 0)  -- expected: (0,True)
  print (multiply 0 5)  -- expected: (0,True)
