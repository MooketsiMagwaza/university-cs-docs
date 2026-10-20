-- Title: Repair a Prelude clash and retain qualified access
{-
QUESTION
Write Calculator.reverse :: Int -> Int with reverse n = 10 - n.
In Client, repair the implicit Prelude reverse clash by explicitly importing
Prelude hiding (reverse), and import Calculator (reverse) normally.
report n returns (reverse n, Calculator.reverse (n + 1)). Tests.checks checks
zero and 10. Explain why removing hiding makes unqualified reverse
ambiguous, while the Calculator qualifier disambiguates it. Explain the
alternative import qualified Calculator as C, and why it requires C.reverse
instead of unqualified reverse or Calculator.reverse. Do not uncomment the
ambiguous alternative. This is a scope repair, not a list-reversal task.
Implement the signatures in Calculator.hs, Client.hs, Tests.hs; keep the stated exports.
Main.hs is the entry file. From the parent directory of this bundle:
  runghc -iModule_ImportRepairPrelude Module_ImportRepairPrelude/Main.hs
  ghci -iModule_ImportRepairPrelude Module_ImportRepairPrelude/Main.hs
  ghc -iModule_ImportRepairPrelude Module_ImportRepairPrelude/Main.hs -o Module_ImportRepairPrelude/demo
For starters, type check without running: replace ghc's -o option with -fno-code.
Keep deliberately invalid scope examples in comments; explain their failures.
Use the separate Tests module for finite checks, not a universal proof.
-}

import qualified Client
import qualified Tests

main :: IO ()
main = do
  print (Client.report 0)  -- expected: (10,9)
  print (Client.report 1)  -- expected: (9,8)
  print (Client.report 3)  -- expected: (7,6)
  print (Client.report 10)  -- expected: (0,-1)
  print (Client.report 11)  -- expected: (-1,-2)
  print Tests.checks  -- expected: True
