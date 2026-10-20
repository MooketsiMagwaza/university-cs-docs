-- Title: Expand aliases and implement a client function
{-
QUESTION
Given Pair a = (a,a), expand Pair String and write the polymorphic
swapPair :: Pair a -> Pair a to exchange the components.
Explain why an alias adds no new constructor or type safety. (5 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- swapPair :: Pair a -> Pair a to exchange the components.
-- swapPair :: Pair a -> Pair a
-- Plan: Expand aliases before choosing tuple projections or list traversal.
type Pair a = (a,a)

swapPair :: Pair a -> Pair a
-- Aliases expand to the ordinary tuple or list representation.
swapPair (x,y) = (y,x)

-- Pair String = (String,String) = ([Char],[Char]).
-- swapPair :: (a,a) -> (a,a); Pair introduces no constructor.

main :: IO ()
main = do
  print (swapPair ("",""))  -- expected: ("","")
  print (swapPair ("red","blue"))  -- expected: ("blue","red")
  print (swapPair ("a","b"))  -- expected: ("b","a")
  print (swapPair ("same","same"))  -- expected: ("same","same")
  print (swapPair ("left",""))  -- expected: ("","left")
