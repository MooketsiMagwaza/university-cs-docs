-- Title: Retain a tuple while extracting its first field
{-
QUESTION
Write tagPair :: (a,b) -> (a,(a,b)) with an as-pattern. [3]
Return the first field together with the unchanged original tuple.
-}

tagPair :: (a,b) -> (a,(a,b))
tagPair = undefined  -- Your answer here

main :: IO ()
main = do
  print (tagPair (0,False))  -- expected: (0,(0,False))
  print (tagPair (1,2))  -- expected: (1,(1,2))
  print (tagPair ('a',True))  -- expected: ('a',('a',True))
  print (tagPair ("",7))  -- expected: ("",("",7))
  print (tagPair ([],True) :: ([Int],([Int],Bool)))  -- expected: ([],([],True))
