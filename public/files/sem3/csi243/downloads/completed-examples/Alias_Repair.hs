-- Title: Repair a type declaration and use its representation
{-
QUESTION
The proposed declaration type Pair = (a,a) has an undeclared parameter.
Use the supplied corrected Pair alias; write repair to add a Pair Int.
Explain why Pair without its argument cannot be used as a complete type.
Use the function signature repair :: Pair Int -> Int. (6 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- repair :: Pair Int -> Int
-- Plan: Distinguish an alias expansion from a data or newtype constructor.
type Pair a = (a,a)

repair :: Pair Int -> Int
-- Use the alias directly, or explicitly match/build the real constructor.
repair (x,y) = x+y

-- The parameter must be bound: type Pair a = (a,a).
-- Pair Int expands to (Int,Int); an unsaturated Pair is not a complete type.

main :: IO ()
main = do
  print (repair (0,0))  -- expected: 0
  print (repair (1,2))  -- expected: 3
  print (repair (-2,2))  -- expected: 0
  print (repair (5,5))  -- expected: 10
  print (repair (3,4))  -- expected: 7
