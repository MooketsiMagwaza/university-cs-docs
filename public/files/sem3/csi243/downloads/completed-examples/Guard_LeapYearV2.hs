-- Title: Find the number of days in February
{-
QUESTION
Write febDays :: Integer -> Int with guards for positive Gregorian years. [5]
Return 29 for a leap year and 28 otherwise, applying the 400/100/4 rule.
-}

-- Read the question: Write febDays :: Integer -> Int.
-- Plan: Return the day count from each calendar case.
febDays :: Integer -> Int
febDays y
  | mod y 400 == 0 = 29
  | mod y 100 == 0 = 28  -- Ordinary centuries are not leap years.
  | mod y 4 == 0 = 29
  | otherwise = 28

main :: IO ()
main = do
  print (febDays 1)  -- expected: 28
  print (febDays 1900)  -- expected: 28
  print (febDays 2000)  -- expected: 29
  print (febDays 2024)  -- expected: 29
  print (febDays 2023)  -- expected: 28
