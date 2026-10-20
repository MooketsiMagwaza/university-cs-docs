-- Title: Expand aliases and implement a client function
{-
QUESTION
Given Assoc k v = [(k,v)] and Index v = Assoc String v, fully expand
Index Bool. Write values :: Index v -> [v] retaining entry order.
Explain why an alias adds no new constructor or type safety. (5 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- values :: Index v -> [v]
-- Plan: Expand aliases before choosing tuple projections or list traversal.
type Assoc k v = [(k,v)]
type Index v = Assoc String v

values :: Index v -> [v]
-- Aliases expand to the ordinary tuple or list representation.
values = map snd

-- Index Bool = Assoc String Bool = [(String,Bool)].
-- values :: [(String,v)] -> [v]; parameter order fixes the key type.

main :: IO ()
main = do
  print (values ([] :: Index Bool))  -- expected: []
  print (values [("x",True)])  -- expected: [True]
  print (values [("x",False),("y",True)])  -- expected: [False,True]
  print (values [("",False)])  -- expected: [False]
  print (values [("x",True),("x",False)])  -- expected: [True,False]
