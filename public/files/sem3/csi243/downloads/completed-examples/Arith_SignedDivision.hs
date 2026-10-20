-- Title: Apply div to signed integers
{-
QUESTION
Write signed :: Integer -> Integer -> Integer using div.
The divisor must be nonzero. Test all four sign combinations and zero
as the dividend. State how rounding or the remainder sign is chosen.
-}

-- Read the question: Write an Integer pair of inputs to one Integer result.
-- Plan: Use div; the quotient rounds down.
signed :: Integer -> Integer -> Integer
-- Key step: the chosen operation fixes the signed-division convention.
signed a b = a `div` b

main :: IO ()
main = do
  print (signed 7 3)  -- expected: 2
  print (signed (-7) 3)  -- expected: -3
  print (signed 7 (-3))  -- expected: -3
  print (signed (-7) (-3))  -- expected: 2
  print (signed 0 3)  -- expected: 0
