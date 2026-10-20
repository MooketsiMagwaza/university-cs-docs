-- Title: Recognise Gregorian leap years
{-
QUESTION
Write leap :: Integer -> Bool with guards for positive Gregorian years. [5]
Divisibility by 400 means leap; otherwise divisibility by 100 means non-leap;
otherwise divisibility by 4 means leap.
-}

leap :: Integer -> Bool
leap = undefined  -- Your answer here

main :: IO ()
main = do
  print (leap 1)  -- expected: False
  print (leap 1900)  -- expected: False
  print (leap 2000)  -- expected: True
  print (leap 2024)  -- expected: True
  print (leap 2023)  -- expected: False
