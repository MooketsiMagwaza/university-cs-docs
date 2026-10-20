-- Title: Multiply with a signed accumulator
{-
QUESTION
Write multiply for two signed Integers using repeated addition.
Return the product, handling zero and both multiplier signs.
Use a tail-recursive accumulator.
-}

-- Read the question: Write multiply with the stated domain and result type.
-- Plan: Separate the multiplier sign, then decrease its absolute value to zero.
multiply :: Integer -> Integer -> Integer
-- Base cases stop recursion; each recursive call reduces the stated measure.
multiply a b = go (abs b) 0
  where
    signedA = if b < 0 then negate a else a
    go 0 acc = acc
    go k acc = go (k-1) (acc+signedA)

main :: IO ()
main = do
  print (multiply 3 4)  -- expected: 12
  print (multiply 3 (-4))  -- expected: -12
  print (multiply (-3) (-4))  -- expected: 12
  print (multiply 7 0)  -- expected: 0
  print (multiply 0 5)  -- expected: 0
