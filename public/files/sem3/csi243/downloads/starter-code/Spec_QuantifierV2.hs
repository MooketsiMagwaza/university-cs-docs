-- Title: Show that swapping universal and existential changes meaning
{-
QUESTION
Write quantifierOrder :: [Int] -> [Int] -> (Bool, Bool).
For finite domains xs,ys return:
(1) every x in xs has some equal y in ys;
(2) some y in ys equals every x in xs.
Use nested all/any. In (1) each x may have a different witness; in (2)
one y must work for all x. Empty domains retain the usual vacuous-truth
rules. No precondition excludes either empty domain.
-}

quantifierOrder :: [Int] -> [Int] -> (Bool, Bool)
quantifierOrder = undefined -- Your answer here

main :: IO ()
main = do
  print (quantifierOrder [] [])  -- expected: (True,False)
  print (quantifierOrder [] [1])  -- expected: (True,True)
  print (quantifierOrder [1] [])  -- expected: (False,False)
  print (quantifierOrder [1,2] [1,2])  -- expected: (True,False)
  print (quantifierOrder [2,2] [1,2])  -- expected: (True,True)
  print (quantifierOrder [1,3] [2])  -- expected: (False,False)
