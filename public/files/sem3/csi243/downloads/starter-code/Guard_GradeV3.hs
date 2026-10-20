-- Title: Classify marks using ordered guards
{-
QUESTION
Write grade :: Int -> String using guards. [5]
Outside 0..100 return "Invalid"; from 75 return "High";
from 40 return "Satisfactory"; otherwise return "Low".
-}

grade :: Int -> String
grade = undefined  -- Your answer here

main :: IO ()
main = do
  print (grade (-1))  -- expected: "Invalid"
  print (grade (0))  -- expected: "Low"
  print (grade (39))  -- expected: "Low"
  print (grade (40))  -- expected: "Satisfactory"
  print (grade (75))  -- expected: "High"
  print (grade (101))  -- expected: "Invalid"
