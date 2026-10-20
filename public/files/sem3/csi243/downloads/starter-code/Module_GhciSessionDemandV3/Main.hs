-- Title: Inspect demand on a lazy prefix of alternating Boolean values
{-
QUESTION
Define StreamCore.stream as alternating Boolean values, using cycle [False, True].
prefix n returns take n stream. Client.observe returns the length and contents
of this finite prefix; nonpositive n yields (0,[]). Tests.checks checks zero
and three. Use the GHCi observation commands below on a fresh xs binding.
Explain :print versus :force, and why forcing the whole infinite stream or
counting its length cannot complete. The commented length stream alternative
is a failing demand choice, not a missing export. Explain why unqualified
prefix is unavailable under import qualified StreamCore as S, while S.prefix
works. Do not assume that loading compiled object code permits breakpoints.
Implement the signatures in StreamCore.hs, Client.hs, Tests.hs; keep the stated exports.
Main.hs is the entry file. From the parent directory of this bundle:
  runghc -iModule_GhciSessionDemandV3 Module_GhciSessionDemandV3/Main.hs
  ghci -iModule_GhciSessionDemandV3 Module_GhciSessionDemandV3/Main.hs
  ghc -iModule_GhciSessionDemandV3 Module_GhciSessionDemandV3/Main.hs -o Module_GhciSessionDemandV3/demo
For starters, type check without running: replace ghc's -o option with -fno-code.
Keep deliberately invalid scope examples in comments; explain their failures.
Use the separate Tests module for finite checks, not a universal proof.
-}

import qualified Client
import qualified Tests

main :: IO ()
main = do
  print (Client.observe 0)  -- expected: (0,[])
  print (Client.observe 1)  -- expected: (1,[False])
  print (Client.observe 3)  -- expected: (3,[False,True,False])
  print (Client.observe 4)  -- expected: (4,[False,True,False,True])
  print (Client.observe (-1))  -- expected: (0,[])
  print Tests.checks  -- expected: True

-- GHCi commands, after loading Main with the QUESTION command:
-- :module + *StreamCore
-- :browse StreamCore
-- :show modules
-- :show paths
-- :! echo demand-exercise
-- let xs = StreamCore.prefix 3
-- :print xs
-- :force xs
-- :print xs
-- :reload
-- :print observes the current binding without demanding its unevaluated
-- parts; :force evaluates the finite prefix. Do not :force the whole stream.
-- Compare actual observations; thunk names and prior demand can differ.
-- Deliberately bad client alternative (do not execute): length stream
-- It demands an infinite spine. Observe with finite prefixes instead.
