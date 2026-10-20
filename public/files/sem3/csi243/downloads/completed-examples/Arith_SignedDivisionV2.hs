-- Title: Apply mod to signed integers
{-
QUESTION
Write signed :: Integer -> Integer -> Integer using mod.
The divisor must be nonzero. Test all four sign combinations and zero
as the dividend. State how rounding or the remainder sign is chosen.
-}

-- Read the question: Write an Integer pair of inputs to one Integer result.
-- Plan: Use mod; the remainder follows the divisor.
signed :: Integer -> Integer -> Integer
-- Key step: the chosen operation fixes the signed-division convention.
signed a b = a `mod` b

main :: IO ()
main = do
  print (signed 7 3)  -- expected: 1
  print (signed (-7) 3)  -- expected: 2
  print (signed 7 (-3))  -- expected: -2
  print (signed (-7) (-3))  -- expected: -1
  print (signed 0 3)  -- expected: 0
