-- Title: Raise an exact Double to a nonnegative power
{-
QUESTION
Specify and implement powerDouble :: Double -> Int -> Double recursively using guards.
Raise n to the power y, with n a Double. For example, 2.5 squared is 6.25.
The zeroth power is 1, including when the base is zero. Reject negative y.
-}

-- Read the question: Write powerDouble :: Double -> Int -> Double.
-- Plan: Multiply by the base once per recursive step, reducing the exponent.
-- Dry run: powerDouble 2.5 2 = 2.5 * (2.5 * powerDouble 2.5 0) = 6.25.
powerDouble :: Double -> Int -> Double
powerDouble n y
  | y < 0 = error "powerDouble: negative exponent"
  | y == 0 = 1 -- Base: empty product.
  | otherwise = n * powerDouble n (y - 1)

main :: IO ()
main = do
  print (powerDouble 2.5 2)  -- expected: 6.25
  print (powerDouble 10 0)  -- expected: 1.0
  print (powerDouble 10 1)  -- expected: 10.0
  print (powerDouble 0 3)  -- expected: 0.0
  print (powerDouble (-2) 3)  -- expected: -8.0
