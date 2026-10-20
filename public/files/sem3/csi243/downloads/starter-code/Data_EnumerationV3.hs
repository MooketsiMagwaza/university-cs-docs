-- Title: Define promote over an enumeration
{-
QUESTION
Given the declaration below, write promote :: Level -> Level. [4]
Promote Low to Medium, Medium to High, and leave High unchanged.
data Level = Low | Medium | High deriving (Show,Eq)
-}

data Level = Low | Medium | High deriving (Show,Eq)

promote :: Level -> Level
promote = undefined  -- Your answer here

main :: IO ()
main = do
  print (promote Low)  -- expected: Medium
  print (promote Medium)  -- expected: High
  print (promote High)  -- expected: High
  print (promote (promote Low))  -- expected: High
  print (promote (promote High))  -- expected: High
