-- Title: Rewrite a legacy plus-four pattern and test its exact boundary
{-
QUESTION
A legacy exercise uses this deliberately commented n+k pattern:
-- oldOffset (n+4) = Just n
-- oldOffset _ = Nothing
That syntax needs the optional NPlusKPatterns extension. Do not enable it.
Write offset :: Int -> Maybe Int in ordinary Haskell with a variable
pattern and a guard: return Just (m-4) when m >= 4, else Nothing.
Arithmetic expressions are not general patterns. (6 marks)
Also repair the repeated-variable pattern below using an equality guard:
-- equalPair (x,x) = True
Write equalPair :: Eq a => (a,a) -> Bool, returning False otherwise.
A variable can be bound only once in a single pattern.
-}

-- Read the question: Rewrite legacy and repeated-variable patterns as portable guarded functions.
-- Plan: Bind distinct variables, then test the required numeric boundary or equality.
offset :: Int -> Maybe Int
-- The guard both checks the boundary and makes subtraction safe here.
offset m
  | m >= 4 = Just (m - 4)
  | otherwise = Nothing

equalPair :: Eq a => (a,a) -> Bool
-- Equality belongs in a guard, not in a repeated pattern variable.
equalPair (x,y)
  | x == y = True
  | otherwise = False

main :: IO ()
main = do
  print (offset (-1))  -- expected: Nothing
  print (offset (0))  -- expected: Nothing
  print (offset (3))  -- expected: Nothing
  print (offset (4))  -- expected: Just 0
  print (offset (9))  -- expected: Just 5
  print (equalPair (0 :: Int,0))  -- expected: True
  print (equalPair (1 :: Int,2))  -- expected: False
  print (equalPair ("",""))  -- expected: True
