-- Title: Prove that append preserves product combination
{-
QUESTION
Claim: multiply (append xs ys) = multiply xs * multiply ys for all finite lists of integers.
Prove the claim by structural induction on xs. [8]
Use only the given equations and arithmetic identities and associativity.
-}

-- Read the question: Prove the universal claim for the stated domain by induction.
-- Plan: Induct on the first list because append inspects that argument.
append :: [a] -> [a] -> [a]
append [] ys = ys
append (x:xs) ys = x : append xs ys

multiply :: [Integer] -> Integer
multiply [] = 1
multiply (x:xs) = x * multiply xs

{-
Claim: multiply (append xs ys) = multiply xs * multiply ys for all finite lists of integers. -- stated goal for finite total lists
Induct on: xs, keeping every ys arbitrary. -- append recurses on its first list
Base case: xs = []. -- empty-list constructor
multiply (append [] ys) = multiply ys -- append base equation
= 1 * multiply ys -- multiplicative identity, backwards
= multiply [] * multiply ys -- multiply base equation, backwards
Hypothesis: multiply (append xs ys) = multiply xs * multiply ys for every ys. -- smaller tail
Step: xs becomes x:xs. -- cons constructor
multiply (append (x:xs) ys) = multiply (x : append xs ys) -- append recursive equation
= x * multiply (append xs ys) -- multiply recursive equation
= x * (multiply xs * multiply ys) -- inductive hypothesis
= (x * multiply xs) * multiply ys -- associativity of *
= multiply (x:xs) * multiply ys -- multiply recursive equation, backwards
Conclusion: the claim holds for all finite xs and ys. -- structural induction
-}

main :: IO ()
main = do
  print (all (\xs -> all (\ys -> multiply (append xs ys) == multiply xs * multiply ys) [[],[1],[1,2,3]]) [[],[1],[1,2,3]])  -- expected: True
  print (all (\xs -> all (\ys -> multiply (append xs ys) == multiply xs * multiply ys) [[-2],[-1,0],[0,0]]) [[-2],[-1,0],[0,0]])  -- expected: True
  print (all (\xs -> all (\ys -> multiply (append xs ys) == multiply xs * multiply ys) [[4,5],[9],[2,2,2]]) [[4,5],[9],[2,2,2]])  -- expected: True
  print (all (\xs -> all (\ys -> multiply (append xs ys) == multiply xs * multiply ys) [[1..10],[10,9..1]]) [[1..10],[10,9..1]])  -- expected: True
  print (all (\xs -> all (\ys -> multiply (append xs ys) == multiply xs * multiply ys) [[],[7],[100,-100]]) [[],[7],[100,-100]])  -- expected: True
