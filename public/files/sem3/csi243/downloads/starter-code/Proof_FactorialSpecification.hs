-- Title: Prove factorial equals its mathematical product specification
{-
QUESTION
Write fact :: Integer -> Integer for n>=0, with fact 0=1 and
fact n=n*fact(n-1). Prove for every natural n that
fact n = product [1..n], not merely that fact n is positive.
Use claim, induction variable, base case, hypothesis, step and conclusion,
with a reason on each line. State termination separately.
Also write factorialCheck :: Integer -> Maybe Bool: Nothing for n<0,
otherwise Just of the specification equality. An invalid precondition
does not authorise a fabricated factorial result. Finite checks are
illustrations of the universal proof, not a replacement for it.
-}

fact :: Integer -> Integer
fact = undefined -- Your answer here

factorialCheck :: Integer -> Maybe Bool
factorialCheck = undefined -- Your answer here

main :: IO ()
main = do
  print (fact 0)  -- expected: 1
  print (fact 1)  -- expected: 1
  print (fact 5)  -- expected: 120
  print (factorialCheck (-1))  -- expected: Nothing
  print (factorialCheck 0)  -- expected: Just True
  print (factorialCheck 1)  -- expected: Just True
  print (factorialCheck 5)  -- expected: Just True
