-- Title: Prove that append preserves sum combination
{-
QUESTION
Claim: total (append xs ys) = total xs + total ys for all finite lists of integers.
Prove the claim by structural induction on xs. [8]
Use only the given equations and arithmetic identities and associativity.
-}

-- Read the question: Prove the universal claim for the stated domain by induction.
-- Plan: Induct on the first list because append inspects that argument.
append :: [a] -> [a] -> [a]
append [] ys = ys
append (x:xs) ys = x : append xs ys

total :: [Integer] -> Integer
total [] = 0
total (x:xs) = x + total xs

{-
Claim: total (append xs ys) = total xs + total ys for all finite lists of integers. -- stated goal for finite total lists
Induct on: xs, keeping every ys arbitrary. -- append recurses on its first list
Base case: xs = []. -- empty-list constructor
total (append [] ys) = total ys -- append base equation
= 0 + total ys -- additive identity, backwards
= total [] + total ys -- total base equation, backwards
Hypothesis: total (append xs ys) = total xs + total ys for every ys. -- smaller tail
Step: xs becomes x:xs. -- cons constructor
total (append (x:xs) ys) = total (x : append xs ys) -- append recursive equation
= x + total (append xs ys) -- total recursive equation
= x + (total xs + total ys) -- inductive hypothesis
= (x + total xs) + total ys -- associativity of +
= total (x:xs) + total ys -- total recursive equation, backwards
Conclusion: the claim holds for all finite xs and ys. -- structural induction
-}

main :: IO ()
main = do
  print (all (\xs -> all (\ys -> total (append xs ys) == total xs + total ys) [[],[1],[1,2,3]]) [[],[1],[1,2,3]])  -- expected: True
  print (all (\xs -> all (\ys -> total (append xs ys) == total xs + total ys) [[-2],[-1,0],[0,0]]) [[-2],[-1,0],[0,0]])  -- expected: True
  print (all (\xs -> all (\ys -> total (append xs ys) == total xs + total ys) [[4,5],[9],[2,2,2]]) [[4,5],[9],[2,2,2]])  -- expected: True
  print (all (\xs -> all (\ys -> total (append xs ys) == total xs + total ys) [[1..10],[10,9..1]]) [[1..10],[10,9..1]])  -- expected: True
  print (all (\xs -> all (\ys -> total (append xs ys) == total xs + total ys) [[],[7],[100,-100]]) [[],[7],[100,-100]])  -- expected: True
