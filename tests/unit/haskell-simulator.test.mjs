import assert from 'node:assert/strict';
import test from 'node:test';
import { runHaskell, runHaskellWithInput } from '../../lib/haskell-simulator.ts';

/** Runs a program that must succeed and returns what it printed. */
function out(source, stdin = '') {
  const result = runHaskellWithInput(source, stdin);
  assert.equal(result.ok, true, result.ok ? '' : `${result.diagnostic.kind}: ${result.diagnostic.message}`);
  return result.output;
}

/** Runs a program that must fail and returns the diagnostic. */
function fails(source, stdin = '') {
  const result = runHaskellWithInput(source, stdin);
  assert.equal(result.ok, false, `expected a failure, got output: ${result.output}`);
  return result.diagnostic;
}

const lines = (...parts) => parts.join('\n');

test('the result has the shape the page components read', () => {
  const ok = runHaskell('main = print 1');
  assert.deepEqual(Object.keys(ok).sort(), ['elapsedMs', 'ok', 'output']);
  assert.equal(typeof ok.elapsedMs, 'number');
  const bad = runHaskell('main = print (');
  assert.equal(bad.ok, false);
  assert.ok(['Parse error', 'Type error', 'Runtime error'].includes(bad.diagnostic.kind));
  assert.equal(typeof bad.diagnostic.message, 'string');
  assert.equal(typeof bad.diagnostic.line, 'number');
});

test('empty input is reported, and definitions alone say so', () => {
  assert.equal(fails('   ').kind, 'Parse error');
  assert.match(out('double x = x * 2'), /^Definitions loaded/);
});

// ---- definitions -------------------------------------------------------------------------------

test('multi-equation definitions match patterns top to bottom', () => {
  const program = lines('fac :: Integer -> Integer', 'fac 0 = 1', 'fac n = n * fac (n - 1)', 'main = print (map fac [0, 1, 5, 20])');
  assert.equal(out(program), '[1,1,120,2432902008176640000]');
});

test('list patterns, cons patterns, tuples and as-patterns', () => {
  const program = lines(
    'describe [] = "empty"',
    'describe [x] = "one"',
    'describe (x:y:_) = "many"',
    'swap (a, b) = (b, a)',
    'whole all@(x:_) = (all, x)',
    'main = do',
    '  mapM_ (putStrLn . describe) [[], [1], [1, 2, 3]]',
    '  print (swap (1, "a"))',
    '  print (whole [7, 8])',
  );
  assert.equal(out(program), lines('empty', 'one', 'many', '("a",1)', '([7,8],7)'));
});

test('guards are tried in order and otherwise catches the rest', () => {
  const program = lines(
    'grade score',
    '  | score >= 90 = "A"',
    '  | score >= 80 = "B"',
    '  | otherwise = "F"',
    'main = mapM_ (putStrLn . grade) [95, 85, 10]',
  );
  assert.equal(out(program), lines('A', 'B', 'F'));
});

test('a clause whose guards all fail falls through to the next equation', () => {
  const program = lines('f x | x > 10 = "big"', 'f x = "small"', 'main = putStrLn (f 3 ++ " " ++ f 30)');
  assert.equal(out(program), 'small big');
});

test('where bindings are shared by every guard and see the parameters', () => {
  const program = lines(
    'bmiTell weight height',
    '  | bmi <= 18.5 = "under"',
    '  | bmi <= 25.0 = "normal"',
    '  | otherwise = "over"',
    '  where bmi = weight / height ^ 2',
    'main = mapM_ (putStrLn . uncurry bmiTell) [(50, 1.8), (70, 1.75), (100, 1.7)]',
  );
  assert.equal(out(program), lines('under', 'normal', 'over'));
});

test('where can define functions and nest', () => {
  const program = lines('f x = g x + h', '  where', '    g y = y * 2', '    h = k + 1', '      where k = 10', 'main = print (f 5)');
  assert.equal(out(program), '21');
});

test('case expressions with patterns, guards and a one-line braces form', () => {
  const program = lines(
    'sign n = case compare n 0 of',
    '  LT -> -1',
    '  EQ -> 0',
    '  GT -> 1',
    'kind x = case x of',
    '  Just n | n > 0 -> "positive"',
    '         | otherwise -> "other"',
    '  Nothing -> "none"',
    'pick x = case x of { 0 -> 1 ; 1 -> 5 ; _ -> -1 }',
    'main = do',
    '  print (map sign [-4, 0, 9])',
    '  print (map kind [Just 3, Just (-3), Nothing])',
    '  print (map pick [0, 1, 7])',
  );
  assert.equal(out(program), lines('[-1,0,1]', '["positive","other","none"]', '[1,5,-1]'));
});

