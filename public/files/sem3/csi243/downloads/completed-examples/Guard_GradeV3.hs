-- Title: Classify marks using ordered guards
{-
QUESTION
Write grade :: Int -> String using guards. [5]
Outside 0..100 return "Invalid"; from 75 return "High";
from 40 return "Satisfactory"; otherwise return "Low".
-}

-- Read the question: Write grade :: Int -> String.
-- Plan: Check validity, then thresholds from highest to lowest.
grade :: Int -> String
grade n
  | n < 0 || n > 100 = "Invalid"  -- Validate before classifying.
  | n >= 75 = "High"
  | n >= 40 = "Satisfactory"
  | otherwise = "Low"

main :: IO ()
main = do
  print (grade (-1))  -- expected: "Invalid"
  print (grade (0))  -- expected: "Low"
  print (grade (39))  -- expected: "Low"
  print (grade (40))  -- expected: "Satisfactory"
  print (grade (75))  -- expected: "High"
  print (grade (101))  -- expected: "Invalid"
