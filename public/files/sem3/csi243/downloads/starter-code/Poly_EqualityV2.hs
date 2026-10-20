-- Title: Look up a key with an Eq constraint
{-
QUESTION
Write findValue :: Eq k => k -> [(k,v)] -> Maybe v recursively. [5]
Return the first matching value or Nothing if the key is absent.
-}

findValue :: Eq k => k -> [(k,v)] -> Maybe v
findValue = undefined  -- Your answer here

main :: IO ()
main = do
  print (findValue (1 :: Int) ([] :: [(Int,String)]))  -- expected: Nothing
  print (findValue 1 [(1,"a")])  -- expected: Just "a"
  print (findValue 2 [(1,"a"),(2,"b")])  -- expected: Just "b"
  print (findValue 3 [(1,"a")])  -- expected: Nothing
  print (findValue 'x' [('x',True),('x',False)])  -- expected: Just True
