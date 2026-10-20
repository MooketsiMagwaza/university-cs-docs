-- Title: Prove mapping id leaves a list unchanged
{-
QUESTION
Claim: mapR id xs = xs for every finite total list xs.
Prove the claim by structural induction using the given definitions. [8]
State the hypothesis for the tail and justify every rewriting step.
-}

mapR :: (a -> b) -> [a] -> [b]
mapR _ [] = []
mapR f (x:xs) = f x : mapR f xs

{- Write your proof here -}

main :: IO ()
main = do
  print (all (\xs -> mapR id xs == xs) ([[],[1],[1,2,3]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR id xs == xs) ([[-2],[-1,0],[0,0]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR id xs == xs) ([[4,5],[9],[2,2,2]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR id xs == xs) ([[1..10],[10,9..1]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR id xs == xs) ([[],[7],[100,-100]] :: [[Integer]]))  -- expected: True
