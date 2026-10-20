-- Title: Widen an Int before squaring
{-
QUESTION
Write convert :: Int -> Integer. Use toInteger before squaring, so
the multiplication is performed on unbounded Integer values.
-}

convert :: Int -> Integer
convert = undefined -- Your answer here

main :: IO ()
main = do
  print (convert 0)  -- expected: 0
  print (convert 1)  -- expected: 1
  print (convert (-3))  -- expected: 9
  print (convert 12)  -- expected: 144
  print (convert 50000)  -- expected: 2500000000
