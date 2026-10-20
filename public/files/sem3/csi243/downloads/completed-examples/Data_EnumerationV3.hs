-- Title: Define promote over an enumeration
{-
QUESTION
Given the declaration below, write promote :: Level -> Level. [4]
Promote Low to Medium, Medium to High, and leave High unchanged.
data Level = Low | Medium | High deriving (Show,Eq)
-}

-- Read the question: Write promote :: Level -> Level.
-- Plan: Cover each constructor by pattern matching.
data Level = Low | Medium | High deriving (Show,Eq)

promote :: Level -> Level
promote Low = Medium
promote Medium = High
promote High = High  -- Saturate at the highest level.

main :: IO ()
main = do
  print (promote Low)  -- expected: Medium
  print (promote Medium)  -- expected: High
  print (promote High)  -- expected: High
  print (promote (promote Low))  -- expected: High
  print (promote (promote High))  -- expected: High
