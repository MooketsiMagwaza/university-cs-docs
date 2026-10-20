-- Title: Contrast decrementing, halving and split recurrences
{-
QUESTION
Write recurrenceCosts :: Int -> (Int, Int, Int) for n >= 0.
Count these pure models: L(0)=0, L(n)=L(n-1)+1;
H(0)=0, H(n)=H(n div 2)+1;
M(0)=M(1)=0, M(n)=M(n div 2)+M(n-n div 2)+n for n>1.
L(n)=n, H(n)=floor(log2 n)+1 for n>0.
For powers of two M(n)=n*log2 n: each level costs n, with log2 n levels.
These model linear, logarithmic and n log n work, respectively.
They are symbolic counts, not measurements of this program's runtime.
-}

-- Read the question: Write a definition; recurrenceCosts has input/result type Int -> (Int, Int, Int).
-- Plan: Solve the stated base cases, then add one local count to each recursive result.
recurrenceCosts :: Int -> (Int, Int, Int)
recurrenceCosts n = (linear n, halves n, split n)
  where
    linear 0 = 0
    linear k = 1 + linear (k-1)
    halves 0 = 0
    halves k = 1 + halves (k `div` 2)
    split k
      | k <= 1 = 0
      | otherwise = split a + split (k-a) + k
      where a = k `div` 2

main :: IO ()
main = do
  print (recurrenceCosts 0)  -- expected: (0,0,0)
  print (recurrenceCosts 1)  -- expected: (1,1,0)
  print (recurrenceCosts 2)  -- expected: (2,2,2)
  print (recurrenceCosts 3)  -- expected: (3,2,5)
  print (recurrenceCosts 4)  -- expected: (4,3,8)
  print (recurrenceCosts 8)  -- expected: (8,4,24)
