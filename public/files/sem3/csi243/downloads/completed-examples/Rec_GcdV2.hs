-- Title: Implement gcd by repeated subtraction
{-
QUESTION
Write gcdS :: Integer -> Integer -> Integer recursively for a,b >= 0. [5]
Handle zero explicitly, then subtract the smaller positive argument.
-}

-- Read the question: Write gcdS :: Integer -> Integer -> Integer.
-- Plan: Handle zeros before the decreasing subtraction step.
gcdS :: Integer -> Integer -> Integer
gcdS a 0 = a
gcdS 0 b = b
gcdS a b
  | a == b = a  -- Equal positive arguments.
  | a > b = gcdS (a - b) b
  | otherwise = gcdS a (b - a)

main :: IO ()
main = do
  print (gcdS 0 0)  -- expected: 0
  print (gcdS 0 7)  -- expected: 7
  print (gcdS 8 8)  -- expected: 8
  print (gcdS 27 18)  -- expected: 9
  print (gcdS 14 9)  -- expected: 1
