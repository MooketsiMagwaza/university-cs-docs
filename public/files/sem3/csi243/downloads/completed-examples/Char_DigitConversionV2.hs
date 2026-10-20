-- Title: Convert decimal and hexadecimal digit characters
{-
QUESTION
Write digitValue :: Char -> Maybe Int. Accept the hexadecimal characters
0-9, a-f and A-F, using digitToInt after checking this domain.
Return Nothing for other characters. (5 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- digitValue :: Char -> Maybe Int
-- Plan: Check all three accepted ranges before conversion.
import Data.Char (digitToInt)

digitValue :: Char -> Maybe Int
-- Both letter cases represent values ten through fifteen.
digitValue c
  | c >= '0' && c <= '9' || c >= 'a' && c <= 'f'
      || c >= 'A' && c <= 'F' = Just (digitToInt c)
  | otherwise = Nothing

main :: IO ()
main = do
  print (digitValue '0')  -- expected: Just 0
  print (digitValue '9')  -- expected: Just 9
  print (digitValue 'a')  -- expected: Just 10
  print (digitValue 'F')  -- expected: Just 15
  print (digitValue 'g')  -- expected: Nothing
  print (digitValue ' ')  -- expected: Nothing
