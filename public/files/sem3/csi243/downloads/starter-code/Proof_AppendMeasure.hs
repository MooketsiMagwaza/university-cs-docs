-- Title: Prove that append preserves length combination
{-
QUESTION
Claim: count (append xs ys) = count xs + count ys for all finite lists of integers.
Prove the claim by structural induction on xs. [8]
Use only the given equations and arithmetic identities and associativity.
-}

append :: [a] -> [a] -> [a]
append [] ys = ys
append (x:xs) ys = x : append xs ys

count :: [a] -> Integer
count [] = 0
count (x:xs) = 1 + count xs

{- Write your proof here -}

main :: IO ()
main = do
  print (all (\xs -> all (\ys -> count (append xs ys) == count xs + count ys) [[],[1],[1,2,3]]) [[],[1],[1,2,3]])  -- expected: True
  print (all (\xs -> all (\ys -> count (append xs ys) == count xs + count ys) [[-2],[-1,0],[0,0]]) [[-2],[-1,0],[0,0]])  -- expected: True
  print (all (\xs -> all (\ys -> count (append xs ys) == count xs + count ys) [[4,5],[9],[2,2,2]]) [[4,5],[9],[2,2,2]])  -- expected: True
  print (all (\xs -> all (\ys -> count (append xs ys) == count xs + count ys) [[1..10],[10,9..1]]) [[1..10],[10,9..1]])  -- expected: True
  print (all (\xs -> all (\ys -> count (append xs ys) == count xs + count ys) [[],[7],[100,-100]]) [[],[7],[100,-100]])  -- expected: True
