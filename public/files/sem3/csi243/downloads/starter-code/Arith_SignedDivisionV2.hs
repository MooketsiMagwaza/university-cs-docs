-- Title: Apply mod to signed integers
{-
QUESTION
Write signed :: Integer -> Integer -> Integer using mod.
The divisor must be nonzero. Test all four sign combinations and zero
as the dividend. State how rounding or the remainder sign is chosen.
-}

signed :: Integer -> Integer -> Integer
signed = undefined -- Your answer here

main :: IO ()
main = do
  print (signed 7 3)  -- expected: 1
  print (signed (-7) 3)  -- expected: 2
  print (signed 7 (-3))  -- expected: -2
  print (signed (-7) (-3))  -- expected: -1
  print (signed 0 3)  -- expected: 0
