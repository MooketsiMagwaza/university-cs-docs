-- Title: Use a parameterised association-table alias
{-
QUESTION
Given type Assoc k v = [(k,v)], write values :: Assoc Int String -> [String] to
return every value in order, including duplicates.
Fully expand the signature and explain the order of k and v. (6 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- values :: Assoc Int String -> [String]
-- Plan: Substitute key and value types in order, then traverse the pairs.
type Assoc k v = [(k,v)]

values :: Assoc Int String -> [String]
-- Each entry is an ordinary pair; no Assoc constructor is needed.
values = map snd

-- Assoc k v expands to [(k,v)]: the key is first, the value second.
-- The displayed concrete signature expands by replacing Assoc with this list.

main :: IO ()
main = do
  print (values [])  -- expected: []
  print (values [(1,"a")])  -- expected: ["a"]
  print (values [(1,"a"),(2,"b")])  -- expected: ["a","b"]
  print (values [(1,"a"),(1,"c")])  -- expected: ["a","c"]
  print (values [(0,"")])  -- expected: [""]
