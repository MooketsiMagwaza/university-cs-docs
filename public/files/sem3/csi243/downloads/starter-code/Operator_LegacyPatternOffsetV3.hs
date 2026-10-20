-- Title: Rewrite a legacy plus-three pattern without an extension
{-
QUESTION
A legacy exercise uses this deliberately commented n+k pattern:
-- oldOffset (n+3) = Just n
-- oldOffset _ = Nothing
That syntax needs the optional NPlusKPatterns extension. Do not enable it.
Write offset :: Int -> Maybe Int in ordinary Haskell with a variable
pattern and a guard: return Just (m-3) when m >= 3, else Nothing.
Arithmetic expressions are not general patterns. (6 marks)
Also repair the repeated-variable pattern below using an equality guard:
-- equalPair (x,x) = True
Write equalPair :: Eq a => (a,a) -> Bool, returning False otherwise.
A variable can be bound only once in a single pattern.
-}

offset :: Int -> Maybe Int
offset = undefined -- Your answer here

equalPair :: Eq a => (a,a) -> Bool
equalPair = undefined -- Your answer here

main :: IO ()
main = do
  print (offset (-1))  -- expected: Nothing
  print (offset (0))  -- expected: Nothing
  print (offset (2))  -- expected: Nothing
  print (offset (3))  -- expected: Just 0
  print (offset (8))  -- expected: Just 5
  print (equalPair (0 :: Int,0))  -- expected: True
  print (equalPair (1 :: Int,2))  -- expected: False
  print (equalPair ("",""))  -- expected: True
