-- Title: Prove that append preserves product combination
{-
QUESTION
Claim: multiply (append xs ys) = multiply xs * multiply ys for all finite lists of integers.
Prove the claim by structural induction on xs. [8]
Use only the given equations and arithmetic identities and associativity.
-}

append :: [a] -> [a] -> [a]
append [] ys = ys
append (x:xs) ys = x : append xs ys

multiply :: [Integer] -> Integer
multiply [] = 1
multiply (x:xs) = x * multiply xs

{- Write your proof here -}

main :: IO ()
main = do
  print (all (\xs -> all (\ys -> multiply (append xs ys) == multiply xs * multiply ys) [[],[1],[1,2,3]]) [[],[1],[1,2,3]])  -- expected: True
  print (all (\xs -> all (\ys -> multiply (append xs ys) == multiply xs * multiply ys) [[-2],[-1,0],[0,0]]) [[-2],[-1,0],[0,0]])  -- expected: True
  print (all (\xs -> all (\ys -> multiply (append xs ys) == multiply xs * multiply ys) [[4,5],[9],[2,2,2]]) [[4,5],[9],[2,2,2]])  -- expected: True
  print (all (\xs -> all (\ys -> multiply (append xs ys) == multiply xs * multiply ys) [[1..10],[10,9..1]]) [[1..10],[10,9..1]])  -- expected: True
  print (all (\xs -> all (\ys -> multiply (append xs ys) == multiply xs * multiply ys) [[],[7],[100,-100]]) [[],[7],[100,-100]])  -- expected: True
