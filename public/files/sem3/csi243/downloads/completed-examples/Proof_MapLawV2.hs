-- Title: Prove the map composition law
{-
QUESTION
Claim: mapR f (mapR g xs) = mapR (f . g) xs for all finite total xs and total f,g.
Prove the claim by structural induction using the given definitions. [8]
State the hypothesis for the tail and justify every rewriting step.
-}

-- Read the question: Prove the universal claim for the stated domain by induction.
-- Plan: Expand mapR at each constructor and use the hypothesis on the tail.
mapR :: (a -> b) -> [a] -> [b]
mapR _ [] = []
mapR f (x:xs) = f x : mapR f xs

{-
Claim: mapR f (mapR g xs) = mapR (f . g) xs for all finite total xs and total f,g. -- stated goal
Induct on: xs. -- mapR takes apart the list
Base case: xs = []. -- empty-list constructor
mapR f (mapR g []) = mapR f [] -- mapR base equation for g
= [] -- mapR base equation for f
= mapR (f . g) [] -- mapR base equation, backwards
Hypothesis: mapR f (mapR g xs) = mapR (f . g) xs. -- smaller tail
Step: xs becomes x:xs. -- cons constructor
mapR f (mapR g (x:xs)) = mapR f (g x : mapR g xs) -- mapR recursive equation
= f (g x) : mapR f (mapR g xs) -- mapR recursive equation
= f (g x) : mapR (f . g) xs -- inductive hypothesis
= (f . g) x : mapR (f . g) xs -- definition of composition
= mapR (f . g) (x:xs) -- mapR recursive equation, backwards
Conclusion: the claim holds for all finite lists in the stated domain. -- structural induction
-}

main :: IO ()
main = do
  print (all (\xs -> mapR (+1) (mapR (*2) xs) == mapR ((+1) . (*2)) xs) ([[],[1],[1,2,3]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR (+1) (mapR (*2) xs) == mapR ((+1) . (*2)) xs) ([[-2],[-1,0],[0,0]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR (+1) (mapR (*2) xs) == mapR ((+1) . (*2)) xs) ([[4,5],[9],[2,2,2]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR (+1) (mapR (*2) xs) == mapR ((+1) . (*2)) xs) ([[1..10],[10,9..1]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR (+1) (mapR (*2) xs) == mapR ((+1) . (*2)) xs) ([[],[7],[100,-100]] :: [[Integer]]))  -- expected: True
