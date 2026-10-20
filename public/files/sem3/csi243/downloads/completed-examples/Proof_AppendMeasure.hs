-- Title: Prove that append preserves length combination
{-
QUESTION
Claim: count (append xs ys) = count xs + count ys for all finite lists of integers.
Prove the claim by structural induction on xs. [8]
Use only the given equations and arithmetic identities and associativity.
-}

-- Read the question: Prove the universal claim for the stated domain by induction.
-- Plan: Induct on the first list because append inspects that argument.
append :: [a] -> [a] -> [a]
append [] ys = ys
append (x:xs) ys = x : append xs ys

count :: [a] -> Integer
count [] = 0
count (x:xs) = 1 + count xs

{-
Claim: count (append xs ys) = count xs + count ys for all finite lists of integers. -- stated goal for finite total lists
Induct on: xs, keeping every ys arbitrary. -- append recurses on its first list
Base case: xs = []. -- empty-list constructor
count (append [] ys) = count ys -- append base equation
= 0 + count ys -- additive identity, backwards
= count [] + count ys -- count base equation, backwards
Hypothesis: count (append xs ys) = count xs + count ys for every ys. -- smaller tail
Step: xs becomes x:xs. -- cons constructor
count (append (x:xs) ys) = count (x : append xs ys) -- append recursive equation
= 1 + count (append xs ys) -- count recursive equation
= 1 + (count xs + count ys) -- inductive hypothesis
= (1 + count xs) + count ys -- associativity of +
= count (x:xs) + count ys -- count recursive equation, backwards
Conclusion: the claim holds for all finite xs and ys. -- structural induction
-}

main :: IO ()
main = do
  print (all (\xs -> all (\ys -> count (append xs ys) == count xs + count ys) [[],[1],[1,2,3]]) [[],[1],[1,2,3]])  -- expected: True
  print (all (\xs -> all (\ys -> count (append xs ys) == count xs + count ys) [[-2],[-1,0],[0,0]]) [[-2],[-1,0],[0,0]])  -- expected: True
  print (all (\xs -> all (\ys -> count (append xs ys) == count xs + count ys) [[4,5],[9],[2,2,2]]) [[4,5],[9],[2,2,2]])  -- expected: True
  print (all (\xs -> all (\ys -> count (append xs ys) == count xs + count ys) [[1..10],[10,9..1]]) [[1..10],[10,9..1]])  -- expected: True
  print (all (\xs -> all (\ys -> count (append xs ys) == count xs + count ys) [[],[7],[100,-100]]) [[],[7],[100,-100]])  -- expected: True