test('let ... in on one line and across lines, and if/then/else', () => {
  const program = lines(
    'a = let x = 3; y = 4 in x * y',
    'b = let x = 3',
    '        y = 4',
    '    in x + y',
    'c n = if n > 0 then "pos" else if n < 0 then "neg" else "zero"',
    'main = print (a, b, map c [1, -1, 0])',
  );
  assert.equal(out(program), '(12,7,["pos","neg","zero"])');
});

test('lambdas, sections, backticks, composition and $', () => {
  const program = lines(
    'main = do',
    '  print (map (\\x -> x * x) [1, 2, 3])',
    '  print ((\\(a, b) c -> a + b + c) (1, 2) 3)',
    '  print (map (subtract 1) [5, 6], map (`div` 2) [9, 10], map (2 ^) [1, 2, 3], (3 `max`) 9)',
    '  print ((length . filter even . map (+ 1)) [1 .. 10])',
    '  putStrLn $ unwords $ map show [1, 2, 3]',
  );
  assert.equal(out(program), lines('[1,4,9]', '6', '([4,5],[4,5],[2,4,8],9)', '5', '1 2 3'));
});

test('user operators honour their fixity declarations', () => {
  const program = lines('infixl 6 |+|', '(|+|) :: Int -> Int -> Int', 'a |+| b = a * 10 + b', 'main = print (1 |+| 2 |+| 3)');
  assert.equal(out(program), '123');
});

test('mixing operators of the same precedence without parentheses is a parse error, as in GHC', () => {
  const diagnostic = fails('main = print (9 + -7)');
  assert.equal(diagnostic.kind, 'Parse error');
  assert.match(diagnostic.message, /cannot mix/);
  assert.equal(out('main = print (9 + (-7))'), '2');
});

// ---- lists ---------------------------------------------------------------------------------------

test('list comprehensions with several generators, guards, lets and pattern generators', () => {
  const program = lines(
    'main = do',
    '  print [x * x | x <- [1 .. 5], even x]',
    '  print [(x, y) | x <- [1 .. 3], y <- "ab", odd x]',
    '  print [y | x <- [1 .. 4], let y = x * 10, y > 15]',
    '  print [a | (a, True) <- [(1, True), (2, False), (3, True)]]',
    '  print [x | Just x <- [Just 1, Nothing, Just 3]]',
  );
  assert.equal(out(program), lines('[4,16]', "[(1,'a'),(1,'b'),(3,'a'),(3,'b')]", '[20,30,40]', '[1,3]', '[1,3]'));
});

test('ranges: finite, stepped, descending, characters and doubles', () => {
  const program = lines('main = do', '  print [1 .. 5]', '  print [1, 3 .. 9]', '  print [10, 8 .. 1]', "  print ['a' .. 'e']", '  print [0.5, 1.0 .. 2.5]', '  print ([5 .. 1] :: [Int])');
  assert.equal(out(program), lines('[1,2,3,4,5]', '[1,3,5,7,9]', '[10,8,6,4,2]', '"abcde"', '[0.5,1.0,1.5,2.0,2.5]', '[]'));
});

test('infinite lists are lazy: take, takeWhile, zipWith, iterate, cycle', () => {
  const program = lines(
    'fibs = 0 : 1 : zipWith (+) fibs (tail fibs)',
    'primes = sieve [2 ..] where sieve (p:xs) = p : sieve [x | x <- xs, x `mod` p /= 0]',
    'main = do',
    '  print (take 5 [1 ..])',
    '  print (takeWhile (< 40) (map (* 2) [1 ..]))',
    '  print (take 12 fibs)',
    '  print (take 8 primes)',
    '  print (take 4 (iterate (* 3) 1), take 5 (cycle [1, 2]))',
    '  print (fst (1, undefined))',
  );
  assert.equal(
    out(program),
    lines('[1,2,3,4,5]', '[2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38]', '[0,1,1,2,3,5,8,13,21,34,55,89]', '[2,3,5,7,11,13,17,19]', '([1,3,9,27],[1,2,1,2,1])', '1'),
  );
});

