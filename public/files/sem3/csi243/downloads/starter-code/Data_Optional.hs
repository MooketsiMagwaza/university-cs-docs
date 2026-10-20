-- Title: Write safeHead using a Maybe-like type
{-
QUESTION
Given the declaration below, write safeHead :: [a] -> Optional a. [5]
Return Missing for [] and Present the first element otherwise.
data Optional a = Missing | Present a deriving (Show,Eq)
-}

data Optional a = Missing | Present a deriving (Show,Eq)

safeHead :: [a] -> Optional a
safeHead = undefined  -- Your answer here

main :: IO ()
main = do
  print (safeHead ([] :: [Int]))  -- expected: Missing
  print (safeHead [7])  -- expected: Present 7
  print (safeHead [1,2,3])  -- expected: Present 1
  print (safeHead "abc")  -- expected: Present 'a'
  print (safeHead [False,True])  -- expected: Present False
