-- Title: Classify marks using ordered guards
{-
QUESTION
Write grade :: Int -> String using guards. [5]
Outside 0..100 return "Invalid"; from 70 return "Distinction";
from 50 return "Pass"; otherwise return "Fail".
-}

grade :: Int -> String
grade = undefined  -- Your answer here

main :: IO ()
main = do
  print (grade (-1))  -- expected: "Invalid"
  print (grade (0))  -- expected: "Fail"
  print (grade (49))  -- expected: "Fail"
  print (grade (50))  -- expected: "Pass"
  print (grade (70))  -- expected: "Distinction"
  print (grade (101))  -- expected: "Invalid"
