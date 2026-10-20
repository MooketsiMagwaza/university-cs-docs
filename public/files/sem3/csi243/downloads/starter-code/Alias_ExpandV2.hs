-- Title: Expand aliases and implement a client function
{-
QUESTION
Given Pair a = (a,a), expand Pair String and write the polymorphic
swapPair :: Pair a -> Pair a to exchange the components.
Explain why an alias adds no new constructor or type safety. (5 marks)
-}

type Pair a = (a,a)

swapPair :: Pair a -> Pair a
swapPair = undefined -- Your answer here

main :: IO ()
main = do
  print (swapPair ("",""))  -- expected: ("","")
  print (swapPair ("red","blue"))  -- expected: ("blue","red")
  print (swapPair ("a","b"))  -- expected: ("b","a")
  print (swapPair ("same","same"))  -- expected: ("same","same")
  print (swapPair ("left",""))  -- expected: ("","left")
