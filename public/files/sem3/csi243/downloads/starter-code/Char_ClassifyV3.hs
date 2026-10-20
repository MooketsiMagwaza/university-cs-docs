-- Title: Compare character predicates
{-
QUESTION
Write classify :: Char -> (Bool,Bool,Bool) returning, in order,
(== ' '), isSpace, isAlpha applied to its input. Explain the differences between
the predicates on the test characters. A Char contains one character;
there is no empty Char. (5 marks)
-}

import Data.Char (isSpace, isAlpha)

classify :: Char -> (Bool,Bool,Bool)
classify = undefined -- Your answer here

main :: IO ()
main = do
  print (classify ' ')  -- expected: (True,True,False)
  print (classify '\t')  -- expected: (False,True,False)
  print (classify '\n')  -- expected: (False,True,False)
  print (classify 'A')  -- expected: (False,False,True)
  print (classify '0')  -- expected: (False,False,False)
  print (classify '\233')  -- expected: (False,False,True)
