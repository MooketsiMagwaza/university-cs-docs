-- Title: Prove double factorial against its descending product
{-
QUESTION
Write doubleFact :: Integer -> Integer for n>=0:
doubleFact 0=1, doubleFact 1=1, doubleFact n=n*doubleFact(n-2) for n>=2.
Prove doubleFact n = product [n,n-2..1] using both base cases and a
hypothesis at n-2. This is a descending progression with step -2;
at n=0 it is empty. State termination separately.
Also write doubleCheck :: Integer -> Maybe (Integer,Bool), returning
Nothing outside the precondition, otherwise the result and the product
specification check. A positivity argument is insufficient.
-}

-- Read the question: Write a definition; doubleFact has input/result type Integer -> Integer.
-- Plan: Use both parity base cases and the product head identity.
{- Proof.
Claim: doubleFact n = product [n,n-2..1] for every natural n.
Induct strongly on n, with separate bases 0 and 1.
Base 0: doubleFact 0 = 1 = product []          [definition; empty product].
Base 1: doubleFact 1 = 1 = product [1]         [definition; singleton].
Hypothesis: the claim holds at every smaller natural index.
Step n>=2:
doubleFact n = n * doubleFact (n-2)             [definition]
             = n * product [n-2,n-4..1]        [hypothesis at n-2]
             = product [n,n-2..1]              [progression head identity].
Conclusion: strong induction proves the full product specification.
Termination: n decreases by 2 while n>=2, reaching 0 or 1 in finitely
many calls. This is separate from the value equality proof.
-}

doubleFact :: Integer -> Integer
doubleFact 0 = 1
doubleFact 1 = 1
doubleFact n = n * doubleFact (n-2) -- One factor per parity-preserving step.

doubleCheck :: Integer -> Maybe (Integer, Bool)
doubleCheck n
  | n < 0 = Nothing
  | otherwise = Just (value,value == product [n,n-2..1])
  where value = doubleFact n

main :: IO ()
main = do
  print (doubleCheck (-1))  -- expected: Nothing
  print (doubleCheck 0)  -- expected: Just (1,True)
  print (doubleCheck 1)  -- expected: Just (1,True)
  print (doubleCheck 2)  -- expected: Just (2,True)
  print (doubleCheck 5)  -- expected: Just (15,True)
  print (doubleCheck 6)  -- expected: Just (48,True)
