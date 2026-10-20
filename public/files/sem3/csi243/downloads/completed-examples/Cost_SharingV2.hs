-- Title: Count traversals of changing suffixes
{-
QUESTION
Write suffixCosts :: [Char] -> ([Int], Int). For every non-empty
suffix, compute its length with a separate traversal. Return these
lengths in original suffix order and total length-cell visits.
Do not reuse one suffix length to obtain the next.
C(0)=0; C(n)=n+C(n-1), hence n(n+1)/2. Unlike an invariant length,
the argument changes here. Counts model the stated traversal algorithm,
not an unconditional assertion about compiler optimisation.
-}

-- Read the question: Write a definition; suffixCosts has input/result type [Char] -> ([Int], Int).
-- Plan: Keep separate symbolic counters for each explicitly stated traversal policy.
suffixCosts :: [Char] -> ([Int], Int)
suffixCosts [] = ([],0)
suffixCosts xs@(_:rest) = (n:ns,n+c)
  where
    n = length xs
    (ns,c) = suffixCosts rest

main :: IO ()
main = do
  print (suffixCosts "")  -- expected: ([],0)
  print (suffixCosts "a")  -- expected: ([1],1)
  print (suffixCosts "ab")  -- expected: ([2,1],3)
  print (suffixCosts "abc")  -- expected: ([3,2,1],6)
  print (suffixCosts "abcde")  -- expected: ([5,4,3,2,1],15)
