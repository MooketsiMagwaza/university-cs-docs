-- Title: Compare character predicates
{-
QUESTION
Write classify :: Char -> (Bool,Bool,Bool) returning, in order,
isUpper, isLower, isAlpha applied to its input. Explain the differences between
the predicates on the test characters. A Char contains one character;
there is no empty Char. (5 marks)
-}

import Data.Char (isUpper, isLower, isAlpha)

classify :: Char -> (Bool,Bool,Bool)
classify = undefined -- Your answer here

main :: IO ()
main = do
  print (classify 'A')  -- expected: (True,False,True)
  print (classify 'z')  -- expected: (False,True,True)
  print (classify '0')  -- expected: (False,False,False)
  print (classify ' ')  -- expected: (False,False,False)
  print (classify '\233')  -- expected: (False,True,True)
  print (classify '!')  -- expected: (False,False,False)
