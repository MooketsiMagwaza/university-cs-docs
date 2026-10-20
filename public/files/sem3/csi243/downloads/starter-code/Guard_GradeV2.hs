-- Title: Classify marks using ordered guards
{-
QUESTION
Write grade :: Int -> String using guards. [5]
Outside 0..100 return "Invalid"; from 80 return "Gold";
from 60 return "Silver"; otherwise return "Bronze".
-}

grade :: Int -> String
grade = undefined  -- Your answer here

main :: IO ()
main = do
  print (grade (-1))  -- expected: "Invalid"
  print (grade (0))  -- expected: "Bronze"
  print (grade (59))  -- expected: "Bronze"
  print (grade (60))  -- expected: "Silver"
  print (grade (80))  -- expected: "Gold"
  print (grade (101))  -- expected: "Invalid"
