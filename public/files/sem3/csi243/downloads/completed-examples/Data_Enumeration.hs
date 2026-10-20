-- Title: Define next over an enumeration
{-
QUESTION
Given the declaration below, write next :: Traffic -> Traffic. [4]
Cycle Red to Green, Green to Amber, and Amber to Red.
data Traffic = Red | Amber | Green deriving (Show,Eq)
-}

-- Read the question: Write next :: Traffic -> Traffic.
-- Plan: Cover each constructor by pattern matching.
data Traffic = Red | Amber | Green deriving (Show,Eq)

next :: Traffic -> Traffic
next Red = Green
next Green = Amber
next Amber = Red  -- One equation per constructor.

main :: IO ()
main = do
  print (next Red)  -- expected: Green
  print (next Amber)  -- expected: Red
  print (next Green)  -- expected: Amber
  print (next (next Red))  -- expected: Amber
  print (next (next (next Red)))  -- expected: Red