test('asking for a whole infinite list stops with a message instead of hanging', () => {
  const diagnostic = fails('main = print (length [1 ..])');
  assert.equal(diagnostic.kind, 'Runtime error');
  assert.match(diagnostic.message, /limit|too long/i);
});

test('the Prelude list functions', () => {
  const program = lines(
    'main = do',
    '  print (foldr (-) 0 [1, 2, 3], foldl (-) 0 [1, 2, 3], sum [1 .. 100], product [1 .. 5])',
    '  print (zip [1, 2, 3] "ab", unzip [(1, True), (2, False)])',
    '  print (span even [2, 4, 5, 6], break (> 2) [1, 2, 3, 4], splitAt 2 [1, 2, 3])',
    '  print (reverse [1, 2, 3], last [1, 2, 3], init [1, 2, 3], [1, 2, 3] !! 1, elem 2 [1, 2], lookup 2 [(1, "a"), (2, "b")])',
    '  print (words "a b  c", unwords ["x", "y"], lines "p\\nq\\n", unlines ["p", "q"])',
    '  print (concat [[1], [2, 3]], concatMap show [1, 2, 3], replicate 3 \'x\', and [True, False], or [True, False], all even [2, 4], any odd [2, 4])',
    '  print (scanl (+) 0 [1, 2, 3], scanr (+) 0 [1, 2, 3], takeWhile even [2, 4, 5], dropWhile even [2, 4, 5])',
  );
  assert.equal(
    out(program),
    lines(
      '(2,-6,5050,120)',
      "([(1,'a'),(2,'b')],([1,2],[True,False]))",
      '(([2,4],[5,6]),([1,2],[3,4]),([1,2],[3]))',
      '([3,2,1],3,[1,2],2,True,Just "b")',
      '(["a","b","c"],"x y",["p","q"],"p\\nq\\n")',
      '([1,2,3],"123","xxx",False,True,True,False)',
      '([0,1,3,6],[6,5,3,0],[2,4],[5])',
    ),
  );
});

// ---- types ---------------------------------------------------------------------------------------

test('data types: constructors, deriving Show and Eq, negative arguments, nested parentheses', () => {
  const program = lines(
    'data Shape = Circle Double | Rect Double Double deriving (Show, Eq)',
    'data T = A Int | B (Maybe Int) deriving Show',
    'area (Circle r) = pi * r * r',
    'area (Rect w h) = w * h',
    'main = do',
    '  print (Circle 5)',
    '  print [Circle 1, Rect 2 3]',
    '  print (area (Rect 3 4), Circle 1 == Circle 1, Circle 1 == Rect 1 1)',
    '  print [A (-3), B (Just (-2)), B Nothing]',
  );
  assert.equal(out(program), lines('Circle 5.0', '[Circle 1.0,Rect 2.0 3.0]', '(12.0,True,False)', '[A (-3),B (Just (-2)),B Nothing]'));
});

test('records: construction, field access, update and show', () => {
  const program = lines(
    'data Student = Student { name :: String, mark :: Int } deriving (Show, Eq)',
    'main = do',
    '  let k = Student { name = "Kago", mark = 72 }',
    '  print k',
    '  print (mark k, name k)',
    '  print (k { mark = 75 })',
    '  print (k == k { mark = 72 })',
  );
  assert.equal(out(program), lines('Student {name = "Kago", mark = 72}', '(72,"Kago")', 'Student {name = "Kago", mark = 75}', 'True'));
});

test('enumeration types: ranges, succ, comparison, bounds', () => {
  const program = lines(
    'data Day = Mon | Tue | Wed deriving (Show, Eq, Ord, Enum, Bounded)',
    'main = do',
    '  print [Mon ..]',
    '  print (succ Mon, fromEnum Wed, Mon < Wed)',
    '  print [minBound .. maxBound :: Day]',
    '  print (maxBound :: Int)',
  );
  assert.equal(out(program), lines('[Mon,Tue,Wed]', '(Tue,2,True)', '[Mon,Tue,Wed]', '9223372036854775807'));
});

