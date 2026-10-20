-- Title: Define next over an enumeration
{-
QUESTION
Given the declaration below, write next :: Traffic -> Traffic. [4]
Cycle Red to Green, Green to Amber, and Amber to Red.
data Traffic = Red | Amber | Green deriving (Show,Eq)
-}

data Traffic = Red | Amber | Green deriving (Show,Eq)

next :: Traffic -> Traffic
next = undefined  -- Your answer here

main :: IO ()
main = do
  print (next Red)  -- expected: Green
  print (next Amber)  -- expected: Red
  print (next Green)  -- expected: Amber
  print (next (next Red))  -- expected: Amber
  print (next (next (next Red)))  -- expected: Red
