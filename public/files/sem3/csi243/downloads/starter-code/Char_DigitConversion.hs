-- Title: Convert a decimal digit only after validating it
{-
QUESTION
Write digitValue :: Char -> Maybe Int. Accept only characters '0' to
'9', returning their value with digitToInt; otherwise return Nothing.
Do not call digitToInt on a failing input. (5 marks)
-}

import Data.Char (isDigit, digitToInt)

digitValue :: Char -> Maybe Int
digitValue = undefined -- Your answer here

main :: IO ()
main = do
  print (digitValue '0')  -- expected: Just 0
  print (digitValue '9')  -- expected: Just 9
  print (digitValue '5')  -- expected: Just 5
  print (digitValue 'a')  -- expected: Nothing
  print (digitValue ' ')  -- expected: Nothing
  print (digitValue '\233')  -- expected: Nothing
