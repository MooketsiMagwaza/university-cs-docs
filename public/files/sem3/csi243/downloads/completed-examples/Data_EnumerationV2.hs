-- Title: Define weekend over an enumeration
{-
QUESTION
Given the declaration below, write weekend :: Day -> Bool. [4]
Return True exactly for Sat and Sun.
data Day = Mon | Tue | Wed | Thu | Fri | Sat | Sun deriving (Show,Eq)
-}

-- Read the question: Write weekend :: Day -> Bool.
-- Plan: Cover each constructor by pattern matching.
data Day = Mon | Tue | Wed | Thu | Fri | Sat | Sun deriving (Show,Eq)

weekend :: Day -> Bool
weekend Sat = True
weekend Sun = True
weekend _ = False  -- All weekdays share one result.

main :: IO ()
main = do
  print (weekend Mon)  -- expected: False
  print (weekend Fri)  -- expected: False
  print (weekend Sat)  -- expected: True
  print (weekend Sun)  -- expected: True
  print (weekend Wed)  -- expected: False
