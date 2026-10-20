-- Title: Compare rounding rules on signed inputs
{-
QUESTION
Write convert :: Double -> (Integer,Integer,Integer,Integer).
Return floor, ceiling, truncate and round, in that order.
Remember that round sends exact half ties to the even integer.
-}

convert :: Double -> (Integer,Integer,Integer,Integer)
convert = undefined -- Your answer here

main :: IO ()
main = do
  print (convert 2.5)  -- expected: (2,3,2,2)
  print (convert 3.5)  -- expected: (3,4,3,4)
  print (convert (-2.5))  -- expected: (-3,-2,-2,-2)
  print (convert (-3.5))  -- expected: (-4,-3,-3,-4)
  print (convert 0)  -- expected: (0,0,0,0)
