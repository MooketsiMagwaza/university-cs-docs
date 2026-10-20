-- Title: Write Show by hand for Switch
{-
QUESTION
Given data Switch = On | Off, write a Show instance. [4]
On must display as enabled, Off must display as disabled.
The output contains no quotation marks. Do not derive Show.
-}

-- Read the question: Write .
-- Plan: Give one show equation per constructor.
data Switch = On | Off

instance Show Switch where
  show On = "enabled"  -- Required rendering.
  show Off = "disabled"  -- Required rendering.

main :: IO ()
main = do
  print (On)  -- expected: enabled
  print (Off)  -- expected: disabled
  print ([On,Off])  -- expected: [enabled,disabled]
  print (([] :: [Switch]))  -- expected: []
  print (Just On)  -- expected: Just enabled
