-- Title: Define weekend over an enumeration
{-
QUESTION
Given the declaration below, write weekend :: Day -> Bool. [4]
Return True exactly for Sat and Sun.
data Day = Mon | Tue | Wed | Thu | Fri | Sat | Sun deriving (Show,Eq)
-}

data Day = Mon | Tue | Wed | Thu | Fri | Sat | Sun deriving (Show,Eq)

weekend :: Day -> Bool
weekend = undefined  -- Your answer here

main :: IO ()
main = do
  print (weekend Mon)  -- expected: False
  print (weekend Fri)  -- expected: False
  print (weekend Sat)  -- expected: True
  print (weekend Sun)  -- expected: True
  print (weekend Wed)  -- expected: False
