-- Title: Distinguish implications about positivity and evenness
{-
QUESTION
Write numberLogic :: Integer -> (Bool, Bool, Bool).
Let p mean n>0 and q mean n is even. Return (p implies q, p iff q, p XOR q).
Domain: all Integer values. The truth table for p,q in order FF,FT,TF,TT
is (T,T,F), (T,F,T), (F,F,T), (T,T,F).
The statement "positive only if even" is false at n=1; its converse is
a different statement. Zero is even but not positive.
-}

-- Read the question: Write a definition; numberLogic has input/result type Integer -> (Bool, Bool, Bool).
-- Plan: Translate each logical connective literally, including empty-domain identities.
numberLogic :: Integer -> (Bool, Bool, Bool)
numberLogic n = (not p || q, p == q, p /= q)
  where
    p = n > 0
    q = even n

main :: IO ()
main = do
  print (numberLogic (-2))  -- expected: (True,False,True)
  print (numberLogic (-1))  -- expected: (True,True,False)
  print (numberLogic 0)  -- expected: (True,False,True)
  print (numberLogic 1)  -- expected: (False,False,True)
  print (numberLogic 2)  -- expected: (True,True,False)
