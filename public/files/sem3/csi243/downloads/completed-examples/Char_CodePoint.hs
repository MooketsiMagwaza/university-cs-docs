-- Title: Convert characters to their Unicode code points
{-
QUESTION
Write codes :: String -> [Int] using ord. Explain why a String is a
list of Char and why ord is not restricted to ASCII. Use the supplied
numeric escapes as characters, not as digit sequences. (5 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- codes :: String -> [Int]
-- Plan: Map ord over the character list.
import Data.Char (ord)

codes :: String -> [Int]
-- ord applies to each character, including non-ASCII characters.
codes = map ord

main :: IO ()
main = do
  print (codes "")  -- expected: []
  print (codes "Az0")  -- expected: [65,122,48]
  print (codes "\n\t")  -- expected: [10,9]
  print (codes "\233")  -- expected: [233]
  print (codes "\955")  -- expected: [955]
