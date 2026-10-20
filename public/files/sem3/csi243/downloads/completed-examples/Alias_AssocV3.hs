-- Title: Use a parameterised association-table alias
{-
QUESTION
Given type Assoc k v = [(k,v)], write swapEntries :: Assoc String Int -> Assoc Int String to
exchange each key and value; retain the entry order.
Fully expand the signature and explain the order of k and v. (6 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- swapEntries :: Assoc String Int -> Assoc Int String
-- Plan: Substitute key and value types in order, then traverse the pairs.
type Assoc k v = [(k,v)]

swapEntries :: Assoc String Int -> Assoc Int String
-- Each entry is an ordinary pair; no Assoc constructor is needed.
swapEntries = map (\(k,v) -> (v,k))

-- Assoc k v expands to [(k,v)]: the key is first, the value second.
-- The displayed concrete signature expands by replacing Assoc with this list.

main :: IO ()
main = do
  print (swapEntries [])  -- expected: []
  print (swapEntries [("a",1)])  -- expected: [(1,"a")]
  print (swapEntries [("a",1),("b",2)])  -- expected: [(1,"a"),(2,"b")]
  print (swapEntries [("a",1),("a",3)])  -- expected: [(1,"a"),(3,"a")]
  print (swapEntries [("",0)])  -- expected: [(0,"")]