test('recursive types, type synonyms and newtype', () => {
  const program = lines(
    'data Tree a = Leaf a | Branch (Tree a) (Tree a) deriving Show',
    'type Pair a = (a, a)',
    'newtype Wrapper a = Wrapper a deriving Show',
    'sumTree :: Tree Int -> Int',
    'sumTree (Leaf n) = n',
    'sumTree (Branch l r) = sumTree l + sumTree r',
    'swapPair :: Pair Int -> Pair Int',
    'swapPair (a, b) = (b, a)',
    'main = do',
    '  print (sumTree (Branch (Leaf 1) (Branch (Leaf 2) (Leaf 3))))',
    '  print (Branch (Leaf 1) (Leaf 2))',
    '  print (swapPair (1, 2), Wrapper 5)',
  );
  assert.equal(out(program), lines('6', 'Branch (Leaf 1) (Leaf 2)', '((2,1),Wrapper 5)'));
});

test('a type without deriving Show cannot be shown, as in GHC', () => {
  const diagnostic = fails(lines('data Color = Red | Green', 'main = print Red'));
  assert.equal(diagnostic.kind, 'Type error');
  assert.match(diagnostic.message, /No instance for \(Show Color\)/);
});

test('classes and instances written by the user', () => {
  const program = lines(
    'class Shape a where',
    '  area :: a -> Double',
    '  describe :: a -> String',
    '  describe x = "area " ++ show (area x)',
    'data Sq = Sq Double',
    'data Ci = Ci Double',
    'instance Shape Sq where',
    '  area (Sq s) = s * s',
    'instance Shape Ci where',
    '  area (Ci r) = 3 * r * r',
    '  describe _ = "a circle"',
    'data Color = Red | Green',
    'instance Show Color where',
    '  show Red = "R"',
    '  show Green = "G"',
    'instance Eq Color where',
    '  Red == Red = True',
    '  Green == Green = True',
    '  _ == _ = False',
    'main = do',
    '  putStrLn (describe (Sq 2))',
    '  putStrLn (describe (Ci 1))',
    '  print [Red, Green]',
    '  print (Red == Red, Red /= Green)',
  );
  assert.equal(out(program), lines('area 4.0', 'a circle', '[R,G]', '(True,True)'));
});

test('inside an instance, a method name still means the class method', () => {
  const program = lines(
    'data Shape = Circle Double | Rect Double Double',
    'instance Show Shape where',
    '  show (Circle r) = "circle " ++ show r',
    '  show (Rect w h) = "rect " ++ show w ++ "x" ++ show h',
    'main = print [Circle 2, Rect 1 3]',
  );
  assert.equal(out(program), '[circle 2.0,rect 1.0x3.0]');
});

test('lazy patterns, a where after case alternatives, and a parenthesised infix definition', () => {
  const program = lines(
    'lazy ~(a, b) = 1',
    'twice x = case x of',
    '  Just y -> g y',
    '  Nothing -> 0',
    '  where g = (* 2)',
    '(f |> g) x = g (f x)',
    'main = print (lazy undefined, twice (Just 4), twice Nothing, ((+ 1) |> (* 3)) 4)',
  );
  assert.equal(out(program), '(1,8,0,15)');
});

test('read understands the text show writes for numbers, lists, tuples, constructors and records', () => {
  const program = lines(
    'data Student = Student { name :: String, mark :: Int } deriving (Show, Read, Eq)',
    'main = do',
    '  print (read "[1,2,3]" :: [Int])',
    '  print (read "(1,\\"a\\")" :: (Int, String))',
    '  print (read "-5" + 1, read "2.5" * 2 :: Double)',
    '  let k = Student { name = "Kago", mark = 72 }',
    '  print ((read (show k) :: Student) == k)',
  );
  assert.equal(out(program), lines('[1,2,3]', '(1,"a")', '(-4,5.0)', 'True'));
  assert.match(fails('main = print (read "x" :: Int)').message, /no parse/);
});

test('Maybe and Either, including a data declaration that repeats the Prelude type', () => {
  const program = lines(
    'data Maybe a = Nothing | Just a',
    'safeDiv _ 0 = Nothing',
    'safeDiv a b = Just (a `div` b)',
    'main = do',
    '  print (safeDiv 10 2, safeDiv 1 0)',
    '  print (do { x <- safeDiv 10 2; y <- safeDiv x 0; return (x + y) })',
    '  print (do { x <- safeDiv 10 2; return (x + 1) })',
    '  print (either show (map succ) (Left 3 :: Either Int String), either show (map succ) (Right "ab"))',
    '  print (fmap (+ 1) (Just 2), (+ 1) <$> [1, 2], maybe 0 (* 2) (Just 4))',
  );
  assert.equal(out(program), lines('(Just 5,Nothing)', 'Nothing', 'Just 6', '("3","bc")', '(Just 3,[2,3],8)'));
});

