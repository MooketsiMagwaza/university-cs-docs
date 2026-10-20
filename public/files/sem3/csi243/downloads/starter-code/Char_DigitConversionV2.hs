-- Title: Convert decimal and hexadecimal digit characters
{-
QUESTION
Write digitValue :: Char -> Maybe Int. Accept the hexadecimal characters
0-9, a-f and A-F, using digitToInt after checking this domain.
Return Nothing for other characters. (5 marks)
-}

import Data.Char (digitToInt)

digitValue :: Char -> Maybe Int
digitValue = undefined -- Your answer here

main :: IO ()
main = do
  print (digitValue '0')  -- expected: Just 0
  print (digitValue '9')  -- expected: Just 9
  print (digitValue 'a')  -- expected: Just 10
  print (digitValue 'F')  -- expected: Just 15
  print (digitValue 'g')  -- expected: Nothing
  print (digitValue ' ')  -- expected: Nothing
