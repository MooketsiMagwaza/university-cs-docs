-- Title: Export a geometry function while hiding its type synonym
{-
QUESTION
Write Geometry.diagonalSquared for squared diagonal on nonnegative Int dimensions.
Define the private synonym Length = Int; export only diagonalSquared.
Client.measure must use the ordinary explicit import, but call the function
with its Geometry qualifier. Tests.checks checks zero and a 2-by-3 rectangle.
Explain why a client annotation mentioning Geometry.Length is out of scope,
yet measure may have an Int signature. Explain why exporting a synonym is
optional. Renaming Geometry.hs breaks lookup; a hierarchical name A.Geometry
would require A/Geometry.hs (this exercise uses only flat module names).
Implement the signatures in Geometry.hs, Client.hs, Tests.hs; keep the stated exports.
Main.hs is the entry file. From the parent directory of this bundle:
  runghc -iModule_ExportGeometryV3 Module_ExportGeometryV3/Main.hs
  ghci -iModule_ExportGeometryV3 Module_ExportGeometryV3/Main.hs
  ghc -iModule_ExportGeometryV3 Module_ExportGeometryV3/Main.hs -o Module_ExportGeometryV3/demo
For starters, type check without running: replace ghc's -o option with -fno-code.
Keep deliberately invalid scope examples in comments; explain their failures.
Use the separate Tests module for finite checks, not a universal proof.
-}

import qualified Client
import qualified Tests

main :: IO ()
main = do
  print (Client.measure 0 0)  -- expected: 0
  print (Client.measure 2 3)  -- expected: 13
  print (Client.measure 2 2)  -- expected: 8
  print (Client.measure 1 5)  -- expected: 26
  print (Client.measure 3 4)  -- expected: 25
  print Tests.checks  -- expected: True
