-- Title: Use a parameterised association-table alias
{-
QUESTION
Given type Assoc k v = [(k,v)], write keys :: Assoc String Int -> [String] to
return every key in order, including duplicates.
Fully expand the signature and explain the order of k and v. (6 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- keys :: Assoc String Int -> [String]
-- Plan: Substitute key and value types in order, then traverse the pairs.
type Assoc k v = [(k,v)]

keys :: Assoc String Int -> [String]
-- Each entry is an ordinary pair; no Assoc constructor is needed.
keys = map fst

-- Assoc k v expands to [(k,v)]: the key is first, the value second.
-- The displayed concrete signature expands by replacing Assoc with this list.

main :: IO ()
main = do
  print (keys [])  -- expected: []
  print (keys [("a",1)])  -- expected: ["a"]
  print (keys [("a",1),("b",2)])  -- expected: ["a","b"]
  print (keys [("a",1),("a",3)])  -- expected: ["a","a"]
  print (keys [("",0)])  -- expected: [""]
