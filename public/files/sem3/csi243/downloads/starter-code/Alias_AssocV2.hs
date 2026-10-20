-- Title: Use a parameterised association-table alias
{-
QUESTION
Given type Assoc k v = [(k,v)], write values :: Assoc Int String -> [String] to
return every value in order, including duplicates.
Fully expand the signature and explain the order of k and v. (6 marks)
-}

type Assoc k v = [(k,v)]

values :: Assoc Int String -> [String]
values = undefined -- Your answer here

main :: IO ()
main = do
  print (values [])  -- expected: []
  print (values [(1,"a")])  -- expected: ["a"]
  print (values [(1,"a"),(2,"b")])  -- expected: ["a","b"]
  print (values [(1,"a"),(1,"c")])  -- expected: ["a","c"]
  print (values [(0,"")])  -- expected: [""]
