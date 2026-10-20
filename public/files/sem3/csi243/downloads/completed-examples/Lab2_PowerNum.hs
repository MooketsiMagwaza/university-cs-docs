-- Title: Raise an integer to a nonnegative integer power
{-
QUESTION
Specify and implement powerNum :: Int -> Int -> Int recursively using guards.
Raise n to the power y. powerNum 2 7 = 128, powerNum 10 0 = 1,
and powerNum 10 1 = 10.
The zeroth power is 1, including when the base is zero. Reject negative y.
-}

-- Read the question: Write powerNum :: Int -> Int -> Int.
-- Plan: Multiply by the base once per recursive step, reducing the exponent.
-- Dry run: powerNum 2 3 = 2 * (2 * (2 * powerNum 2 0)) = 8.
powerNum :: Int -> Int -> Int
powerNum n y
  | y < 0 = error "powerNum: negative exponent"
  | y == 0 = 1 -- Base: empty product.
  | otherwise = n * powerNum n (y - 1)

main :: IO ()
main = do
  print (powerNum 2 7)  -- expected: 128
  print (powerNum 10 0)  -- expected: 1
  print (powerNum 10 1)  -- expected: 10
  print (powerNum 0 3)  -- expected: 0
  print (powerNum (-2) 3)  -- expected: -8
