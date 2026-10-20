-- Title: Build and test an opaque stack of Int values
{-
QUESTION
Implement the polymorphic Stack interface with a private list representation.
Only empty, push, pop, peek and size may access the Stack constructor.
empty has size zero; push adds a new top; pop returns Nothing on empty or
Just (top, remaining stack); peek returns Nothing on empty or Just top.
Client.inspect :: [Int] -> (Maybe Int, Int) builds a stack with foldr push
empty, so the first element is the top, then reports the top and size.
Client.afterPop returns Nothing on empty or Just the size after one pop.
Tests.checks checks inspect [] and afterPop on two elements.
Explain why Stack [] and pattern matching on Stack fail in Client, why an
import of only push does not bring the name Stack into scope, and why the
constructor must stay private to preserve the interface boundary.
Implement the signatures in StackCore.hs, Client.hs, Tests.hs; keep the stated exports.
Main.hs is the entry file. From the parent directory of this bundle:
  runghc -iModule_AbstractStack Module_AbstractStack/Main.hs
  ghci -iModule_AbstractStack Module_AbstractStack/Main.hs
  ghc -iModule_AbstractStack Module_AbstractStack/Main.hs -o Module_AbstractStack/demo
For starters, type check without running: replace ghc's -o option with -fno-code.
Keep deliberately invalid scope examples in comments; explain their failures.
Use the separate Tests module for finite checks, not a universal proof.
-}

import qualified Client
import qualified Tests

main :: IO ()
main = do
  print (Client.inspect [])  -- expected: (Nothing,0)
  print (Client.inspect [4])  -- expected: (Just 4,1)
  print (Client.inspect [4,9])  -- expected: (Just 4,2)
  print (Client.afterPop [])  -- expected: Nothing
  print (Client.afterPop [4])  -- expected: Just 0
  print (Client.afterPop [4,9])  -- expected: Just 1
  print Tests.checks  -- expected: True
