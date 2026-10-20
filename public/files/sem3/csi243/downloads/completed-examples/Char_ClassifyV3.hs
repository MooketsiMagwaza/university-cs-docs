-- Title: Compare character predicates
{-
QUESTION
Write classify :: Char -> (Bool,Bool,Bool) returning, in order,
(== ' '), isSpace, isAlpha applied to its input. Explain the differences between
the predicates on the test characters. A Char contains one character;
there is no empty Char. (5 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- classify :: Char -> (Bool,Bool,Bool)
-- Plan: Apply each predicate independently, keeping the specified tuple order.
import Data.Char (isSpace, isAlpha)

classify :: Char -> (Bool,Bool,Bool)
-- Each predicate answers a separate question about one character.
classify c = ((== ' ') c, isSpace c, isAlpha c)

-- isAlpha tests letters, while isAlphaNum also accepts numeric characters.
-- isDigit accepts ASCII decimal digits; isAscii tests the code range 0..127.
-- isSpace includes tab/newline; upper/lower case tests exclude nonletters.

main :: IO ()
main = do
  print (classify ' ')  -- expected: (True,True,False)
  print (classify '\t')  -- expected: (False,True,False)
  print (classify '\n')  -- expected: (False,True,False)
  print (classify 'A')  -- expected: (False,False,True)
  print (classify '0')  -- expected: (False,False,False)
  print (classify '\233')  -- expected: (False,False,True)
