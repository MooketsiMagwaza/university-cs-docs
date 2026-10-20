-- Title: Compare truncation before and after division
{-
QUESTION
Write convert :: Int -> Int -> (Double,Double). For nonzero b return
(fromIntegral (a `div` b), fromIntegral a / fromIntegral b).
-}

convert :: Int -> Int -> (Double,Double)
convert = undefined -- Your answer here

main :: IO ()
main = do
  print (convert 5 2)  -- expected: (2.0,2.5)
  print (convert (-5) 2)  -- expected: (-3.0,-2.5)
  print (convert 0 2)  -- expected: (0.0,0.0)
  print (convert 1 4)  -- expected: (0.0,0.25)
  print (convert 6 3)  -- expected: (2.0,2.0)
