-- Title: Repair a type declaration and use its representation
{-
QUESTION
Given the supplied alias and wrapper, write repair to wrap Credits.
Explain why an Int can be used as Credits, while the expression
repair (CreditBox 3) is ill-typed. Do not execute that invalid expression.
Use the function signature repair :: Credits -> CreditBox. (6 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- repair :: Credits -> CreditBox
-- Plan: Distinguish an alias expansion from a data or newtype constructor.
type Credits = Int
newtype CreditBox = CreditBox Int deriving (Show)

repair :: Credits -> CreditBox
-- Use the alias directly, or explicitly match/build the real constructor.
repair n = CreditBox n

-- Credits and Int are interchangeable, while CreditBox is a distinct type.
-- repair expects Int after expansion, so repair (CreditBox 3) has wrong input.

main :: IO ()
main = do
  print (repair 0)  -- expected: CreditBox 0
  print (repair 1)  -- expected: CreditBox 1
  print (repair 3)  -- expected: CreditBox 3
  print (repair 10)  -- expected: CreditBox 10
  print (repair 100)  -- expected: CreditBox 100
