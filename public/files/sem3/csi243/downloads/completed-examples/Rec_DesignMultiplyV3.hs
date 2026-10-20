-- Title: Build a signed cube from repeated addition
{-
QUESTION
Write cube :: Integer -> Integer using a local signed multiplication
helper defined by repeated addition. Do not use (*) or (^).
-}

-- Read the question: Write cube with the stated domain and result type.
-- Plan: Separate the multiplier sign, then decrease its absolute value to zero.
cube :: Integer -> Integer
-- Base cases stop recursion; each recursive call reduces the stated measure.
cube n = times n (times n n)
  where
    times a b
      | b < 0 = negate (times a (negate b))
      | b == 0 = 0
      | otherwise = a + times a (b-1)

main :: IO ()
main = do
  print (cube 0)  -- expected: 0
  print (cube 1)  -- expected: 1
  print (cube (-1))  -- expected: -1
  print (cube 3)  -- expected: 27
  print (cube (-2))  -- expected: -8
