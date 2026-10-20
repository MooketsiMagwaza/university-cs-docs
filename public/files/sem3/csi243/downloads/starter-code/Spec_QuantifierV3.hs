-- Title: Quantify over words including an empty word
{-
QUESTION
Write wordQuantifiers :: [String] -> (Bool, Bool, Bool). Return whether
every word has length at least three, some word is empty, and no word
is empty. A list containing "" is different from an empty list.
Use all and any; "none empty" is not (any null words).
Domain: finite lists of finite strings. At [] the universal and "none"
are True, while "some" is False.
-}

wordQuantifiers :: [String] -> (Bool, Bool, Bool)
wordQuantifiers = undefined -- Your answer here

main :: IO ()
main = do
  print (wordQuantifiers [])  -- expected: (True,False,True)
  print (wordQuantifiers [""])  -- expected: (False,True,False)
  print (wordQuantifiers ["cat"])  -- expected: (True,False,True)
  print (wordQuantifiers ["a","dogs"])  -- expected: (False,False,True)
  print (wordQuantifiers ["cat",""])  -- expected: (False,True,False)
