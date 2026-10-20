-- Title: Find the number of days in February
{-
QUESTION
Write febDays :: Integer -> Int with guards for positive Gregorian years. [5]
Return 29 for a leap year and 28 otherwise, applying the 400/100/4 rule.
-}

febDays :: Integer -> Int
febDays = undefined  -- Your answer here

main :: IO ()
main = do
  print (febDays 1)  -- expected: 28
  print (febDays 1900)  -- expected: 28
  print (febDays 2000)  -- expected: 29
  print (febDays 2024)  -- expected: 29
  print (febDays 2023)  -- expected: 28