test('numbers print the way GHC prints them', () => {
  const program = lines(
    'main = do',
    '  print (1 / 3, 2 / 4, 0.1 + 0.2)',
    '  print (1.0e-2, 12345678.9, 5.0e-2, 100.0, 1.0e7, 0.1)',
    '  print (sqrt 16, 2 ** 10, fromIntegral (length [1, 2, 3]) / 2)',
    '  print (7 `div` 2, (-7) `div` 2, (-7) `mod` 2, (-7) `quot` 2, (-7) `rem` 2, divMod 7 2)',
    '  print (round 2.5, round 3.5, round (-2.5), truncate (-2.7), floor (-2.5), ceiling 2.1)',
    '  print (product [1 .. 25], 2 ^ 64, 1 / 0, -(1 / 0))',
    '  print (-5, [-1, 2], (-1, -2), Just (-2.5))',
    '  print (3 :: Double, [1.5, 2], abs (-3), signum (-2.5), negate 4)',
  );
  assert.equal(
    out(program),
    lines(
      '(0.3333333333333333,0.5,0.30000000000000004)',
      '(1.0e-2,1.23456789e7,5.0e-2,100.0,1.0e7,0.1)',
      '(4.0,1024.0,1.5)',
      '(3,-4,1,-3,-1,(3,1))',
      '(2,4,-2,-2,-3,3)',
      '(15511210043330985984000000,18446744073709551616,Infinity,-Infinity)',
      '(-5,[-1,2],(-1,-2),Just (-2.5))',
      '(3.0,[1.5,2.0],3,-1.0,-4)',
    ),
  );
});

test('a type signature that says Double makes whole numbers print as Doubles', () => {
  const program = lines(
    'half :: Int -> Double',
    'half n = fromIntegral n / 2',
    'twice :: Double -> Double',
    'twice x = x * 2',
    'price :: Double',
    'price = 10',
    'main = print (half 5, twice 3, price, [twice 1, 2], sum (map twice [1, 2]))',
  );
  assert.equal(out(program), '(2.5,6.0,10.0,[2.0,2.0],6.0)');
});

test('strings, characters and show escape sequences', () => {
  const program = lines(
    'main = do',
    '  print "a\\nb\\"c"',
    "  print 'x'",
    "  print '\\n'",
    "  print '\\''",
    '  print "caf\\233"',
    '  putStrLn "tab:\\there"',
    '  print ""',
    '  print ([] :: [Int])',
    '  print (filter (== \'z\') "abc")',
    '  print (show 42 ++ "!", "ab" < "b", compare 1 2, max "a" "b")',
  );
  assert.equal(out(program), lines('"a\\nb\\"c"', "'x'", "'\\n'", "'\\''", '"caf\\233"', 'tab:\there', '""', '[]', '""', '("42!",True,LT,"b")'));
});

// ---- the library --------------------------------------------------------------------------------

test('Data.Char, Data.List and Data.Maybe need their imports', () => {
  const program = lines(
    'import Data.Char (toUpper, isDigit)',
    'import Data.List',
    'import Data.Maybe',
    'main = do',
    '  putStrLn (map toUpper "hello")',
    '  print (filter isDigit "a1b2", sort [3, 1, 2], nub [1, 1, 2], group (sort "mississippi"))',
    '  print (isPrefixOf "ab" "abc", intercalate ", " ["a", "b"], transpose ["abc", "de"], partition even [1 .. 6])',
    '  print (fromMaybe 0 Nothing, catMaybes [Just 1, Nothing], mapMaybe (\\x -> if x > 1 then Just x else Nothing) [1, 2, 3])',
  );
  assert.equal(
    out(program),
    lines('HELLO', '("12",[1,2,3],[1,2],["iiii","m","pp","ssss"])', '(True,"a, b",["ad","be","c"],([2,4,6],[1,3,5]))', '(0,[1],[2,3])'),
  );
  assert.match(fails('main = print (sort [2, 1])').message, /Variable not in scope: sort/);
  assert.match(fails('main = print (toUpper \'a\')').message, /Variable not in scope: toUpper/);
  assert.match(fails('import Data.Char (nope)\nmain = print 1').message, /does not export/);
  assert.match(fails('import Nothing.Here\nmain = print 1').message, /Could not find module/);
});

