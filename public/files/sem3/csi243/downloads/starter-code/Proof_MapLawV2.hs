-- Title: Prove the map composition law
{-
QUESTION
Claim: mapR f (mapR g xs) = mapR (f . g) xs for all finite total xs and total f,g.
Prove the claim by structural induction using the given definitions. [8]
State the hypothesis for the tail and justify every rewriting step.
-}

mapR :: (a -> b) -> [a] -> [b]
mapR _ [] = []
mapR f (x:xs) = f x : mapR f xs

{- Write your proof here -}

main :: IO ()
main = do
  print (all (\xs -> mapR (+1) (mapR (*2) xs) == mapR ((+1) . (*2)) xs) ([[],[1],[1,2,3]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR (+1) (mapR (*2) xs) == mapR ((+1) . (*2)) xs) ([[-2],[-1,0],[0,0]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR (+1) (mapR (*2) xs) == mapR ((+1) . (*2)) xs) ([[4,5],[9],[2,2,2]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR (+1) (mapR (*2) xs) == mapR ((+1) . (*2)) xs) ([[1..10],[10,9..1]] :: [[Integer]]))  -- expected: True
  print (all (\xs -> mapR (+1) (mapR (*2) xs) == mapR ((+1) . (*2)) xs) ([[],[7],[100,-100]] :: [[Integer]]))  -- expected: True
