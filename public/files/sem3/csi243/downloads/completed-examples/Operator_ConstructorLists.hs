-- Title: Use a constructor operator in prefix and infix form
{-
QUESTION
Write consForms :: a -> [a] -> ([a],[a]) returning x : xs and (:) x xs.
Explain why (:) is a constructor operator while an ordinary value operator
such as (<->) cannot be used as a constructor pattern. (4 marks)
Constructor operator names begin with a colon; ordinary value operator
names do not. The built-in list type supplies (:) and [].
-}

-- Read the question: Write a generic list-construction function returning two lists.
-- Plan: Apply the same list constructor using infix and prefix notation.
consForms :: a -> [a] -> ([a],[a])
-- (:) constructs a head and tail; both forms build the same list.
consForms x xs = (x : xs, (:) x xs)

main :: IO ()
main = do
  print (consForms (0 :: Int) [])  -- expected: ([0],[0])
  print (consForms (1 :: Int) [2,3])  -- expected: ([1,2,3],[1,2,3])
  print (consForms 'a' "bc")  -- expected: ("abc","abc")
  print (consForms "" ["x"])  -- expected: (["","x"],["","x"])
  print (consForms True [False])  -- expected: ([True,False],[True,False])