test('qualified imports, aliases and hiding', () => {
  const program = lines(
    'import qualified Data.List as L',
    'import Data.Char hiding (toUpper)',
    'import Prelude hiding (lookup)',
    'lookup k = "mine"',
    'main = do',
    '  print (L.sort [3, 1, 2], L.nub [1, 1])',
    '  print (ord \'a\', lookup 1)',
  );
  assert.equal(out(program), lines('([1,2,3],[1])', '(97,"mine")'));
  assert.match(fails('import Data.Char hiding (toUpper)\nmain = print (toUpper \'a\')').message, /not in scope/);
});

test('Data.Map and Data.Set', () => {
  const program = lines(
    'import qualified Data.Map as Map',
    'import qualified Data.Set as Set',
    'marks :: Map.Map String Int',
    'marks = Map.fromList [("Kago", 72), ("Naledi", 68)]',
    'main = do',
    '  print (Map.lookup "Kago" marks, Map.lookup "Sipho" marks, Map.member "Naledi" marks)',
    '  print (Map.insert "Sipho" 55 marks)',
    '  print (Map.size marks, Map.toList (Map.map (+ 1) marks), Map.findWithDefault 0 "x" marks)',
    '  print (Set.fromList "aeiouaeiou", Set.member \'e\' (Set.fromList "aeiou"), Set.size (Set.fromList [1, 1, 2]))',
  );
  assert.equal(
    out(program),
    lines('(Just 72,Nothing,True)', 'fromList [("Kago",72),("Naledi",68),("Sipho",55)]', '(2,[("Kago",73),("Naledi",69)],0)', '(fromList "aeiou",True,2)'),
  );
});

test('Text.Printf formats numbers and text', () => {
  const program = lines('import Text.Printf', 'main = do', '  printf "%d items cost %.2f\\n" (3 :: Int) (4.5 :: Double)', '  printf "%5s|%-5s|%03d\\n" "ab" "cd" (7 :: Int)');
  assert.equal(out(program), lines('3 items cost 4.50', '   ab|cd   |007'));
});

// ---- IO ------------------------------------------------------------------------------------------

test('main = do with print, putStrLn, putStr, let, when, mapM_ and forM_', () => {
  const program = lines(
    'import Control.Monad',
    'main :: IO ()',
    'main = do',
    '  putStr "a"',
    '  putStr "b\\n"',
    '  let n = 5',
    '      m = n * 2',
    '  when (m > 5) $ putStrLn "big"',
    '  unless (m > 5) $ putStrLn "small"',
    '  if n > 3',
    '    then putStrLn "n is large"',
    '    else putStrLn "n is small"',
    '  mapM_ print [1, 2]',
    '  forM_ [3, 4] $ \\i -> do',
    '    putStr "item "',
    '    print i',
    '  x <- return 7',
    '  print x',
  );
  assert.equal(out(program), lines('ab', 'big', 'n is large', '1', '2', 'item 3', 'item 4', '7'));
});

test('getLine, readLn, read and interact take their text from the input', () => {
  const program = lines('main = do', '  name <- getLine', '  n <- readLn :: IO Int', '  putStrLn (name ++ " " ++ show (n * 2))');
  assert.equal(out(program, 'Kago\n21\n'), 'Kago 42');
  assert.equal(out('main = interact (map succ)', 'HAL'), 'IBM');
  const diagnostic = fails('main = getLine >>= putStrLn');
  assert.match(diagnostic.message, /end of file/);
  const partial = runHaskell('main = putStrLn "Enter a number:" >> getLine >>= putStrLn');
  assert.equal(partial.ok, false);
  assert.equal(partial.output, 'Enter a number:\n');
});

test('GHCi-style lines run in order, keep let bindings and set it', () => {
  const program = lines(
    'square x = x * x',
    'ghci> square 4',
    'ghci> let y = 10',
    'ghci> y + 1',
    'ghci> it * 2',
    'ghci> "hi"',
    'ghci> f 0 = 1; f n = n * f (n - 1)',
    'ghci> f 5',
  );
  assert.equal(out(program), lines('16', '11', '22', '"hi"', '120'));
  assert.equal(out(lines('ghci> let x = 3', 'ghci> let old = x', 'ghci> let x = 4', 'ghci> (old, x)')), '(3,4)');
  assert.equal(out('ghci> maxBound :: Int'), '9223372036854775807');
});

