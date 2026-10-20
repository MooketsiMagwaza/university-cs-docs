-- Title: Validate opaque marks from zero to 20
{-
QUESTION
Implement MarkCore with opaque newtype Mark = Mark Int, exporting Mark,
makeMark, value and passed. makeMark accepts exactly 0 through 20;
value extracts the stored mark; passed means at least 10.
Client uses import qualified MarkCore as M. classify validates an Int and
returns Nothing if invalid, or Just its pass status. acceptedValue similarly
returns the valid raw value. Tests.checks covers -1 and the maximum mark.
Explain why M.Mark 21 cannot construct a mark, why unqualified value
is out of scope, and why MarkCore.value is unavailable with this alias.
Do not export the constructor or silently clamp invalid input.
Implement the signatures in MarkCore.hs, Client.hs, Tests.hs; keep the stated exports.
Main.hs is the entry file. From the parent directory of this bundle:
  runghc -iModule_ValidatedMarkV2 Module_ValidatedMarkV2/Main.hs
  ghci -iModule_ValidatedMarkV2 Module_ValidatedMarkV2/Main.hs
  ghc -iModule_ValidatedMarkV2 Module_ValidatedMarkV2/Main.hs -o Module_ValidatedMarkV2/demo
For starters, type check without running: replace ghc's -o option with -fno-code.
Keep deliberately invalid scope examples in comments; explain their failures.
Use the separate Tests module for finite checks, not a universal proof.
-}

import qualified Client
import qualified Tests

main :: IO ()
main = do
  print (Client.classify (-1))  -- expected: Nothing
  print (Client.classify 0)  -- expected: Just False
  print (Client.classify 9)  -- expected: Just False
  print (Client.classify 10)  -- expected: Just True
  print (Client.classify 20)  -- expected: Just True
  print (Client.classify 21)  -- expected: Nothing
  print (Client.acceptedValue 20)  -- expected: Just 20
  print Tests.checks  -- expected: True
