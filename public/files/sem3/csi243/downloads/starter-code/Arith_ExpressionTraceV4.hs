-- Title: Distinguish subtract from negation
{-
QUESTION
Write trace :: Integer -> (Integer,Integer,Integer,Integer, Integer).
Return negate n, abs n, signum n, subtract 3 n and 3-n, in order.
-}

trace :: Integer -> (Integer,Integer,Integer,Integer,Integer)
trace = undefined -- Your answer here

main :: IO ()
main = do
  print (trace (-3))  -- expected: (3,3,-1,-6,6)
  print (trace (-1))  -- expected: (1,1,-1,-4,4)
  print (trace 0)  -- expected: (0,0,0,-3,3)
  print (trace 1)  -- expected: (-1,1,1,-2,2)
  print (trace 3)  -- expected: (-3,3,1,0,0)
