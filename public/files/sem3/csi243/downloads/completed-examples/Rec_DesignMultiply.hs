-- Title: Multiply signed integers by repeated addition
{-
QUESTION
Write multiply for two signed Integers using repeated addition.
Return the product, handling zero and both multiplier signs.
Recurse only on the absolute multiplier; do not use (*) to compute it.
-}

-- Read the question: Write multiply with the stated domain and result type.
-- Plan: Separate the multiplier sign, then decrease its absolute value to zero.
multiply :: Integer -> Integer -> Integer
-- Base cases stop recursion; each recursive call reduces the stated measure.
multiply a b = if b < 0 then negate (go (negate b)) else go b
  where
    go 0 = 0
    go k = a + go (k-1)

main :: IO ()
main = do
  print (multiply 3 4)  -- expected: 12
  print (multiply 3 (-4))  -- expected: -12
  print (multiply (-3) (-4))  -- expected: 12
  print (multiply 7 0)  -- expected: 0
  print (multiply 0 5)  -- expected: 0
