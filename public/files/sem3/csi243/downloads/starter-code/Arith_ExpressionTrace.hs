-- Title: Trace arithmetic and Boolean precedence
{-
QUESTION
Write trace :: Integer -> (Integer,Bool). Return
(1 + 2*n + 4, n > 2 && n < 5 || n == 0). Explain the precedence.
-}

trace :: Integer -> (Integer,Bool)
trace = undefined -- Your answer here

main :: IO ()
main = do
  print (trace 0)  -- expected: (5,True)
  print (trace 1)  -- expected: (7,False)
  print (trace 3)  -- expected: (11,True)
  print (trace 5)  -- expected: (15,False)
  print (trace (-2))  -- expected: (1,False)
