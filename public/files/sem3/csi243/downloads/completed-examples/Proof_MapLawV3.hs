-- Title: Prove mapping preserves list length
{-
QUESTION
Claim: count (mapR f xs) = count xs for all finite total xs and total f.
Prove the claim by structural induction using the given definitions. [8]
State the hypothesis for the tail and justify every rewriting step.
-}

-- Read the question: Prove the universal claim for the stated domain by induction.
-- Plan: Expand mapR at each constructor and use the hypothesis on the tail.
mapR :: (a -> b) -> [a] -> [b]
mapR _ [] = []
mapR f (x:xs) = f x : mapR f xs

count :: [a] -> Integer
count [] = 0
count (_:xs) = 1 + count xs

{-
Claim: count (mapR f xs) = count xs for all finite total xs and total f. -- stated goal
Induct on: xs. -- mapR takes apart the list
Base case: xs = []. -- empty-list constructor
count (mapR f []) = count [] -- mapR base equation
Hypothesis: count (mapR f xs) = count xs. -- smaller tail
Step: xs becomes x:xs. -- cons constructor
count (mapR f (x:xs)) = count (f x : mapR f xs) -- mapR recursive equation
= 1 + count (mapR f xs) -- count recursive equation
= 1 + count xs -- inductive hypothesis
= count (x:xs) -- count recursive equation, backwards
Conclusion: the claim holds for all finite lists in the stated domain. -- structural induction
-}

main :: IO ()
main = do
  print (all (\xs -> count (mapR (\n -> n > 0) xs) == count xs) ([[],[1],[1,2,3]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> count (mapR (\n -> n > 0) xs) == count xs) ([[-2],[-1,0],[0,0]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> count (mapR (\n -> n > 0) xs) == count xs) ([[4,5],[9],[2,2,2]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> count (mapR (\n -> n > 0) xs) == count xs) ([[1..10],[10,9..1]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> count (mapR (\n -> n > 0) xs) == count xs) ([[],[7],[100,-100]] :: [[Integer]]))  -- expected: True
