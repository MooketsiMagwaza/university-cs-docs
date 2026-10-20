-- Title: Convert a decimal digit only after validating it
{-
QUESTION
Write digitValue :: Char -> Maybe Int. Accept only characters '0' to
'9', returning their value with digitToInt; otherwise return Nothing.
Do not call digitToInt on a failing input. (5 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- digitValue :: Char -> Maybe Int
-- Plan: Guard the partial library conversion.
import Data.Char (isDigit, digitToInt)

digitValue :: Char -> Maybe Int
-- isDigit is the ASCII decimal-digit test.
digitValue c
  | isDigit c = Just (digitToInt c)
  | otherwise = Nothing

main :: IO ()
main = do
  print (digitValue '0')  -- expected: Just 0
  print (digitValue '9')  -- expected: Just 9
  print (digitValue '5')  -- expected: Just 5
  print (digitValue 'a')  -- expected: Nothing
  print (digitValue ' ')  -- expected: Nothing
  print (digitValue '\233')  -- expected: Nothing
