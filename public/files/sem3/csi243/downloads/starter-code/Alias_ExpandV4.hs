-- Title: Expand aliases and implement a client function
{-
QUESTION
Given Assoc k v = [(k,v)] and Index v = Assoc String v, fully expand
Index Bool. Write values :: Index v -> [v] retaining entry order.
Explain why an alias adds no new constructor or type safety. (5 marks)
-}

type Assoc k v = [(k,v)]
type Index v = Assoc String v

values :: Index v -> [v]
values = undefined -- Your answer here

main :: IO ()
main = do
  print (values ([] :: Index Bool))  -- expected: []
  print (values [("x",True)])  -- expected: [True]
  print (values [("x",False),("y",True)])  -- expected: [False,True]
  print (values [("",False)])  -- expected: [False]
  print (values [("x",True),("x",False)])  -- expected: [True,False]
