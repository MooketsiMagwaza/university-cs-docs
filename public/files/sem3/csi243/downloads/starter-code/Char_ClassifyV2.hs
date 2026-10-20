-- Title: Compare character predicates
{-
QUESTION
Write classify :: Char -> (Bool,Bool,Bool) returning, in order,
isDigit, isAlphaNum, isAscii applied to its input. Explain the differences between
the predicates on the test characters. A Char contains one character;
there is no empty Char. (5 marks)
-}

import Data.Char (isDigit, isAlphaNum, isAscii)

classify :: Char -> (Bool,Bool,Bool)
classify = undefined -- Your answer here

main :: IO ()
main = do
  print (classify 'A')  -- expected: (False,True,True)
  print (classify '9')  -- expected: (True,True,True)
  print (classify ' ')  -- expected: (False,False,True)
  print (classify '\233')  -- expected: (False,True,False)
  print (classify '!')  -- expected: (False,False,True)
  print (classify '0')  -- expected: (True,True,True)
