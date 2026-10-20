-- Title: Check chr bounds before testing ASCII membership
{-
QUESTION
Write asciiAt :: Int -> Maybe Bool. Return Nothing for a code outside
0 through 1114111. Otherwise use chr and isAscii to return Just True or
Just False. This checks the Char domain, not Unicode scalar-value rules.
Explain why the input action getChar cannot replace chr. (6 marks)
-}

import Data.Char (chr, isAscii)

asciiAt :: Int -> Maybe Bool
asciiAt = undefined -- Your answer here

main :: IO ()
main = do
  print (asciiAt (-1))  -- expected: Nothing
  print (asciiAt 0)  -- expected: Just True
  print (asciiAt 127)  -- expected: Just True
  print (asciiAt 128)  -- expected: Just False
  print (asciiAt 1114111)  -- expected: Just False
  print (asciiAt 1114112)  -- expected: Nothing
