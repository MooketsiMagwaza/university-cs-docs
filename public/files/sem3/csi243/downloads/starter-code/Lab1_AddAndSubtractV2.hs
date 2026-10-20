-- Title: Return the product and sum as a pair
{-
QUESTION
Write multiplyAndAdd :: Int -> Int -> (Int, Int).
Return the product first and the sum second.
-}

multiplyAndAdd :: Int -> Int -> (Int, Int)
multiplyAndAdd = undefined -- Your answer here

main :: IO ()
main = do
  print (multiplyAndAdd 0 0)  -- expected: (0,0)
  print (multiplyAndAdd 7 3)  -- expected: (21,10)
  print (multiplyAndAdd 3 7)  -- expected: (21,10)
  print (multiplyAndAdd (-2) 5)  -- expected: (-10,3)
  print (multiplyAndAdd 5 (-2))  -- expected: (-10,3)
