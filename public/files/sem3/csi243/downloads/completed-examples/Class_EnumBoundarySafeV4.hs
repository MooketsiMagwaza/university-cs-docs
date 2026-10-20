-- Title: Use Enum on Integer without assuming finite bounds
{-
QUESTION
Write neighbours :: Integer -> (Integer,Integer). (4 marks)
Use pred and succ on Integer. Explain why Enum does not imply Bounded:
Integer has Enum but no Bounded instance. Do not convert large Integers
through fromEnum, whose result is only an Int.
-}

-- Read the question: Write an enumeration-method function with an explicit boundary policy.
-- Plan: Use Integer methods directly; this type has no finite endpoints.
neighbours :: Integer -> (Integer,Integer)
-- The boundary policy is part of the function contract.
neighbours x = (pred x, succ x)

main :: IO ()
main = do
  print (neighbours (0))  -- expected: (-1,1)
  print (neighbours (1))  -- expected: (0,2)
  print (neighbours (-1))  -- expected: (-2,0)
  print (neighbours (10))  -- expected: (9,11)
  print (neighbours (-10))  -- expected: (-11,-9)
