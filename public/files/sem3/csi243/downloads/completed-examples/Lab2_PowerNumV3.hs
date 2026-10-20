-- Title: Raise one more than an integer to a power
{-
QUESTION
Specify and implement powerPlusOne :: Int -> Int -> Int recursively using guards.
Return (n+1) raised to the power y. For example, powerPlusOne 2 3 = 27.
The zeroth power is 1, including when the base is zero. Reject negative y.
-}

-- Read the question: Write powerPlusOne :: Int -> Int -> Int.
-- Plan: Multiply by the base once per recursive step, reducing the exponent.
-- Dry run: powerPlusOne 2 3 = 3 * (3 * (3 * powerPlusOne 2 0)) = 27.
powerPlusOne :: Int -> Int -> Int
powerPlusOne n y
  | y < 0 = error "powerPlusOne: negative exponent"
  | y == 0 = 1 -- Base: empty product.
  | otherwise = (n + 1) * powerPlusOne n (y - 1)

main :: IO ()
main = do
  print (powerPlusOne 2 3)  -- expected: 27
  print (powerPlusOne 10 0)  -- expected: 1
  print (powerPlusOne 10 1)  -- expected: 11
  print (powerPlusOne 0 3)  -- expected: 1
  print (powerPlusOne (-2) 3)  -- expected: -1
