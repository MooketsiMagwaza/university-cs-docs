-- Title: Use a parameterised association-table alias
{-
QUESTION
Given type Assoc k v = [(k,v)], write lookupAll :: String -> Assoc String Int -> [Int] to
return all values for a given key in entry order.
Fully expand the signature and explain the order of k and v. (6 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- lookupAll :: String -> Assoc String Int -> [Int]
-- Plan: Substitute key and value types in order, then traverse the pairs.
type Assoc k v = [(k,v)]

lookupAll :: String -> Assoc String Int -> [Int]
-- Each entry is an ordinary pair; no Assoc constructor is needed.
lookupAll key table = [v | (k,v) <- table, k == key]

-- Assoc k v expands to [(k,v)]: the key is first, the value second.
-- The displayed concrete signature expands by replacing Assoc with this list.

main :: IO ()
main = do
  print (lookupAll "a" [])  -- expected: []
  print (lookupAll "a" [("a",1)])  -- expected: [1]
  print (lookupAll "z" [("a",1)])  -- expected: []
  print (lookupAll "a" [("a",1),("b",2),("a",3)])  -- expected: [1,3]
  print (lookupAll "" [("",0)])  -- expected: [0]