test('a file that defines main and shows expressions as well keeps to the session lines', () => {
  assert.equal(out(lines('main = putStrLn "from main"', 'ghci> 1 + 1')), '2');
});

// ---- errors --------------------------------------------------------------------------------------

test('parse errors name the line and column', () => {
  const diagnostic = fails(lines('f x = x +', 'main = print (f 1)'));
  assert.equal(diagnostic.kind, 'Parse error');
  assert.equal(diagnostic.line >= 1, true);
  const unclosed = fails('main = print (1 + 2');
  assert.equal(unclosed.kind, 'Parse error');
  const badString = fails('main = putStrLn "oops');
  assert.equal(badString.kind, 'Parse error');
  assert.equal(badString.line, 1);
});

test('names are checked before anything runs, with the position of the first unknown name', () => {
  const result = runHaskell(lines('main = do', '  putStrLn "before"', '  print undefinedName'));
  assert.equal(result.ok, false);
  assert.equal(result.output, '', 'nothing may print when a name is not in scope');
  assert.equal(result.diagnostic.kind, 'Type error');
  assert.match(result.diagnostic.message, /Variable not in scope: undefinedName/);
  assert.equal(result.diagnostic.line, 3);
  assert.match(fails('main = print Hello World').message, /Data constructor not in scope: Hello/);
});

test('type mismatches that a run can notice are reported as type errors', () => {
  assert.equal(fails('main = print (not 3)').kind, 'Type error');
  assert.match(fails('main = print (not 3)').message, /Bool/);
  assert.equal(fails('main = print (length 5)').kind, 'Type error');
  assert.equal(fails('main = print ("a" + 1)').kind, 'Type error');
  assert.equal(fails('main = print (if True then "yes" else 0)').kind, 'Type error');
  assert.equal(fails("main = print [1, 'a']").kind, 'Type error');
  assert.equal(fails('main = print (1 : "a")').kind, 'Type error');
  assert.equal(fails(lines('f :: Int -> Int', 'f 0 = 1', 'f n = "x"', 'main = print (f 1)')).kind, 'Type error');
});

test('runtime errors keep what the program printed before they happened', () => {
  const result = runHaskell(lines('main = do', '  putStrLn "before"', '  print (1 `div` 0)', '  putStrLn "after"'));
  assert.equal(result.ok, false);
  assert.equal(result.diagnostic.kind, 'Runtime error');
  assert.match(result.diagnostic.message, /divide by zero/);
  assert.equal(result.output, 'before\n');
  assert.match(fails('main = print (head [])').message, /Prelude.head: empty list/);
  assert.match(fails(lines('f 1 = 2', 'main = print (f 3)')).message, /Non-exhaustive patterns in function f/);
  assert.match(fails('main = error "boom"').message, /boom/);
  assert.match(fails('main = print (fromJust Nothing)').message, /not in scope/);
});

test('runaway recursion stops with a message', () => {
  const diagnostic = fails(lines('f x = f (x + 1)', 'main = print (f 0)'));
  assert.equal(diagnostic.kind, 'Runtime error');
  assert.match(diagnostic.message, /limit|too long/i);
  const deep = fails(lines('count n = 1 + count (n + 1)', 'main = print (count 0)'));
  assert.equal(deep.kind, 'Runtime error');
});

test('tail-recursive loops and large sums do not run out of stack', () => {
  assert.equal(out(lines('loop acc 0 = acc', 'loop acc n = loop (acc + n) (n - 1)', 'main = print (loop 0 100000)')), '5000050000');
  assert.equal(out('main = print (sum [1 .. 100000], length (filter even [1 .. 100000]), foldr (+) 0 [1 .. 20000])'), '(5000050000,50000,200010000)');
});

test('the module header, comments and strings with layout characters parse', () => {
  const program = lines('module Main where', '{- a block {- nested -} comment -}', '-- a line comment', 'main :: IO ()', 'main = putStrLn "-- not a comment {- either -}"');
  assert.equal(out(program), '-- not a comment {- either -}');
});
