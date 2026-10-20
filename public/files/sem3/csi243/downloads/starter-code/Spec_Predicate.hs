-- Title: Translate only-if, equivalence and XOR truth tables
{-
QUESTION
Write truthRows :: [(Bool, Bool)] -> [(Bool, Bool, Bool)].
For each (p,q), return (p only if q, p if and only if q, p XOR q).
Use implication (not p || q), equivalence (p == q), XOR (p /= q).
The complete table for inputs FF, FT, TF, TT is respectively
(T,T,F), (T,F,T), (F,F,T), (T,T,F).
There is no precondition on the finite input list; [] produces [].
"Only if" does not assert the converse implication.
-}

truthRows :: [(Bool, Bool)] -> [(Bool, Bool, Bool)]
truthRows = undefined -- Your answer here

main :: IO ()
main = do
  print (truthRows [])  -- expected: []
  print (truthRows [(False,False)])  -- expected: [(True,True,False)]
  print (truthRows [(False,True)])  -- expected: [(True,False,True)]
  print (truthRows [(True,False)])  -- expected: [(False,False,True)]
  print (truthRows [(True,True)])  -- expected: [(True,True,False)]
