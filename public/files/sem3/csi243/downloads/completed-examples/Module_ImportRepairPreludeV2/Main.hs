-- Title: Repair a Prelude clash and retain qualified access
{-
QUESTION
Write Calculator.reverse :: Int -> Int with reverse n = 20 - n.
In Client, repair the implicit Prelude reverse clash by explicitly importing
Prelude hiding (reverse), and import Calculator (reverse) normally.
report n returns (reverse n, Calculator.reverse (n + 1)). Tests.checks checks
zero and 20. Explain why removing hiding makes unqualified reverse
ambiguous, while the Calculator qualifier disambiguates it. Explain the
alternative import qualified Calculator as C, and why it requires C.reverse
instead of unqualified reverse or Calculator.reverse. Do not uncomment the
ambiguous alternative. This is a scope repair, not a list-reversal task.
Implement the signatures in Calculator.hs, Client.hs, Tests.hs; keep the stated exports.
Main.hs is the entry file. From the parent directory of this bundle:
  runghc -iModule_ImportRepairPreludeV2 Module_ImportRepairPreludeV2/Main.hs
  ghci -iModule_ImportRepairPreludeV2 Module_ImportRepairPreludeV2/Main.hs
  ghc -iModule_ImportRepairPreludeV2 Module_ImportRepairPreludeV2/Main.hs -o Module_ImportRepairPreludeV2/demo
For starters, type check without running: replace ghc's -o option with -fno-code.
Keep deliberately invalid scope examples in comments; explain their failures.
Use the separate Tests module for finite checks, not a universal proof.
-}

import qualified Client
import qualified Tests

main :: IO ()
main = do
  print (Client.report 0)  -- expected: (20,19)
  print (Client.report 1)  -- expected: (19,18)
  print (Client.report 3)  -- expected: (17,16)
  print (Client.report 20)  -- expected: (0,-1)
  print (Client.report 21)  -- expected: (-1,-2)
  print Tests.checks  -- expected: True
