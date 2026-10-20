-- Title: Use a parameterised association-table alias
{-
QUESTION
Given type Assoc k v = [(k,v)], write swapEntries :: Assoc String Int -> Assoc Int String to
exchange each key and value; retain the entry order.
Fully expand the signature and explain the order of k and v. (6 marks)
-}

type Assoc k v = [(k,v)]

swapEntries :: Assoc String Int -> Assoc Int String
swapEntries = undefined -- Your answer here

main :: IO ()
main = do
  print (swapEntries [])  -- expected: []
  print (swapEntries [("a",1)])  -- expected: [(1,"a")]
  print (swapEntries [("a",1),("b",2)])  -- expected: [(1,"a"),(2,"b")]
  print (swapEntries [("a",1),("a",3)])  -- expected: [(1,"a"),(3,"a")]
  print (swapEntries [("",0)])  -- expected: [(0,"")]
