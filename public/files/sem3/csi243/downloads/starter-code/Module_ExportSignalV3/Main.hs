-- Title: Use a signal interface with only Go
{-
QUESTION
Implement data Signal = Stop | Go in SignalCore with exports (Signal(Go), stop, go, code).
Define stop = Stop and go = Go. Define code by these equations:
code Stop = -1
code Go = 1
Client.choose selects stop/Stop for False and go/Go for True, using only
constructors the interface exports; report maps (code . choose) over a list
of Boolean inputs, preserving their order, including an empty list.
Use the exact Client import supplied. Tests.checks checks an empty list and both Boolean cases together.
Explain the scope result for Signal, Stop and Go in this client, and for a
client that imports only code. An imported function can use a hidden type
internally without making its type name available for source annotations.
Compare export lists Signal, Signal(..) and Signal(Go); identify the failures
of unexported constructors without adding failing code to Main.
Implement the signatures in SignalCore.hs, Client.hs, Tests.hs; keep the stated exports.
Main.hs is the entry file. From the parent directory of this bundle:
  runghc -iModule_ExportSignalV3 Module_ExportSignalV3/Main.hs
  ghci -iModule_ExportSignalV3 Module_ExportSignalV3/Main.hs
  ghc -iModule_ExportSignalV3 Module_ExportSignalV3/Main.hs -o Module_ExportSignalV3/demo
For starters, type check without running: replace ghc's -o option with -fno-code.
Keep deliberately invalid scope examples in comments; explain their failures.
Use the separate Tests module for finite checks, not a universal proof.
-}

import qualified Client
import qualified Tests

main :: IO ()
main = do
  print (Client.report [])  -- expected: []
  print (Client.report [False])  -- expected: [-1]
  print (Client.report [True])  -- expected: [1]
  print (Client.report [False,True])  -- expected: [-1,1]
  print (Client.report [True,False,True])  -- expected: [1,-1,1]
  print Tests.checks  -- expected: True
