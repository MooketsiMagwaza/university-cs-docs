-- Title: Write mapOptional using a Maybe-like type
{-
QUESTION
Given the declaration below, write mapOptional :: (a -> b) -> Optional a -> Optional b. [5]
Leave Missing unchanged; apply the supplied function inside Present.
data Optional a = Missing | Present a deriving (Show,Eq)
-}

-- Read the question: Write mapOptional :: (a -> b) -> Optional a -> Optional b.
-- Plan: Handle the missing and successful cases explicitly.
data Optional a = Missing | Present a deriving (Show,Eq)

mapOptional :: (a -> b) -> Optional a -> Optional b
mapOptional _ Missing = Missing
mapOptional f (Present x) = Present (f x)  -- Transform only success.

main :: IO ()
main = do
  print (mapOptional (+1) (Missing :: Optional Int))  -- expected: Missing
  print (mapOptional (+1) (Present 0))  -- expected: Present 1
  print (mapOptional (*2) (Present 3))  -- expected: Present 6
  print (mapOptional length (Present "cat"))  -- expected: Present 3
  print (mapOptional not (Present False))  -- expected: Present True
