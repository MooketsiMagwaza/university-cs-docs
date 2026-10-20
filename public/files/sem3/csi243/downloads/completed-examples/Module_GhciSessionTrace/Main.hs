-- Title: Trace a recursive integers total through separate modules
{-
QUESTION
Implement TraceCore.total as the sum of integers from 1 to n; return zero
for every nonpositive n. Client.answer delegates to total. Tests.checks
checks zero and three. Diagnose the logical bug in the commented alternative
base case, then use the GHCi commands below to inspect the corrected program.
Describe what :browse, :show modules, :show paths, :! and :reload establish.
Use :break, :trace, :history and :list to follow recursive calls; report your
own observations instead of assuming a particular breakpoint transcript.
Explain why TraceCore.total is not found if its module file is missing or
its directory is absent from the search path. Explain the roles of Main,
the interpreter, the executable compiler, .hi files and .o files.
Implement the signatures in TraceCore.hs, Client.hs, Tests.hs; keep the stated exports.
Main.hs is the entry file. From the parent directory of this bundle:
  runghc -iModule_GhciSessionTrace Module_GhciSessionTrace/Main.hs
  ghci -iModule_GhciSessionTrace Module_GhciSessionTrace/Main.hs
  ghc -iModule_GhciSessionTrace Module_GhciSessionTrace/Main.hs -o Module_GhciSessionTrace/demo
For starters, type check without running: replace ghc's -o option with -fno-code.
Keep deliberately invalid scope examples in comments; explain their failures.
Use the separate Tests module for finite checks, not a universal proof.
-}

import qualified Client
import qualified Tests

main :: IO ()
main = do
  print (Client.answer (-2))  -- expected: 0
  print (Client.answer 0)  -- expected: 0
  print (Client.answer 1)  -- expected: 1
  print (Client.answer 3)  -- expected: 6
  print (Client.answer 4)  -- expected: 10
  print Tests.checks  -- expected: True

-- From GHCi started by the QUESTION command (all modules interpreted):
-- :show modules
-- :show paths
-- :browse TraceCore
-- :! echo trace-exercise
-- :load Module_GhciSessionTrace/Main.hs
-- :break TraceCore.total
-- :trace Client.answer 3
-- While stopped, issue each command on its own line:
-- :list
-- :print n
-- :continue
-- :continue
-- While still stopped in a later recursive call:
-- :history
-- :back
-- :list
-- :forward
-- :continue
-- Repeat :continue until the result is printed.
-- :delete *
-- :reload
-- Change only an intentionally broken copy: total 0 = 1 would be a wrong
-- base case, not a missing-module failure. The zero test detects that bug.
-- runghc interprets; ghc builds an executable and may produce .hi interface
-- files and .o object files. :break needs interpreted code, not those objects.
