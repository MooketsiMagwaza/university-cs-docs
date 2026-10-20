-- Title: Expose the negative repeated-addition counterexample
{-
QUESTION
Write trace :: Int -> (Int,Int,Bool). Let s be the sum of
replicate n n. Return (s,n*n,s == n*n). Explain why equality
requires n >= 0: replicate with a negative count produces [].
-}

trace :: Int -> (Int,Int,Bool)
trace = undefined -- Your answer here

main :: IO ()
main = do
  print (trace (-3))  -- expected: (0,9,False)
  print (trace (-1))  -- expected: (0,1,False)
  print (trace 0)  -- expected: (0,0,True)
  print (trace 1)  -- expected: (1,1,True)
  print (trace 4)  -- expected: (16,16,True)
