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

doubleFact :: Integer -> Integer
doubleFact = undefined -- Your answer here

doubleCheck :: Integer -> Maybe (Integer, Bool)
doubleCheck = undefined -- Your answer here

main :: IO ()
main = do
  print (doubleCheck (-1))  -- expected: Nothing
  print (doubleCheck 0)  -- expected: Just (1,True)
  print (doubleCheck 1)  -- expected: Just (1,True)
  print (doubleCheck 2)  -- expected: Just (2,True)
  print (doubleCheck 5)  -- expected: Just (15,True)
  print (doubleCheck 6)  -- expected: Just (48,True)
