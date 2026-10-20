-- Title: Compare naive Fibonacci calls with accumulator steps
{-
QUESTION
Write fibCosts :: Int -> ((Integer, Int), (Integer, Int)) for n >= 0.
The first pair is Fibonacci F(n) and the number of naive invocations,
including base calls. The second is F(n) and accumulator transitions
starting from (0,1). Count arithmetic as unit cost and assume no
memoisation. Calls satisfy C(0)=C(1)=1 and
C(n)=1+C(n-1)+C(n-2), exponential in n; transitions satisfy A(n)=n.
Two branches alone do not imply exponential cost: their sizes matter.
-}

fibCosts :: Int -> ((Integer, Int), (Integer, Int))
fibCosts = undefined -- Your answer here

main :: IO ()
main = do
  print (fibCosts 0)  -- expected: ((0,1),(0,0))
  print (fibCosts 1)  -- expected: ((1,1),(1,1))
  print (fibCosts 2)  -- expected: ((1,3),(1,2))
  print (fibCosts 3)  -- expected: ((2,5),(2,3))
  print (fibCosts 5)  -- expected: ((5,15),(5,5))
