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

-- Read the question: Write a definition; fact has input/result type Integer -> Integer.
-- Plan: Use natural-number induction and the product extension identity.
{- Proof.
Claim: fact n = product [1..n] for n in the natural numbers.
Induct on n.
Base n=0: fact 0 = 1                         [definition of fact]
                    = product []            [empty product]
                    = product [1..0]        [empty ascending range].
Hypothesis: fact k = product [1..k] for arbitrary k>=0.
Step: fact (k+1) = (k+1) * fact k            [definition of fact]
                = (k+1) * product [1..k]     [induction hypothesis]
                = product [1..k+1]          [product extension identity].
Conclusion: the specification holds for all natural n by induction.
Termination: n is a natural decreasing by 1 until 0; thus fact terminates
on its precondition. Correct result plus termination gives total
correctness on that domain, separately from the wrapper's error policy.
-}

fact :: Integer -> Integer
fact 0 = 1 -- Empty product is the base case.
fact n = n * fact (n-1)

factorialCheck :: Integer -> Maybe Bool
factorialCheck n
  | n < 0 = Nothing
  | otherwise = Just (fact n == product [1..n])

main :: IO ()
main = do
  print (fact 0)  -- expected: 1
  print (fact 1)  -- expected: 1
  print (fact 5)  -- expected: 120
  print (factorialCheck (-1))  -- expected: Nothing
  print (factorialCheck 0)  -- expected: Just True
  print (factorialCheck 1)  -- expected: Just True
  print (factorialCheck 5)  -- expected: Just True
