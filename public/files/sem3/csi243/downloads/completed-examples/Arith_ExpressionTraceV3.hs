-- Title: Expose the negative repeated-addition counterexample
{-
QUESTION
Write trace :: Int -> (Int,Int,Bool). Let s be the sum of
replicate n n. Return (s,n*n,s == n*n). Explain why equality
requires n >= 0: replicate with a negative count produces [].
-}

-- Read the question: Write trace from the expression specification and stated types.
-- Plan: Parenthesise grouped arithmetic and reduce operators in precedence order.
trace :: Int -> (Int,Int,Bool)
-- Key step: function application binds more tightly than infix arithmetic.
trace n = (s,n*n,s == n*n)
  where
    s = sum (replicate n n)

main :: IO ()
main = do
  print (trace (-3))  -- expected: (0,9,False)
  print (trace (-1))  -- expected: (0,1,False)
  print (trace 0)  -- expected: (0,0,True)
  print (trace 1)  -- expected: (1,1,True)
  print (trace 4)  -- expected: (16,16,True)
