-- Title: Remove a module cycle by passing a transformation function
{-
QUESTION
Repair a proposed cycle: Client imports TransformCore, but TransformCore
would import Client to obtain its transformation. Move Request = [Int] to
Shared, and define TransformCore.applyRule :: (Int -> Int) -> Request -> Request
by applying the supplied rule to every element. Client.process must add one
using applyRule. Tests.checks covers empty and two-element requests.
Draw the repaired dependency graph and explain why adding import Client to
TransformCore recreates a cycle. Explain why a missing Shared.hs prevents
module lookup even though the alias is simple. Contrast this function
parameter with a module functor in another language and with Haskell's
Functor class; neither requires new module syntax here. A type parameter
such as Stack a is another ordinary way to make Haskell code reusable.
Implement the signatures in Shared.hs, TransformCore.hs, Client.hs, Tests.hs; keep the stated exports.
Main.hs is the entry file. From the parent directory of this bundle:
  runghc -iModule_ImportRepairCycle Module_ImportRepairCycle/Main.hs
  ghci -iModule_ImportRepairCycle Module_ImportRepairCycle/Main.hs
  ghc -iModule_ImportRepairCycle Module_ImportRepairCycle/Main.hs -o Module_ImportRepairCycle/demo
For starters, type check without running: replace ghc's -o option with -fno-code.
Keep deliberately invalid scope examples in comments; explain their failures.
Use the separate Tests module for finite checks, not a universal proof.
-}

import qualified Client
import qualified Tests

main :: IO ()
main = do
  print (Client.process [])  -- expected: []
  print (Client.process [0])  -- expected: [1]
  print (Client.process [1,2])  -- expected: [2,3]
  print (Client.process [-2,0,3])  -- expected: [-1,1,4]
  print (Client.process [5,5])  -- expected: [6,6]
  print Tests.checks  -- expected: True
