-- Title: Prove an inclusive range product including reversed bounds
{-
QUESTION
Write rangeProduct :: Integer -> Integer -> Integer with
rangeProduct lo hi = 1 when lo>hi, otherwise
lo * rangeProduct (lo+1) hi. Prove equality to product [lo..hi]
for all Integer bounds, including negative and reversed bounds.
Induct on interval length max 0 (hi-lo+1). State the product identity
used and termination separately. Also write rangeCheck returning the
computed product and whether it equals the specification.
No input bounds are invalid: reversed bounds denote the empty product.
-}

-- Read the question: Write a definition; rangeProduct has input/result type Integer -> Integer -> Integer.
-- Plan: Induct on interval length so signed and reversed bounds are covered.
{- Proof.
Claim: rangeProduct lo hi = product [lo..hi] for all Integer lo,hi.
Induct on natural length d=max 0 (hi-lo+1).
Base d=0: lo>hi, so rangeProduct lo hi = 1    [guard]
                                      = product [] [empty product]
                                      = product [lo..hi] [empty range].
Hypothesis: equality holds for every interval of length d.
Step for length d+1: lo<=hi, and the tail interval has length d.
rangeProduct lo hi = lo * rangeProduct (lo+1) hi [definition]
                   = lo * product [lo+1..hi]    [hypothesis]
                   = product [lo..hi]          [product head identity].
Conclusion: induction proves the claim for all intervals.
Termination: the non-empty length decreases by 1 on each call, reaching
0. This proves termination separately from partial correctness.
-}

rangeProduct :: Integer -> Integer -> Integer
rangeProduct lo hi
  | lo > hi = 1 -- Empty product.
  | otherwise = lo * rangeProduct (lo+1) hi

rangeCheck :: Integer -> Integer -> (Integer, Bool)
rangeCheck lo hi = (value,value == product [lo..hi])
  where value = rangeProduct lo hi

main :: IO ()
main = do
  print (rangeCheck 3 1)  -- expected: (1,True)
  print (rangeCheck 0 0)  -- expected: (0,True)
  print (rangeCheck 1 1)  -- expected: (1,True)
  print (rangeCheck 2 4)  -- expected: (24,True)
  print (rangeCheck (-3) (-1))  -- expected: (-6,True)
  print (rangeCheck (-2) 2)  -- expected: (0,True)
