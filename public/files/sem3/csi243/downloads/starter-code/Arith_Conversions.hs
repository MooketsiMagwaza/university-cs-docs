-- Title: Convert before dividing
{-
QUESTION
Write convert :: Int -> Int -> Double. Convert both operands before
dividing. The second operand must be nonzero.
-}

convert :: Int -> Int -> Double
convert = undefined -- Your answer here

main :: IO ()
main = do
  print (convert 5 2)  -- expected: 2.5
  print (convert (-5) 2)  -- expected: -2.5
  print (convert 0 2)  -- expected: 0.0
  print (convert 1 4)  -- expected: 0.25
  print (convert 6 3)  -- expected: 2.0
