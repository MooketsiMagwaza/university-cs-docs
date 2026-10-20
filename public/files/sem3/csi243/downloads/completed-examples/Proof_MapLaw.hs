-- Title: Prove mapping id leaves a list unchanged
{-
QUESTION
Claim: mapR id xs = xs for every finite total list xs.
Prove the claim by structural induction using the given definitions. [8]
State the hypothesis for the tail and justify every rewriting step.
-}

-- Read the question: Prove the universal claim for the stated domain by induction.
-- Plan: Expand mapR at each constructor and use the hypothesis on the tail.
mapR :: (a -> b) -> [a] -> [b]
mapR _ [] = []
mapR f (x:xs) = f x : mapR f xs

{-
Claim: mapR id xs = xs for every finite total list xs. -- stated goal
Induct on: xs. -- mapR takes apart the list
Base case: xs = []. -- empty-list constructor
mapR id [] = [] -- mapR base equation
Hypothesis: mapR id xs = xs. -- smaller tail
Step: xs becomes x:xs. -- cons constructor
mapR id (x:xs) = id x : mapR id xs -- mapR recursive equation
= x : mapR id xs -- definition of id
= x:xs -- inductive hypothesis
Conclusion: the claim holds for all finite lists in the stated domain. -- structural induction
-}

main :: IO ()
main = do
  print (all (\xs -> mapR id xs == xs) ([[],[1],[1,2,3]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR id xs == xs) ([[-2],[-1,0],[0,0]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR id xs == xs) ([[4,5],[9],[2,2,2]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR id xs == xs) ([[1..10],[10,9..1]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR id xs == xs) ([[],[7],[100,-100]] :: [[Integer]]))  -- expected: True
