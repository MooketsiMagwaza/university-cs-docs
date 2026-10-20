-- Title: Recognise Gregorian leap years
{-
QUESTION
Write leap :: Integer -> Bool with guards for positive Gregorian years. [5]
Divisibility by 400 means leap; otherwise divisibility by 100 means non-leap;
otherwise divisibility by 4 means leap.
-}

-- Read the question: Write leap :: Integer -> Bool.
-- Plan: Test the most specific divisibility condition first.
leap :: Integer -> Bool
leap y
  | mod y 400 == 0 = True  -- Century exception to the exception.
  | mod y 100 == 0 = False
  | otherwise = mod y 4 == 0

main :: IO ()
main = do
  print (leap 1)  -- expected: False
  print (leap 1900)  -- expected: False
  print (leap 2000)  -- expected: True
  print (leap 2024)  -- expected: True
  print (leap 2023)  -- expected: False
