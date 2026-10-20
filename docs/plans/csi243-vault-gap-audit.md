# CSI243 vault gap audit

Audit date: 20 October 2026. Scope: Task 1 only. The vault is the syllabus; the source matrix's old "Planned" statuses are not evidence of a present gap. This audit compares the current lessons, chapter questions, reviews and cheat sheets with the extracted sources. It does not change lessons or downloads.

Depth means: **none** = no teaching found; **mentioned** = named, listed or used without teaching the operation; **explained** = a usable explanation or worked example, but short of the brief's full template, three distinct worked variations, narrated exam answer, errors and answered practice; **exam depth** = that fuller teaching is present across the cited pages. Depth is assessed for the stated concept or exercise, not inherited from the chapter. A runnable download helps practice but does not by itself supply the explanation.

The new where, case, comprehension, higher-order, data, polymorphism, proof and lazy-evaluation lessons are counted as existing. As instructed, `09-polymorphism/notes/maybe-in-depth.mdx`, `either-in-depth.mdx` and `maybe-either-exam-practice.mdx` are counted as existing exam-depth coverage even while being written. Their coverage is an explicit supplied assumption, not a claim that their unfinished files were inspected.

Site shorthand: `C01` = `content/docs/sem3/csi243/01-functional-thinking/notes/`; `C02` = `.../02-expressions-types/notes/`; `C03` = `.../03-defining-functions/notes/`; `C04` = `.../04-making-choices/notes/`; `C05` = `.../05-recursion/notes/`; `C06` = `.../06-lists-tuples/notes/`; `C07` = `.../07-higher-order/notes/`; `C08` = `.../08-modules-types/notes/`; `C09` = `.../09-polymorphism/notes/`; `C10` = `.../10-reasoning-revision/notes/`. Page names below include `.mdx` implicitly. `Q`, `R` and `CS` mean the corresponding chapter's `questions.mdx`, `review.mdx` and `cheat-sheet.mdx`, outside `notes/`. Source paths are vault-relative paths from each extraction's `SOURCE:` line; page numbers refer to extracted PDF pages, slide numbers to PPT slides. All 122 supplied extractions except the excluded `users_guide.pdf.txt` are represented below, including duplicate editions and supporting test/output files. No separate Higher Order Functions lecture extraction or Lab 6 sheet appears in this supplied directory; their concepts are checked through the handouts, books, matrix and existing downloads rather than an invented source citation.

`V1`-`V16` in a gap cell identifies the follow-on lane. A dash means no gap for that row. An exact historical function name need not be repeated if the existing lesson teaches and practises the same complete question shape.

## 1. Coverage table

### Test1 topics 01-16

Each topic includes every supplied file. Core definitions are separated by function or declaration; application, test and expected-output rows account for the distinct exercise forms those files add. The sibling and lecture tables below separate additional library operations used incidentally by those applications.

#### 01-Hello-World

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\01-Hello-World\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C02/first-program; C03/output | exam depth | - |
| Resources\Test1\01-Hello-World\HelloWorldApp.hs; main | Trace a complete application | C02/first-program; C03/output; C03/complete-program | exam depth | - |
| Resources\Test1\01-Hello-World\HelloWorldCore.hs; message | message :: String | C02/first-program; C03/output | exam depth | - |
| Resources\Test1\01-Hello-World\HelloWorldTest.hs; assertion "message text" | Predict/check: message text | C02/first-program; C03/output; C10/errors-and-testing | exam depth | - |
| Resources\Test1\01-Hello-World\HelloWorldTest.hs; assertion "message length" | Predict/check: message length | C02/first-program; C03/output; C10/errors-and-testing | exam depth | - |
| Resources\Test1\01-Hello-World\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |

#### 02-Output

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\02-Output\BrokenExamples\PutStrLnNumber.hs; whole file | Diagnose putStrLn applied to a number | C03/output; C03/lab-01 | exam depth | - |
| Resources\Test1\02-Output\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C03/output; C03/lab-01; C03/Q | exam depth | - |
| Resources\Test1\02-Output\LogicalErrorApp.hs; main | Trace a complete application | C03/output; C03/lab-01; C03/Q; C03/complete-program | exam depth | - |
| Resources\Test1\02-Output\LogicalErrorExpected.txt; complete transcript | Predict exact values, quotes, lines and errors | C03/output; C03/lab-01; C03/Q | exam depth | - |
| Resources\Test1\02-Output\OutputApp.hs; main | Trace a complete application | C03/output; C03/lab-01; C03/Q; C03/complete-program | exam depth | - |
| Resources\Test1\02-Output\OutputExamples.hs; cube | cube :: Integer -> Integer | C03/output; C03/lab-01; C03/Q | exam depth | - |
| Resources\Test1\02-Output\OutputExamples.hs; labelledCube | labelledCube :: Integer -> String | C03/output; C03/lab-01; C03/Q | exam depth | - |
| Resources\Test1\02-Output\OutputExamplesTest.hs; assertion "cube 3" | Predict/check: cube 3 | C03/output; C03/lab-01; C03/Q; C10/errors-and-testing | exam depth | - |
| Resources\Test1\02-Output\OutputExamplesTest.hs; assertion "negative cube" | Predict/check: negative cube | C03/output; C03/lab-01; C03/Q; C10/errors-and-testing | exam depth | - |
| Resources\Test1\02-Output\OutputExamplesTest.hs; assertion "label" | Predict/check: label | C03/output; C03/lab-01; C03/Q; C10/errors-and-testing | exam depth | - |
| Resources\Test1\02-Output\PrintVsPutApp.hs; main | Trace a complete application | C03/output; C03/lab-01; C03/Q; C03/complete-program | exam depth | - |
| Resources\Test1\02-Output\PrintVsPutExpected.txt; complete transcript | Predict exact values, quotes, lines and errors | C03/output; C03/lab-01; C03/Q | exam depth | - |
| Resources\Test1\02-Output\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |

#### 03-Values-And-Types

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\03-Values-And-Types\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C02/values-text; C02/expressions-types; C02/Q | exam depth | - |
| Resources\Test1\03-Values-And-Types\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |
| Resources\Test1\03-Values-And-Types\ValuesAndTypes.hs; courseCode | courseCode :: String | C02/values-text; C02/expressions-types; C02/Q | exam depth | - |
| Resources\Test1\03-Values-And-Types\ValuesAndTypes.hs; passingMark | passingMark :: Double | C02/values-text; C02/expressions-types; C02/Q | exam depth | - |
| Resources\Test1\03-Values-And-Types\ValuesAndTypes.hs; initial | initial :: Char | C02/values-text; C02/expressions-types; C02/Q | exam depth | - |
| Resources\Test1\03-Values-And-Types\ValuesAndTypes.hs; active | active :: Bool | C02/values-text; C02/expressions-types; C02/Q | exam depth | - |
| Resources\Test1\03-Values-And-Types\ValuesAndTypes.hs; student | student :: (String, Integer, Bool) | C02/values-text; C02/expressions-types; C02/Q | exam depth | - |
| Resources\Test1\03-Values-And-Types\ValuesAndTypesApp.hs; main | Trace a complete application | C02/values-text; C02/expressions-types; C02/Q; C03/complete-program | exam depth | - |
| Resources\Test1\03-Values-And-Types\ValuesAndTypesTest.hs; assertion "course code" | Predict/check: course code | C02/values-text; C02/expressions-types; C02/Q; C10/errors-and-testing | exam depth | - |
| Resources\Test1\03-Values-And-Types\ValuesAndTypesTest.hs; assertion "character differs from string" | Predict/check: character differs from string | C02/values-text; C02/expressions-types; C02/Q; C10/errors-and-testing | exam depth | - |
| Resources\Test1\03-Values-And-Types\ValuesAndTypesTest.hs; assertion "student active" | Predict/check: student active | C02/values-text; C02/expressions-types; C02/Q; C10/errors-and-testing | exam depth | - |

#### 04-Arithmetic

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\04-Arithmetic\Arithmetic.hs; rectangleArea | rectangleArea :: Double -> Double -> Double | C02/expressions-types; C09/standard-classes | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\Arithmetic.hs; celsiusToFahrenheit | celsiusToFahrenheit :: Double -> Double | C02/expressions-types; C09/standard-classes | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\Arithmetic.hs; quotientAndRemainder | quotientAndRemainder :: Integer -> Integer -> (Integer, Integer) | C02/expressions-types; C09/standard-classes | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\Arithmetic.hs; squareByAdding | squareByAdding :: Integer -> Integer | C02/expressions-types; C09/standard-classes | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\Arithmetic.hs; squareByPower | squareByPower :: Integer -> Integer | C02/expressions-types; C09/standard-classes | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\Arithmetic.hs; integerPower | integerPower :: Integer -> Integer -> Integer | C02/expressions-types; C09/standard-classes | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\Arithmetic.hs; fractionalPower | fractionalPower :: Double -> Integer -> Double | C02/expressions-types; C09/standard-classes | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\Arithmetic.hs; floatingPower | floatingPower :: Double -> Double -> Double | C02/expressions-types; C09/standard-classes | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\ArithmeticApp.hs; main | Trace a complete application | C02/expressions-types; C09/standard-classes; C03/complete-program | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\ArithmeticTest.hs; assertion "rectangle area" | Predict/check: rectangle area | C02/expressions-types; C09/standard-classes; C10/errors-and-testing | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\ArithmeticTest.hs; assertion "freezing point" | Predict/check: freezing point | C02/expressions-types; C09/standard-classes; C10/errors-and-testing | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\ArithmeticTest.hs; assertion "division pair" | Predict/check: division pair | C02/expressions-types; C09/standard-classes; C10/errors-and-testing | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\ArithmeticTest.hs; assertion "square by adding matches n*n" | Predict/check: square by adding matches n*n | C02/expressions-types; C09/standard-classes; C10/errors-and-testing | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\ArithmeticTest.hs; assertion "square by adding matches square by power" | Predict/check: square by adding matches square by power | C02/expressions-types; C09/standard-classes; C10/errors-and-testing | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\ArithmeticTest.hs; assertion "integerPower 2 10" | Predict/check: integerPower 2 10 | C02/expressions-types; C09/standard-classes; C10/errors-and-testing | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\ArithmeticTest.hs; assertion "fractionalPower 2.0 (-3)" | Predict/check: fractionalPower 2.0 (-3) | C02/expressions-types; C09/standard-classes; C10/errors-and-testing | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\ArithmeticTest.hs; assertion "floatingPower 2.0 0.5" | Predict/check: floatingPower 2.0 0.5 | C02/expressions-types; C09/standard-classes; C10/errors-and-testing | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C02/expressions-types; C09/standard-classes | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\ExponentsApp.hs; main | Trace a complete application | C02/expressions-types; C09/standard-classes; C03/complete-program | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\ExponentsExpected.txt; complete transcript | Predict exact values, quotes, lines and errors | C02/expressions-types; C09/standard-classes | explained | Operator selection and signed cases need variations: V1 |
| Resources\Test1\04-Arithmetic\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |

#### 05-Functions

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\05-Functions\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C03/defining-functions; C03/Q | explained | Develop and check more specifications: V2, V13 |
| Resources\Test1\05-Functions\FunctionPracticeApp.hs; main | Trace a complete application | C03/defining-functions; C03/Q; C03/complete-program | explained | Develop and check more specifications: V2, V13 |
| Resources\Test1\05-Functions\Functions.hs; cube | cube :: Integer -> Integer | C03/defining-functions; C03/Q | explained | Develop and check more specifications: V2, V13 |
| Resources\Test1\05-Functions\Functions.hs; isNegative | isNegative :: Integer -> Bool | C03/defining-functions; C03/Q | explained | Develop and check more specifications: V2, V13 |
| Resources\Test1\05-Functions\Functions.hs; power | power :: Integer -> Integer -> Integer | C03/defining-functions; C03/Q | explained | Develop and check more specifications: V2, V13 |
| Resources\Test1\05-Functions\Functions.hs; addAndDifference | addAndDifference :: Integer -> Integer -> (Integer, Integer) | C03/defining-functions; C03/Q | explained | Develop and check more specifications: V2, V13 |
| Resources\Test1\05-Functions\Functions.hs; finalPrice | finalPrice :: Double -> Double -> Double | C03/defining-functions; C03/Q | explained | Develop and check more specifications: V2, V13 |
| Resources\Test1\05-Functions\FunctionsTest.hs; assertion "cube" | Predict/check: cube | C03/defining-functions; C03/Q; C10/errors-and-testing | explained | Develop and check more specifications: V2, V13 |
| Resources\Test1\05-Functions\FunctionsTest.hs; assertion "negative boundary" | Predict/check: negative boundary | C03/defining-functions; C03/Q; C10/errors-and-testing | explained | Develop and check more specifications: V2, V13 |
| Resources\Test1\05-Functions\FunctionsTest.hs; assertion "power zero" | Predict/check: power zero | C03/defining-functions; C03/Q; C10/errors-and-testing | explained | Develop and check more specifications: V2, V13 |
| Resources\Test1\05-Functions\FunctionsTest.hs; assertion "sum and difference" | Predict/check: sum and difference | C03/defining-functions; C03/Q; C10/errors-and-testing | explained | Develop and check more specifications: V2, V13 |
| Resources\Test1\05-Functions\FunctionsTest.hs; assertion "discount" | Predict/check: discount | C03/defining-functions; C03/Q; C10/errors-and-testing | explained | Develop and check more specifications: V2, V13 |
| Resources\Test1\05-Functions\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |

#### 06-Choices

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\06-Choices\Choices.hs; isEvenMessage | isEvenMessage :: Integer -> String | C04/lab-02; C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Resources\Test1\06-Choices\Choices.hs; bothEven | bothEven :: Integer -> Integer -> Integer | C04/lab-02; C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Resources\Test1\06-Choices\Choices.hs; isDivMessage | isDivMessage :: Integer -> Integer -> String | C04/lab-02; C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Resources\Test1\06-Choices\Choices.hs; grade | grade :: Integer -> String | C04/lab-02; C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Resources\Test1\06-Choices\Choices.hs; isEvenIf | isEvenIf :: Integer -> String | C04/lab-02; C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Resources\Test1\06-Choices\Choices.hs; isEvenGuards | isEvenGuards :: Integer -> String | C04/lab-02; C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Resources\Test1\06-Choices\Choices.hs; isEvenPattern | isEvenPattern :: Integer -> String | C04/lab-02; C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Resources\Test1\06-Choices\Choices.hs; isEvenCase | isEvenCase :: Integer -> String | C04/lab-02; C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Resources\Test1\06-Choices\ChoicesApp.hs; main | Trace a complete application | C04/lab-02; C04/case-by-example; C04/case-exam-practice; C03/complete-program | explained | mapM_ output traversal: V10 |
| Resources\Test1\06-Choices\ChoicesTest.hs; assertion "even" | Predict/check: even | C04/lab-02; C04/case-by-example; C04/case-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\06-Choices\ChoicesTest.hs; assertion "both even" | Predict/check: both even | C04/lab-02; C04/case-by-example; C04/case-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\06-Choices\ChoicesTest.hs; assertion "one even" | Predict/check: one even | C04/lab-02; C04/case-by-example; C04/case-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\06-Choices\ChoicesTest.hs; assertion "neither even" | Predict/check: neither even | C04/lab-02; C04/case-by-example; C04/case-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\06-Choices\ChoicesTest.hs; assertion "divisible" | Predict/check: divisible | C04/lab-02; C04/case-by-example; C04/case-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\06-Choices\ChoicesTest.hs; assertion "equal before division" | Predict/check: equal before division | C04/lab-02; C04/case-by-example; C04/case-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\06-Choices\ChoicesTest.hs; assertion "grade boundary" | Predict/check: grade boundary | C04/lab-02; C04/case-by-example; C04/case-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\06-Choices\ChoicesTest.hs; assertion "invalid mark" | Predict/check: invalid mark | C04/lab-02; C04/case-by-example; C04/case-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\06-Choices\ChoicesTest.hs; assertion "if style, even" | Predict/check: if style, even | C04/lab-02; C04/case-by-example; C04/case-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\06-Choices\ChoicesTest.hs; assertion "if style, odd" | Predict/check: if style, odd | C04/lab-02; C04/case-by-example; C04/case-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\06-Choices\ChoicesTest.hs; assertion "styles agree, even" | Predict/check: styles agree, even | C04/lab-02; C04/case-by-example; C04/case-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\06-Choices\ChoicesTest.hs; assertion "styles agree, odd" | Predict/check: styles agree, odd | C04/lab-02; C04/case-by-example; C04/case-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\06-Choices\ChoicesTest.hs; assertion "styles agree, zero" | Predict/check: styles agree, zero | C04/lab-02; C04/case-by-example; C04/case-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\06-Choices\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C04/lab-02; C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Resources\Test1\06-Choices\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |

#### 07-Patterns

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\07-Patterns\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C04/pattern-matching; C04/case-by-example; C03/where-and-local-definitions | exam depth | - |
| Resources\Test1\07-Patterns\Patterns.hs; isVowel | isVowel :: Char -> Bool | C04/pattern-matching; C04/case-by-example; C03/where-and-local-definitions | exam depth | - |
| Resources\Test1\07-Patterns\Patterns.hs; dayName | dayName :: Integer -> Maybe String | C04/pattern-matching; C04/case-by-example; C03/where-and-local-definitions | exam depth | - |
| Resources\Test1\07-Patterns\Patterns.hs; describeList | describeList :: [a] -> String | C04/pattern-matching; C04/case-by-example; C03/where-and-local-definitions | exam depth | - |
| Resources\Test1\07-Patterns\Patterns.hs; swapPair | swapPair :: (a, b) -> (b, a) | C04/pattern-matching; C04/case-by-example; C03/where-and-local-definitions | exam depth | - |
| Resources\Test1\07-Patterns\Patterns.hs; signLabel | signLabel :: Integer -> String | C04/pattern-matching; C04/case-by-example; C03/where-and-local-definitions | exam depth | - |
| Resources\Test1\07-Patterns\PatternsApp.hs; main | Trace a complete application | C04/pattern-matching; C04/case-by-example; C03/where-and-local-definitions; C03/complete-program | exam depth | - |
| Resources\Test1\07-Patterns\PatternsTest.hs; assertion "uppercase vowel" | Predict/check: uppercase vowel | C04/pattern-matching; C04/case-by-example; C03/where-and-local-definitions; C10/errors-and-testing | exam depth | - |
| Resources\Test1\07-Patterns\PatternsTest.hs; assertion "consonant" | Predict/check: consonant | C04/pattern-matching; C04/case-by-example; C03/where-and-local-definitions; C10/errors-and-testing | exam depth | - |
| Resources\Test1\07-Patterns\PatternsTest.hs; assertion "valid day" | Predict/check: valid day | C04/pattern-matching; C04/case-by-example; C03/where-and-local-definitions; C10/errors-and-testing | exam depth | - |
| Resources\Test1\07-Patterns\PatternsTest.hs; assertion "invalid day" | Predict/check: invalid day | C04/pattern-matching; C04/case-by-example; C03/where-and-local-definitions; C10/errors-and-testing | exam depth | - |
| Resources\Test1\07-Patterns\PatternsTest.hs; assertion "empty list" | Predict/check: empty list | C04/pattern-matching; C04/case-by-example; C03/where-and-local-definitions; C10/errors-and-testing | exam depth | - |
| Resources\Test1\07-Patterns\PatternsTest.hs; assertion "swap" | Predict/check: swap | C04/pattern-matching; C04/case-by-example; C03/where-and-local-definitions; C10/errors-and-testing | exam depth | - |
| Resources\Test1\07-Patterns\PatternsTest.hs; assertion "zero sign" | Predict/check: zero sign | C04/pattern-matching; C04/case-by-example; C03/where-and-local-definitions; C10/errors-and-testing | exam depth | - |
| Resources\Test1\07-Patterns\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |

#### 08-Lists-And-Tuples

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\08-Lists-And-Tuples\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C06/lab-03; C06/tuples; C09/maybe-in-depth; C09/either-in-depth | exam depth | - |
| Resources\Test1\08-Lists-And-Tuples\ListsAndTuples.hs; safeHead | safeHead :: [a] -> Maybe a | C06/lab-03; C06/tuples; C09/maybe-in-depth; C09/either-in-depth | exam depth | - |
| Resources\Test1\08-Lists-And-Tuples\ListsAndTuples.hs; atPosition | atPosition :: [a] -> Int -> Either String (Int, a) | C06/lab-03; C06/tuples; C09/maybe-in-depth; C09/either-in-depth | exam depth | - |
| Resources\Test1\08-Lists-And-Tuples\ListsAndTuples.hs; initials | initials :: (String, String) -> Maybe String | C06/lab-03; C06/tuples; C09/maybe-in-depth; C09/either-in-depth | exam depth | - |
| Resources\Test1\08-Lists-And-Tuples\ListsAndTuples.hs; listFacts | listFacts :: [a] -> (Bool, Int) | C06/lab-03; C06/tuples; C09/maybe-in-depth; C09/either-in-depth | exam depth | - |
| Resources\Test1\08-Lists-And-Tuples\ListsAndTuplesApp.hs; main | Trace a complete application | C06/lab-03; C06/tuples; C09/maybe-in-depth; C09/either-in-depth; C03/complete-program | exam depth | - |
| Resources\Test1\08-Lists-And-Tuples\ListsAndTuplesTest.hs; assertion "safe head" | Predict/check: safe head | C06/lab-03; C06/tuples; C09/maybe-in-depth; C09/either-in-depth; C10/errors-and-testing | exam depth | - |
| Resources\Test1\08-Lists-And-Tuples\ListsAndTuplesTest.hs; assertion "empty head" | Predict/check: empty head | C06/lab-03; C06/tuples; C09/maybe-in-depth; C09/either-in-depth; C10/errors-and-testing | exam depth | - |
| Resources\Test1\08-Lists-And-Tuples\ListsAndTuplesTest.hs; assertion "Lab 3 position" | Predict/check: Lab 3 position | C06/lab-03; C06/tuples; C09/maybe-in-depth; C09/either-in-depth; C10/errors-and-testing | exam depth | - |
| Resources\Test1\08-Lists-And-Tuples\ListsAndTuplesTest.hs; assertion "negative position" | Predict/check: negative position | C06/lab-03; C06/tuples; C09/maybe-in-depth; C09/either-in-depth; C10/errors-and-testing | exam depth | - |
| Resources\Test1\08-Lists-And-Tuples\ListsAndTuplesTest.hs; assertion "initials" | Predict/check: initials | C06/lab-03; C06/tuples; C09/maybe-in-depth; C09/either-in-depth; C10/errors-and-testing | exam depth | - |
| Resources\Test1\08-Lists-And-Tuples\ListsAndTuplesTest.hs; assertion "missing initial" | Predict/check: missing initial | C06/lab-03; C06/tuples; C09/maybe-in-depth; C09/either-in-depth; C10/errors-and-testing | exam depth | - |
| Resources\Test1\08-Lists-And-Tuples\ListsAndTuplesTest.hs; assertion "list facts" | Predict/check: list facts | C06/lab-03; C06/tuples; C09/maybe-in-depth; C09/either-in-depth; C10/errors-and-testing | exam depth | - |
| Resources\Test1\08-Lists-And-Tuples\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |

#### 09-Recursion

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\09-Recursion\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |
| Resources\Test1\09-Recursion\Recursion.hs; factorial | factorial :: Integer -> Either String Integer | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\Recursion.hs; recursiveSum | recursiveSum :: Integer -> Either String Integer | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\Recursion.hs; multiply | multiply :: Integer -> Integer -> Integer | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\Recursion.hs; fibonacci | fibonacci :: Integer -> Either String Integer | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion | explained | Recursive Either with <*> is not taught: V2, V11 |
| Resources\Test1\09-Recursion\Recursion.hs; sumEvens | sumEvens :: [Integer] -> Integer | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion | explained | Complete recursive design and boundary variations: V3 |
| Resources\Test1\09-Recursion\Recursion.hs; multList | multList :: Integer -> [Integer] -> [Integer] | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion | explained | Complete recursive design and boundary variations: V3 |
| Resources\Test1\09-Recursion\RecursionApp.hs; main | Trace a complete application | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion; C03/complete-program | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\RecursionTest.hs; assertion "factorial base" | Predict/check: factorial base | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion; C10/errors-and-testing | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\RecursionTest.hs; assertion "factorial five" | Predict/check: factorial five | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion; C10/errors-and-testing | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\RecursionTest.hs; assertion "factorial invalid" | Predict/check: factorial invalid | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion; C10/errors-and-testing | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\RecursionTest.hs; assertion "sum" | Predict/check: sum | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion; C10/errors-and-testing | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\RecursionTest.hs; assertion "positive multiply" | Predict/check: positive multiply | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion; C10/errors-and-testing | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\RecursionTest.hs; assertion "negative multiply" | Predict/check: negative multiply | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion; C10/errors-and-testing | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\RecursionTest.hs; assertion "fibonacci" | Predict/check: fibonacci | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion; C10/errors-and-testing | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\RecursionTest.hs; assertion "Lab 2 sums of evens" | Predict/check: Lab 2 sums of evens | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion; C10/errors-and-testing | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\RecursionTest.hs; assertion "sums with no evens" | Predict/check: sums with no evens | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion; C10/errors-and-testing | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\RecursionTest.hs; assertion "sums of empty list" | Predict/check: sums of empty list | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion; C10/errors-and-testing | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\RecursionTest.hs; assertion "Lab 2 MultList" | Predict/check: Lab 2 MultList | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion; C10/errors-and-testing | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\RecursionTest.hs; assertion "MultList negative factor" | Predict/check: MultList negative factor | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion; C10/errors-and-testing | explained | Full design variations, not only familiar traces: V2 |
| Resources\Test1\09-Recursion\RecursionTest.hs; assertion "MultList empty list" | Predict/check: MultList empty list | C05/writing-recursive-functions; C05/dry-running; C06/list-recursion; C10/errors-and-testing | explained | Full design variations, not only familiar traces: V2 |

#### 10-List-Processing

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\10-List-Processing\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C06/lab-03; C06/comprehension-exam-practice | exam depth | - |
| Resources\Test1\10-List-Processing\ListProcessing.hs; largerY | largerY :: [Integer] -> Integer -> [Integer] | C06/lab-03; C06/comprehension-exam-practice | explained | Lab answer lacks three worked variations: V3 |
| Resources\Test1\10-List-Processing\ListProcessing.hs; positiveNumbers | positiveNumbers :: [Integer] -> [Integer] | C06/lab-03; C06/comprehension-exam-practice | explained | Lab answer lacks three worked variations: V3 |
| Resources\Test1\10-List-Processing\ListProcessing.hs; isSortedDesc | isSortedDesc :: Ord a => [a] -> Bool | C06/lab-03; C06/comprehension-exam-practice | explained | Lab answer lacks three worked variations: V3 |
| Resources\Test1\10-List-Processing\ListProcessing.hs; countChar | countChar :: Char -> String -> Int | C06/lab-03; C06/comprehension-exam-practice | exam depth | - |
| Resources\Test1\10-List-Processing\ListProcessing.hs; factorList | factorList :: Integer -> [Integer] | C06/lab-03; C06/comprehension-exam-practice | exam depth | - |
| Resources\Test1\10-List-Processing\ListProcessing.hs; longNames | longNames :: Int -> [String] -> [String] | C06/lab-03; C06/comprehension-exam-practice | exam depth | - |
| Resources\Test1\10-List-Processing\ListProcessingApp.hs; main | Trace a complete application | C06/lab-03; C06/comprehension-exam-practice; C03/complete-program | exam depth | - |
| Resources\Test1\10-List-Processing\ListProcessingTest.hs; assertion "Lab 3 largerY" | Predict/check: Lab 3 largerY | C06/lab-03; C06/comprehension-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\10-List-Processing\ListProcessingTest.hs; assertion "positive values" | Predict/check: positive values | C06/lab-03; C06/comprehension-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\10-List-Processing\ListProcessingTest.hs; assertion "empty positives" | Predict/check: empty positives | C06/lab-03; C06/comprehension-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\10-List-Processing\ListProcessingTest.hs; assertion "descending" | Predict/check: descending | C06/lab-03; C06/comprehension-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\10-List-Processing\ListProcessingTest.hs; assertion "unsorted" | Predict/check: unsorted | C06/lab-03; C06/comprehension-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\10-List-Processing\ListProcessingTest.hs; assertion "empty sorted" | Predict/check: empty sorted | C06/lab-03; C06/comprehension-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\10-List-Processing\ListProcessingTest.hs; assertion "character count" | Predict/check: character count | C06/lab-03; C06/comprehension-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\10-List-Processing\ListProcessingTest.hs; assertion "factors" | Predict/check: factors | C06/lab-03; C06/comprehension-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\10-List-Processing\ListProcessingTest.hs; assertion "Lab 2 long names" | Predict/check: Lab 2 long names | C06/lab-03; C06/comprehension-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\10-List-Processing\ListProcessingTest.hs; assertion "no names long enough" | Predict/check: no names long enough | C06/lab-03; C06/comprehension-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\10-List-Processing\ListProcessingTest.hs; assertion "long names on empty list" | Predict/check: long names on empty list | C06/lab-03; C06/comprehension-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\10-List-Processing\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |

#### 11-Higher-Order-Functions

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\11-Higher-Order-Functions\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrder.hs; odds | odds :: Int -> [Int] | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrder.hs; selectSquares | selectSquares :: [Integer] -> [Integer] | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrder.hs; totalEvenSquares | totalEvenSquares :: [Integer] -> Integer | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrder.hs; applyTwice | applyTwice :: (a -> a) -> a -> a | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrder.hs; addTax | addTax :: Double -> Double -> Double | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrder.hs; curriedAdd | curriedAdd :: Integer -> Integer -> Integer | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrder.hs; uncurriedAdd | uncurriedAdd :: (Integer, Integer) -> Integer | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrder.hs; addTuple | addTuple :: (Integer, Integer) -> Integer | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrder.hs; addCurried | addCurried :: Integer -> Integer -> Integer | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrder.hs; process | process :: [Integer] -> [Integer] | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrder.hs; process' | process' :: [Integer] -> [Integer] | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrderApp.hs; main | Trace a complete application | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections; C03/complete-program | explained | printf formatting is incidental, not taught: V10 |
| Resources\Test1\11-Higher-Order-Functions\HigherOrderTest.hs; assertion "odd numbers" | Predict/check: odd numbers | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections; C10/errors-and-testing | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrderTest.hs; assertion "even squares" | Predict/check: even squares | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections; C10/errors-and-testing | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrderTest.hs; assertion "folded result" | Predict/check: folded result | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections; C10/errors-and-testing | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrderTest.hs; assertion "apply twice" | Predict/check: apply twice | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections; C10/errors-and-testing | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrderTest.hs; assertion "section returns function" | Predict/check: section returns function | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections; C10/errors-and-testing | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrderTest.hs; assertion "uncurry addition" | Predict/check: uncurry addition | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections; C10/errors-and-testing | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrderTest.hs; assertion "curry addition" | Predict/check: curry addition | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections; C10/errors-and-testing | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrderTest.hs; assertion "uncurry over a list of pairs" | Predict/check: uncurry over a list of pairs | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections; C10/errors-and-testing | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrderTest.hs; assertion "named and point-free agree" | Predict/check: named and point-free agree | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections; C10/errors-and-testing | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\HigherOrderTest.hs; assertion "point-free pipeline result" | Predict/check: point-free pipeline result | C07/applying-by-hand; C07/more-higher-order-functions; C07/currying-and-sections; C10/errors-and-testing | exam depth | - |
| Resources\Test1\11-Higher-Order-Functions\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |

#### 12-Modules

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\12-Modules\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C08/modules; C08/imports | explained | Module construction and export practice: V6 |
| Resources\Test1\12-Modules\Geometry.hs; rectangleArea | rectangleArea :: Double -> Double -> Double | C08/modules; C08/imports | explained | Module construction and export practice: V6 |
| Resources\Test1\12-Modules\Geometry.hs; circleArea | circleArea :: Double -> Double | C08/modules; C08/imports | explained | Module construction and export practice: V6 |
| Resources\Test1\12-Modules\ModulesApp.hs; main | Trace a complete application | C08/modules; C08/imports; C03/complete-program | explained | Module construction and export practice: V6 |
| Resources\Test1\12-Modules\ModulesTest.hs; assertion "rectangle" | Predict/check: rectangle | C08/modules; C08/imports; C10/errors-and-testing | explained | Module construction and export practice: V6 |
| Resources\Test1\12-Modules\ModulesTest.hs; assertion "circle" | Predict/check: circle | C08/modules; C08/imports; C10/errors-and-testing | explained | Module construction and export practice: V6 |
| Resources\Test1\12-Modules\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |

#### 13-Custom-Data-Types

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\13-Custom-Data-Types\CustomTypes.hs; area | area :: Shape -> Double | C08/data-types-by-example; C08/data-types-exam-practice; C08/type-synonyms | exam depth | - |
| Resources\Test1\13-Custom-Data-Types\CustomTypes.hs; resultFromMark | resultFromMark :: Double -> Result | C08/data-types-by-example; C08/data-types-exam-practice; C08/type-synonyms | exam depth | - |
| Resources\Test1\13-Custom-Data-Types\CustomTypes.hs; courseCode | courseCode :: Course -> String | C08/data-types-by-example; C08/data-types-exam-practice; C08/type-synonyms | explained | Expand and use aliases in varied questions: V5 |
| Resources\Test1\13-Custom-Data-Types\CustomTypes.hs; declaration Course | Declaration and representation of Course | C08/data-types-by-example; C08/data-types-exam-practice; C08/type-synonyms | explained | Expand and use aliases in varied questions: V5 |
| Resources\Test1\13-Custom-Data-Types\CustomTypes.hs; declaration Result | Declaration and representation of Result | C08/data-types-by-example; C08/data-types-exam-practice; C08/type-synonyms | exam depth | - |
| Resources\Test1\13-Custom-Data-Types\CustomTypes.hs; declaration Shape | Declaration and representation of Shape | C08/data-types-by-example; C08/data-types-exam-practice; C08/type-synonyms | exam depth | - |
| Resources\Test1\13-Custom-Data-Types\CustomTypesApp.hs; main | Trace a complete application | C08/data-types-by-example; C08/data-types-exam-practice; C08/type-synonyms; C03/complete-program | exam depth | - |
| Resources\Test1\13-Custom-Data-Types\CustomTypesTest.hs; assertion "circle" | Predict/check: circle | C08/data-types-by-example; C08/data-types-exam-practice; C08/type-synonyms; C10/errors-and-testing | exam depth | - |
| Resources\Test1\13-Custom-Data-Types\CustomTypesTest.hs; assertion "rectangle" | Predict/check: rectangle | C08/data-types-by-example; C08/data-types-exam-practice; C08/type-synonyms; C10/errors-and-testing | exam depth | - |
| Resources\Test1\13-Custom-Data-Types\CustomTypesTest.hs; assertion "pass boundary" | Predict/check: pass boundary | C08/data-types-by-example; C08/data-types-exam-practice; C08/type-synonyms; C10/errors-and-testing | exam depth | - |
| Resources\Test1\13-Custom-Data-Types\CustomTypesTest.hs; assertion "fail" | Predict/check: fail | C08/data-types-by-example; C08/data-types-exam-practice; C08/type-synonyms; C10/errors-and-testing | exam depth | - |
| Resources\Test1\13-Custom-Data-Types\CustomTypesTest.hs; assertion "course projection" | Predict/check: course projection | C08/data-types-by-example; C08/data-types-exam-practice; C08/type-synonyms; C10/errors-and-testing | exam depth | - |
| Resources\Test1\13-Custom-Data-Types\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C08/data-types-by-example; C08/data-types-exam-practice; C08/type-synonyms | exam depth | - |
| Resources\Test1\13-Custom-Data-Types\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |

#### 14-Input-And-Output

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\14-Input-And-Output\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C03/input-processing; C09/maybe-either-exam-practice | exam depth | - |
| Resources\Test1\14-Input-And-Output\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |
| Resources\Test1\14-Input-And-Output\StudentResult.hs; parseMark | parseMark :: String -> Either String Double | C03/input-processing; C09/maybe-either-exam-practice | exam depth | - |
| Resources\Test1\14-Input-And-Output\StudentResult.hs; resultLine | resultLine :: String -> Double -> String | C03/input-processing; C09/maybe-either-exam-practice | exam depth | - |
| Resources\Test1\14-Input-And-Output\StudentResult.hs; parseNumber | parseNumber :: String -> Either String Double | C03/input-processing; C09/maybe-either-exam-practice | exam depth | - |
| Resources\Test1\14-Input-And-Output\StudentResult.hs; addTwoInputs | addTwoInputs :: String -> String -> Either String Double | C03/input-processing; C09/maybe-either-exam-practice | exam depth | - |
| Resources\Test1\14-Input-And-Output\StudentResultApp.hs; main | Trace a complete application with prompted input | C03/input-processing; C09/maybe-either-exam-practice; C03/complete-program | exam depth | - |
| Resources\Test1\14-Input-And-Output\StudentResultTest.hs; assertion "parse number" | Predict/check: parse number | C03/input-processing; C09/maybe-either-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\14-Input-And-Output\StudentResultTest.hs; assertion "reject text" | Predict/check: reject text | C03/input-processing; C09/maybe-either-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\14-Input-And-Output\StudentResultTest.hs; assertion "reject range" | Predict/check: reject range | C03/input-processing; C09/maybe-either-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\14-Input-And-Output\StudentResultTest.hs; assertion "pass line" | Predict/check: pass line | C03/input-processing; C09/maybe-either-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\14-Input-And-Output\StudentResultTest.hs; assertion "fail line" | Predict/check: fail line | C03/input-processing; C09/maybe-either-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\14-Input-And-Output\StudentResultTest.hs; assertion "add two valid numbers" | Predict/check: add two valid numbers | C03/input-processing; C09/maybe-either-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\14-Input-And-Output\StudentResultTest.hs; assertion "first value invalid" | Predict/check: first value invalid | C03/input-processing; C09/maybe-either-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\14-Input-And-Output\StudentResultTest.hs; assertion "second value invalid" | Predict/check: second value invalid | C03/input-processing; C09/maybe-either-exam-practice; C10/errors-and-testing | exam depth | - |
| Resources\Test1\14-Input-And-Output\TwoNumberSumApp.hs; main | Trace a complete application with prompted input | C03/input-processing; C09/maybe-either-exam-practice; C03/complete-program | exam depth | - |
| Resources\Test1\14-Input-And-Output\TwoNumberSumExpected.txt; complete transcript | Predict exact values, quotes, lines and errors | C03/input-processing; C09/maybe-either-exam-practice | exam depth | - |
| Resources\Test1\14-Input-And-Output\TwoNumberSumExpectedError.txt; complete transcript | Predict exact values, quotes, lines and errors | C03/input-processing; C09/maybe-either-exam-practice | exam depth | - |

#### 15-Reasoning-And-Complexity

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\15-Reasoning-And-Complexity\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C10/proofs-of-programs-i; C10/proof-patterns; C10/complexity | exam depth | - |
| Resources\Test1\15-Reasoning-And-Complexity\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |
| Resources\Test1\15-Reasoning-And-Complexity\Reasoning.hs; sumRec | sumRec :: [Integer] -> Integer | C10/proofs-of-programs-i; C10/proof-patterns; C10/complexity | exam depth | - |
| Resources\Test1\15-Reasoning-And-Complexity\Reasoning.hs; lengthRec | lengthRec :: [a] -> Int | C10/proofs-of-programs-i; C10/proof-patterns; C10/complexity | exam depth | - |
| Resources\Test1\15-Reasoning-And-Complexity\Reasoning.hs; reverseSlow | reverseSlow :: [a] -> [a] | C10/proofs-of-programs-i; C10/proof-patterns; C10/complexity | explained | Correctness proof covered; cost derivation needs depth: V12 |
| Resources\Test1\15-Reasoning-And-Complexity\Reasoning.hs; reverseFast | reverseFast :: [a] -> [a] | C10/proofs-of-programs-i; C10/proof-patterns; C10/complexity | explained | Correctness proof covered; cost derivation needs depth: V12 |
| Resources\Test1\15-Reasoning-And-Complexity\ReasoningApp.hs; main | Trace a complete application | C10/proofs-of-programs-i; C10/proof-patterns; C10/complexity; C03/complete-program | exam depth | - |
| Resources\Test1\15-Reasoning-And-Complexity\ReasoningTest.hs; assertion "recursive sum" | Predict/check: recursive sum | C10/proofs-of-programs-i; C10/proof-patterns; C10/complexity; C10/errors-and-testing | exam depth | - |
| Resources\Test1\15-Reasoning-And-Complexity\ReasoningTest.hs; assertion "recursive length" | Predict/check: recursive length | C10/proofs-of-programs-i; C10/proof-patterns; C10/complexity; C10/errors-and-testing | exam depth | - |
| Resources\Test1\15-Reasoning-And-Complexity\ReasoningTest.hs; assertion "slow reverse result" | Predict/check: slow reverse result | C10/proofs-of-programs-i; C10/proof-patterns; C10/complexity; C10/errors-and-testing | exam depth | - |
| Resources\Test1\15-Reasoning-And-Complexity\ReasoningTest.hs; assertion "fast reverse result" | Predict/check: fast reverse result | C10/proofs-of-programs-i; C10/proof-patterns; C10/complexity; C10/errors-and-testing | exam depth | - |
| Resources\Test1\15-Reasoning-And-Complexity\ReasoningTest.hs; assertion "implementations agree" | Predict/check: implementations agree | C10/proofs-of-programs-i; C10/proof-patterns; C10/complexity; C10/errors-and-testing | exam depth | - |

#### 16-Capstone

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources\Test1\16-Capstone\expected-output.txt; complete transcript | Predict exact values, quotes, lines and errors | C08/data-types-exam-practice; C09/maybe-either-exam-practice; C06/comprehension-exam-practice | explained | Integrated grade-book task and policy choices: V14 |
| Resources\Test1\16-Capstone\GradeBook.hs; average | average :: [Double] -> Maybe Double | C08/data-types-exam-practice; C09/maybe-either-exam-practice; C06/comprehension-exam-practice | explained | Integrated grade-book task and policy choices: V14 |
| Resources\Test1\16-Capstone\GradeBook.hs; outcome | outcome :: Double -> String | C08/data-types-exam-practice; C09/maybe-either-exam-practice; C06/comprehension-exam-practice | explained | Integrated grade-book task and policy choices: V14 |
| Resources\Test1\16-Capstone\GradeBook.hs; summary | summary :: Student -> String | C08/data-types-exam-practice; C09/maybe-either-exam-practice; C06/comprehension-exam-practice | explained | Integrated grade-book task and policy choices: V14 |
| Resources\Test1\16-Capstone\GradeBook.hs; classAverage | classAverage :: [Student] -> Maybe Double | C08/data-types-exam-practice; C09/maybe-either-exam-practice; C06/comprehension-exam-practice | explained | Integrated grade-book task and policy choices: V14 |
| Resources\Test1\16-Capstone\GradeBook.hs; declaration Student | Declaration and representation of Student | C08/data-types-exam-practice; C09/maybe-either-exam-practice; C06/comprehension-exam-practice | explained | Integrated grade-book task and policy choices: V14 |
| Resources\Test1\16-Capstone\GradeBookApp.hs; main | Trace a complete application | C08/data-types-exam-practice; C09/maybe-either-exam-practice; C06/comprehension-exam-practice; C03/complete-program | explained | Integrated grade-book task and policy choices: V14 |
| Resources\Test1\16-Capstone\GradeBookTest.hs; assertion "empty average" | Predict/check: empty average | C08/data-types-exam-practice; C09/maybe-either-exam-practice; C06/comprehension-exam-practice; C10/errors-and-testing | explained | Integrated grade-book task and policy choices: V14 |
| Resources\Test1\16-Capstone\GradeBookTest.hs; assertion "simple average" | Predict/check: simple average | C08/data-types-exam-practice; C09/maybe-either-exam-practice; C06/comprehension-exam-practice; C10/errors-and-testing | explained | Integrated grade-book task and policy choices: V14 |
| Resources\Test1\16-Capstone\GradeBookTest.hs; assertion "distinction boundary" | Predict/check: distinction boundary | C08/data-types-exam-practice; C09/maybe-either-exam-practice; C06/comprehension-exam-practice; C10/errors-and-testing | explained | Integrated grade-book task and policy choices: V14 |
| Resources\Test1\16-Capstone\GradeBookTest.hs; assertion "pass boundary" | Predict/check: pass boundary | C08/data-types-exam-practice; C09/maybe-either-exam-practice; C06/comprehension-exam-practice; C10/errors-and-testing | explained | Integrated grade-book task and policy choices: V14 |
| Resources\Test1\16-Capstone\GradeBookTest.hs; assertion "empty summary" | Predict/check: empty summary | C08/data-types-exam-practice; C09/maybe-either-exam-practice; C06/comprehension-exam-practice; C10/errors-and-testing | explained | Integrated grade-book task and policy choices: V14 |
| Resources\Test1\16-Capstone\GradeBookTest.hs; assertion "class average" | Predict/check: class average | C08/data-types-exam-practice; C09/maybe-either-exam-practice; C06/comprehension-exam-practice; C10/errors-and-testing | explained | Integrated grade-book task and policy choices: V14 |
| Resources\Test1\16-Capstone\README.md; Run / Test | Run application and separate test module | C02/first-program; C08/modules; C10/errors-and-testing | explained | Separate test harness workflow: V6, V14 |

### Laboratory sheets: every numbered task and subpart

The two Lab 2s, two Lab 3s and the differently numbered archived downloads are distinct sources. A download labelled Lab 4 pattern matching does not answer the October Lab 4 fold questions.

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Labs/Lab 1.docx; Task 1 | Start GHCi; identify and explain Prelude prompt | C02/ghci | exam depth | - |
| Labs/Lab 1.docx; Task 2a | :help, :h, :? and command abbreviations | C02/ghci | exam depth | - |
| Labs/Lab 1.docx; Task 2b | :load, :type, :quit, :info | C02/ghci; C03/lab-01 | exam depth | - |
| Labs/Lab 1.docx; Task 3a | Predict 1+2*3+4, 400>200, 1/=1, True \|\| False | C02/ghci; C02/expressions-types | explained | More complete arithmetic and Boolean traces: V1 |
| Labs/Lab 1.docx; Task 3b | Repair 9 + -7 | C02/ghci; C02/expressions-types | exam depth | - |
| Labs/Lab 1.docx; Task 3c | Repair X == x and False \|\| true | C02/values-text; C03/lab-01 | exam depth | - |
| Labs/Lab 1.docx; Task 3d | Repair If 'A' > 'a' then True (case, missing else) | C02/ghci; C04/case-exam-practice | exam depth | - |
| Labs/Lab 1.docx; Task 3e | Build ((19+1)+5)*10 and evaluate | C02/expressions-types | explained | Expression construction practice: V1 |
| Labs/Lab 1.docx; Task 4a | cube: define, test varied inputs, infer type | C03/defining-functions; C09/polymorphism-by-example | explained | Full design variations: V2 |
| Labs/Lab 1.docx; Task 4b | isNegative with zero boundary | C03/defining-functions; C04/conditional-expressions | explained | Specification and boundary variants: V13 |
| Labs/Lab 1.docx; Task 4c | power x n and its most general type | C09/standard-classes; C09/polymorphism-by-example | explained | Exponent domains and alternatives: V1 |
| Labs/Lab 1.docx; Task 5a | Hello World, quoted expression, print Hello World | C03/output; C03/lab-01 | exam depth | - |
| Labs/Lab 1.docx; Task 5b | print string, Print string, putStrLn string | C03/output; C03/lab-01 | exam depth | - |
| Labs/Lab 2 Making Choices.docx; Task 1a | Specify isEven and the meaning of invalid input | C04/lab-02; C10/specification | explained | All Int values have parity; resolve contradictory requirement: V13 |
| Labs/Lab 2 Making Choices.docx; Task 1b | isEven with if/then/else | C04/lab-02; C04/case-exam-practice | exam depth | - |
| Labs/Lab 2 Making Choices.docx; Task 1c | isEven with guards | C04/lab-02; C04/case-exam-practice | exam depth | - |
| Labs/Lab 2 Making Choices.docx; Task 2a | bothEven specification and 0/1/2 outcomes | C04/lab-02; C04/case-by-example | exam depth | - |
| Labs/Lab 2 Making Choices.docx; Task 2b | bothEven with if and with guards | C04/lab-02; C04/case-exam-practice | exam depth | - |
| Labs/Lab 2 Making Choices.docx; Task 3a | isDiv specification; m<n, equality, zero divisor | C04/lab-02; C10/specification | explained | Explicit policy and guard-order variants: V13 |
| Labs/Lab 2 Making Choices.docx; Task 3b | isDiv using if | C04/lab-02; C04/conditional-expressions | explained | Three worked boundary variations: V13 |
| Labs/Lab 2 Making Choices.docx; Task 3c | isDiv using patterns on computed decisions | C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Labs/Lab 2 Making Choices.docx; Task 3d | isDiv using ordered guards | C04/lab-02; C04/guards | explained | State zero-divisor precedence and test all branches: V13 |
| Labs/Lab 2 Making Choices.docx; Task 4a | isVowel signature, upper and lower case | C04/lab-02; C08/imports | explained | Character normalisation variations: V7 |
| Labs/Lab 2 Making Choices.docx; Task 4b | isVowel with if, patterns and guards | C04/lab-02; C04/case-by-example | exam depth | - |
| Lab 2 2026.pdf; Q1 | isEven in if and guard forms | C04/case-exam-practice; C04/lab-02 | exam depth | - |
| Lab 2 2026.pdf; Q2 | Recursive sums of even elements | C06/list-recursion; C06/Q; downloads Lab2 / Rec families | explained | Design and dry-run variants: V3 |
| Lab 2 2026.pdf; Q3 | MultList scales every integer; repair uppercase function name | C06/list-recursion; C03/defining-functions; downloads List families | explained | Recursive scale with negative and empty cases: V3 |
| Lab 2 2026.pdf; Q4 | Comprehension selecting names longer than n | C06/comprehension-templates; C06/comprehension-exam-practice | exam depth | - |
| Labs/Lab 3 Recursion Continued.pdf; Required i-iv | Signature, base/step, dry run, implement/test each task | C06/lab-03; C05/dry-running | explained | Narrated design and multiple variations per task: V3 |
| Labs/Lab 3 Recursion Continued.pdf; Q1 | atPosition gives (index, element), zero-based bounds | C06/lab-03; C09/either-in-depth | explained | Repair source's off-by-one wording: index >= length is invalid; V3 |
| Labs/Lab 3 Recursion Continued.pdf; Q2 | largerY; preserve order, strict threshold, empty list | C06/lab-03; C06/list-recursion | explained | Threshold and type variations: V3 |
| Labs/Lab 3 Recursion Continued.pdf; Q3 | positiveNumbers; empty list, zero excluded | C06/lab-03; C06/list-recursion | explained | Signed and predicate variants: V3 |
| Labs/Lab 3 Recursion Continued.pdf; Q4 | Descending isSorted; empty/singleton true; ties policy | C06/lab-03; C06/list-recursion | explained | Ascending, strict and non-strict variants: V3 |
| Labs/CSI243 Lab 3 2026.docx; Q1 | Recursive has membership | C06/lab-03a; C09/eq-and-class-constraints | explained | Membership algorithm design variations: V3 |
| Labs/CSI243 Lab 3 2026.docx; Q2a | isEmpty is a space-character predicate, not empty Char | C06/lab-03a | explained | Clarify ' ' versus empty String and isSpace: V7 |
| Labs/CSI243 Lab 3 2026.docx; Q2b | len = length . filter isEmpty; count spaces | C06/lab-03a; C07/applying-by-hand | exam depth | - |
| Labs/CSI243 Lab 3 2026.docx; Q3a | add: increment an even number by 1, otherwise by 2 | C06/lab-03a; C04/case-by-example | exam depth | - |
| Labs/CSI243 Lab 3 2026.docx; Q3b | Transform using a generator/comprehension | C06/comprehension-templates; C06/lab-03a | exam depth | - |
| Labs/CSI243 Lab 3 2026.docx; Q3c | Rewrite using map add | C07/applying-by-hand; C06/lab-03a | exam depth | - |
| Labs/CSI243 Lab 4 2026.docx; Q1 | Design sumsq with foldr, without map | C07/folds-and-composition; C07/applying-by-hand | explained | Exact constrained synthesis task not fully worked: V4 |
| Labs/CSI243 Lab 4 2026.docx; Q2a | ff weighted average (t1+2*t2)/3 with Int inputs | C09/standard-classes; C07/zip-and-zipwith | explained | Exact weight, conversion placement and variants: V4 |
| Labs/CSI243 Lab 4 2026.docx; Q2b | fmark = zipWith ff, shortest-list policy | C07/zip-and-zipwith; C07/applying-by-hand | explained | Complete weighted marks question: V4 |
| Labs/CSI243 Lab 4 2026.docx; Q2c | Replace ff by a genuinely anonymous formula | C07/lambdas; C07/applying-by-hand | explained | Narrated lambda rewrite and errors: V4 |
| Labs/CSI243 Lab 4 2026.docx; Q3a | Recursive zipWithx on three lists; general signature | C07/more-higher-order-functions; C09/polymorphism-by-example | explained | zipWith3 use is deep; deriving one's own variant needs V4 |
| Labs/CSI243 Lab 4 2026.docx; Q3b | fp adds three integers; test zipWithx with it | C07/more-higher-order-functions | explained | Exact lab, unequal/empty inputs and all stopping cases: V4 |
| Labs/CSI243 Lab 5 2026.pdf; Q1 | Read div :: Int -> Int -> Int as curried arrows | C07/currying-and-sections; C09/polymorphism-by-example | exam depth | - |
| Labs/CSI243 Lab 5 2026.pdf; Q2 | Can a function return a function? Explain | C07/lambdas; C07/currying-and-sections | exam depth | - |
| Labs/CSI243 Lab 5 2026.pdf; Q3 | Greeting and partially applied Setswana greeting | C03/defining-functions; C07/currying-and-sections | exam depth | - |
| Labs/CSI243 Lab 5 2026.pdf; Q4 | Explain keepHighNumbers = filter (>50) | C07/applying-by-hand; C07/currying-and-sections | exam depth | - |
| Labs/CSI243 Lab 5 2026.pdf; Q5 | Implement filter using foldr | C07/folds-and-composition | explained | Definition present; derive step, seed and test cases: V4 |
| Labs/CSI243 Lab 5 2026.pdf; Q6 | Write takeWhile with patterns and recursion only | C07/applying-by-hand; C07/map-and-filter | explained | Trace present; constrained implementation variants: V3 |

### Lecturer handouts and lecture topics

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Lectures/csi243_ho4.pdf; p1 | Formal/actual arguments; substitution and single result | C03/defining-functions; C07/applying-by-hand | exam depth | - |
| Lectures/csi243_ho4.pdf; p2 | Domain modelling, cohesion, what versus how | C01/programming-model; C10/specification | explained | Contract-driven design tasks: V13 |
| Lectures/csi243_ho4.pdf; p3 | Composition equation and compatible function types | C07/applying-by-hand; C09/polymorphism-by-example | exam depth | - |
| Lectures/csi243_ho4.pdf; p4 | Iv, Ie, Ov, Oe and pre/postconditions | C10/specification | explained | Formal predicate and invalid-domain questions: V13 |
| Lectures/csi243_ho4.pdf; p5-6 | Syntax, type and semantic errors; divide/index errors | C10/errors-and-testing; C04/case-exam-practice | exam depth | - |
| Lectures/csi243_ho4.pdf; p7 | State, side effects, polymorphism, easier parallelism | C01/functional-thinking; C09/polymorphism-by-example | exam depth | - |
| Lectures/csi243_ho4.pdf; p8 | .hs files, -- and block comments, module/file convention | C02/first-program; C08/modules | explained | Multi-file tests and comments in context: V6 |
| Lectures/csi243_ho4.pdf; p9 | Identifier rules, reserved words, indentation, plural list names | C03/defining-functions; C02/first-program | explained | Apostrophes, underscores, invalid names and repair drills: V16 |
| Lectures/csi243_ho4.pdf; p10-11 | Module header, imports, automatic Prelude | C08/modules; C08/imports | explained | Export and Prelude scope variations: V6 |
| Lectures/csi243_ho4.pdf; p12 | :!, :browse, :show modules, environment commands | C02/ghci | explained | Complete diagnostic sessions: V6 |
| Lectures/csi243_ho4.pdf; p12 | Set a breakpoint, trace to it, inspect bindings | - | none | GHCi debugger workflow: V6 |
| Lectures/csi243_ho4.pdf; p13-16 | Basic I/O, types as sets, Bool, typing application rule | C03/output; C02/expressions-types; C09/polymorphism-by-example | exam depth | - |
| Lectures/csi243_ho4.pdf; p17-18 | Derive neg pasd type; reject neg 3 | C02/expressions-types; C09/polymorphism-by-example | exam depth | - |
| Lectures/csi243_ho6.pdf; p1-3 | Specify and implement isDigit | C03/defining-functions; C10/specification | explained | Complete contract questions: V13 |
| Lectures/csi243_ho6.pdf; p3 | isOdd with mod and Integral constraint | C09/standard-classes; C04/guards | explained | Modulus sign and numeric-domain variants: V1 |
| Lectures/csi243_ho6.pdf; p3 | splitat n xs = (take n xs, drop n xs) | C06/lists; C10/proof-patterns | explained | Implementation and negative/oversize n practice: V3 |
| Lectures/csi243_ho6.pdf; p4 | invert via recip; zero-input behaviour | C09/standard-classes; C03/defining-functions | mentioned | recip operation and domain variations: V1 |
| Lectures/csi243_ho6.pdf; p4-7 | Nested if; getSign specification and implementation | C04/conditional-expressions; C04/case-exam-practice | exam depth | - |
| Lectures/csi243_ho6.pdf; p8-9 | Guard sequence, common result type, otherwise | C04/guards; C04/case-by-example | exam depth | - |
| Lectures/csi243_ho6.pdf; p10 | Further-reading links, not additional assessable construct | content/docs/sem3/csi243/02-expressions-types/resources.mdx; content/docs/sem3/csi243/08-modules-types/resources.mdx | mentioned | Bibliographic context; no teaching lane required |
| Lectures/csi243_ho7.pdf; p1 | Types of mixed tuples and function signatures | C02/expressions-types; C09/polymorphism-by-example | exam depth | - |
| Lectures/csi243_ho7.pdf; p2 | String, Pos, Board synonyms | C08/type-synonyms | explained | Alias expansion and design variants: V5 |
| Lectures/csi243_ho7.pdf; p2 | type Assoc k v = [(k,v)] | C08/type-synonyms; C09/eq-and-class-constraints | explained | Parameter instantiation and aliases versus wrappers: V5 |
| Lectures/csi243_ho7.pdf; p2 | type Parser a = String -> [(a,String)] | C08/type-synonyms | mentioned | Run simple parsers, consume input and expand types: V5 |
| Lectures/csi243_ho7.pdf; p3 | data Result = Pass \| Fail; TLights | C08/data-types-by-example; C08/data-types-exam-practice | exam depth | - |
| Lectures/csi243_ho7.pdf; p3 | Course tuple modelling; malformed data Course declaration | C08/type-synonyms; C08/data-types-exam-practice | explained | Separate alias syntax from constructor syntax: V5 |
| Lectures/csi243_ho7.pdf; p3 | Recursive leaf-labelled Tree a = Leaf a \| Branch ... | C08/data-types-by-example; C10/proof-patterns | exam depth | - |
| Lectures/csi243_ho7.pdf; p4-5 | Local rectangle width; let versus where scope | C03/where-and-local-definitions; C03/where-exam-practice | exam depth | - |
| Lectures/csi243_ho7.pdf; p6-9 | Factorial specification, implementation, negative rejection | C05/how-recursion-works; C05/termination-and-errors | explained | Design and domain variations: V2 |
| Lectures/csi243_ho7.pdf; p6 homework | Prove fact computes the intended factorial, not merely positivity | C10/proof-patterns teaches positivity; C10/proofs-of-programs-i teaches the method | explained | Exact specification-correctness proof still needed: V13 |
| Lectures/csi243_ho7.pdf; p8 homework | Factorial without guards | C05/writing-recursive-functions; C04/case-exam-practice | exam depth | - |
| Lectures/csi243_ho7.pdf; p10-13 | Bool patterns, logical conjunction, wildcards, short-circuit order | C04/case-by-example; C10/lazy-evaluation | exam depth | - |
| Lectures/csi243_ho7.pdf; p14-15 | Tuple and nested patterns; projections | C06/tuples; C04/case-by-example | exam depth | - |
| Lectures/csi243_ho7.pdf; p16-18 | Empty, singleton and cons patterns; stW; null/head/tail | C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Lectures/csi243_ho7.pdf; p19 | Legacy n+k pattern pred (n+1) = n | - | none | Explain legacy extension and portable guarded rewrite: V16 |
| Lectures/csi243_ho7.pdf; p20-22 | Lambdas, direct application, curried add as nested lambdas | C07/lambdas; C07/applying-by-hand | exam depth | - |
| Lectures/csi243_ho7.pdf; p23 | const returns a constant function | C07/lambdas; C09/polymorphism-by-example | exam depth | - |
| Lectures/csi243_ho7.pdf; p24-25 | odds with map, local helper and anonymous equivalent | C07/map-and-filter; C07/applying-by-hand | exam depth | - |
| Lectures/csi243_ho7.pdf; p26-29 | Backticks, prefix operators, left/right sections, signatures | C07/currying-and-sections; C07/applying-by-hand | exam depth | - |
| Lectures/csi243_ho7.pdf; p30 | and = foldr (&&) True; operator as argument | C07/applying-by-hand; C10/lazy-evaluation | exam depth | - |
| Lectures/Lecture 1 Intro to FP 2023.pdf; p1-2 | Program, algorithm, pseudocode, input/process/output | C01/programming-model; C01/Q | exam depth | - |
| Lectures/Lecture 1 Intro to FP 2023.pdf; p2-4 | Imperative, procedural, object-oriented, declarative and markup categories | C01/programming-model; C01/functional-thinking | explained | Compare concrete paradigms and correct inheritance-only polymorphism: V13 |
| Lectures/Lecture 1 Intro to FP 2023.pdf; p3 | Polymorphism compared with OO inheritance | C09/polymorphism-by-example; C01/functional-thinking | exam depth | - |
| Lectures/Lecture 1 Intro to FP 2023.pdf; p4-6 | First-class functions, purity, immutability, decomposition | C01/programming-model; C01/functional-thinking; C07/applying-by-hand | exam depth | - |
| Lectures/Lecture 1 Intro to FP 2023.pdf; p6-7 | Referential transparency, testing, compiler optimisation and concurrency benefits | C01/functional-thinking; C10/equational-reasoning | explained | Reason about benefits without promising automatic speed-up: V13 |
| Lectures/Lecture 2 Using Haskell v2.pdf; p1-4 | Haskell history, GHC/GHCi/Hsc, compiler versus interpreter | C02/ghci; C02/first-program | explained | Tool roles and session diagnosis variations: V6 |
| Lectures/Lecture 2 Using Haskell v2.pdf; p5-7 | Prompt, :set prompt, :help, command abbreviations | C02/ghci | exam depth | - |
| Lectures/Lecture 2 Using Haskell v2.pdf; p8-11 | Calculator expressions, precedence, Boolean operators, let and it | C02/ghci; C02/expressions-types | explained | Mixed-operator exam traces: V1 |
| Lectures/Lecture 2 Using Haskell v2.pdf; p12-14 | Mandatory else, multiline :{ :}, isVowel | C02/ghci; C04/case-by-example | exam depth | - |
| Lectures/Lecture 2 Using Haskell v2.pdf; p15 | Quoted value versus print versus putStrLn | C03/output; C03/lab-01 | exam depth | - |
| Lectures/Lecture 2 Using Haskell v2.pdf; p16-18 | Modules, imports and library map | C08/modules; C08/imports | explained | Module tasks and actual library operations: V6, V7, V8, V9 |
| Lectures/Lecture 2 Using Haskell v2.pdf; p19-22 | Script persistence, run/compile, -o, .hi/.o and comments | C02/first-program | explained | Build/load diagnostic questions: V6 |
| Lectures/Lecture 2 Using Haskell v2.pdf; p23-24 | main, IO (), quit and reload | C03/complete-program; C02/ghci | exam depth | - |
| Lectures/Lecture 2 Using Haskell v2.pdf; p24 exercise 1 | multTen | C03/defining-functions; C07/currying-and-sections | explained | Design from specification: V2 |
| Lectures/Lecture 2 Using Haskell v2.pdf; p25 exercise 2 | Both arguments non-zero; Boolean result | C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Lectures/Lecture 2 Using Haskell v2.pdf; p25 exercise 3 | recursiveSum of 1 through n | C05/writing-recursive-functions; C05/dry-running | explained | Inclusive boundary and domain variants: V2 |
| Lectures/Lecture 2 Using Haskell v2.pdf; p26-29 | Car/Hello modules, executable entry point, reload | C08/modules; C02/first-program | explained | Multi-module build practice: V6 |
| Lectures/Lecture 2 Using Haskell v2.pdf; p30-31 | putStr/putStrLn, main action, unit result | C03/output; C03/complete-program | exam depth | - |
| Lectures/Lecture 2 Using Haskell v2.pdf; p32 | putChar on characters; getChar input | C03/output; C03/input-processing | mentioned | Character I/O and newline consumption: V10 |
| Lectures/Lecture 2 Using Haskell v2.pdf; p33-35 | Sequencing do; <- binding; final statement must be action | C03/input-processing | explained | More action/result and final-line exercises: V10 |
| Lectures/Lecture 2 Using Haskell v2.pdf; p36-39 | let/in and where; sumSquare example | C03/where-and-local-definitions; C03/where-exam-practice | exam depth | - |
| Lectures/Lecture 2 Using Haskell v2.pdf; p38, p42 | read entered numeric text; greet entered name | C03/input-processing; C09/maybe-either-exam-practice | exam depth | - |
| Lectures/Lecture 2 Using Haskell v2.pdf; p40-41 | Aligned definitions, scopes, module Test with x/y/z | C03/where-and-local-definitions; C08/modules | exam depth | - |
| Lectures/Lecture 2 Using Haskell v2.pdf; p43-45 | if-in-do, case, explicit braces/semicolons | C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Lectures/Lecture 2 Using Haskell v2.pdf; p45 exercise | Write power x n and determine type | C09/polymorphism-by-example; C09/standard-classes | explained | Exponent choice and domain: V1 |
| Lectures/Definitions and Data Types.pdf; p2-5 | Definitions, ::, names, syntax/type analysis, strong typing | C02/expressions-types; C03/defining-functions; C10/errors-and-testing | exam depth | - |
| Lectures/Definitions and Data Types.pdf; p6-8 | Int/Integer, unary minus, arithmetic and comparisons | C02/expressions-types; C09/standard-classes | explained | Signed arithmetic and conversion drills: V1 |
| Lectures/Definitions and Data Types.pdf; p9 | Define Boolean truth tables | C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Lectures/Definitions and Data Types.pdf; p10-12 | Float/Double, approximation, pi | C02/expressions-types; C09/standard-classes | explained | Numeric-domain and floating-result questions: V1 |
| Lectures/Definitions and Data Types.pdf; p11 | Exponents ^ and ** | C09/standard-classes | mentioned | ^ versus ^^ versus **: V1 |
| Lectures/Definitions and Data Types.pdf; p11 | ceiling, round, floor | C09/standard-classes; C09/CS | explained | Three variations each including negative and ties: V1 |
| Lectures/Definitions and Data Types.pdf; p12 | sin, cos, tan, asin, acos, atan, log, exp, sqrt | C09/standard-classes | mentioned | Radians, domains and inverse-function examples: V1 |
| Lectures/Definitions and Data Types.pdf; p13 | Escaped tab/newline/backslash/quotes; numeric character code | C02/values-text; C03/output | explained | Escape and codepoint practice: V7 |
| Lectures/Definitions and Data Types.pdf; p13-14 | getCode/getChar informal code operations; ord/chr actual functions | C08/imports | mentioned | Distinguish chr from Prelude.getChar; Unicode not only ASCII: V7 |
| Lectures/Definitions and Data Types.pdf; p14 | toUpper, toLower | C08/imports; C04/lab-02 | explained | Whole-string normalisation and nonletters: V7 |
| Lectures/Definitions and Data Types.pdf; p14 | isAscii, isUpper, isLower, isAlpha, isDigit, isAlphaNum | C03/defining-functions | mentioned | Library predicates, ranges and varied inputs: V7 |
| Lectures/Definitions and Data Types.pdf; p14-15 | String, empty string, ++, length and multiline printing | C02/values-text; C03/output; C06/lists | exam depth | - |
| Lectures/Definitions and Data Types.pdf; p15 | cat and substring as informal string operations | C06/lists | mentioned | Translate to ++ and take/drop; no assumed Prelude cat: V8 |
| Lectures/Definitions and Data Types.pdf; p15 | show/read and overloaded literals/equality | C03/output; C09/polymorphism-by-example; C09/standard-classes | exam depth | - |
| Lectures/Definitions and Data Types.pdf; p16-17 | Homogeneous lists versus fixed-arity heterogeneous tuples | C06/lists; C06/tuples; C09/polymorphism-by-example | exam depth | - |
| Lectures/Definitions and Data Types.pdf; p18-22 | Functions as values, signatures, square, curried add | C03/defining-functions; C07/applying-by-hand; C09/polymorphism-by-example | exam depth | - |
| Lectures/Definitions and Data Types.pdf; p20 | "Void" functions versus IO () and unit | C03/output; C09/maybe-either-exam-practice | exam depth | - |

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Lectures/Making Choices 2.pdf; p1-5 | Base/recursive cases, factorial, interactive multiline definition | C05/how-recursion-works; C05/dry-running | explained | More independently designed recurrences: V2 |
| Lectures/Making Choices 2.pdf; p6-8 exercise | Fibonacci definition and full dry run F5 | C05/dry-running | explained | More recurrence variants and checked call counts: V2, V12 |
| Lectures/Making Choices 2.pdf; p9-10 | Factorial in if form; same branch type | C05/writing-recursive-functions; C04/case-exam-practice | exam depth | - |
| Lectures/Making Choices 2.pdf; p11-13 | Pattern choice, first match, Boolean negation | C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Lectures/Making Choices 2.pdf; p14 | Special square 0 = 1 (specification differs from ordinary square) | C04/pattern-matching; C10/specification | explained | Explain literal specification versus mistaken mathematics: V13 |
| Lectures/Making Choices 2.pdf; p15-18 | Factorial in patterns, guards and case | C04/case-exam-practice; C05/writing-recursive-functions | exam depth | - |
| Lectures/Making Choices 2.pdf; p19-20 | sumNumbers including n | C05/writing-recursive-functions | explained | Inclusive/exclusive and signed domain variants: V2 |
| Lectures/Making Choices 2.pdf; p21 | Factorial invalid-input error | C05/termination-and-errors; C09/either-in-depth | exam depth | - |
| Lectures/Making Choices 2.pdf; p21-23 exercise | rangeSum specification, reversed bounds, dry run 3 5, implement | C05/writing-recursive-functions; downloads Lab1_RangeSum | explained | More bounds policies and narrated design: V2 |
| Lectures/Making Choices 2.pdf; p23 take-home | sumFac from fac 0 to fac n inclusive | C05/writing-recursive-functions; downloads Lab1_SumFactorials | explained | Design variants and avoid repeated factorial work: V2, V12 |
| Lectures/Modules, Lists, Tuples.pdf; p1-3 | Module role, coupling, reuse, names, files, header | C08/modules | explained | Multi-module specification tasks: V6 |
| Lectures/Modules, Lists, Tuples.pdf; p4 | Module closure; imported types versus names explicitly in scope | C08/modules | explained | Distinguish type-checker knowledge from source visibility: V6 |
| Lectures/Modules, Lists, Tuples.pdf; p4-7 | Ordinary, selective, hiding, qualified and aliased imports | C08/imports | explained | Type/constructor scope corrections and exercises: V6 |
| Lectures/Modules, Lists, Tuples.pdf; p6 | Incorrect assertion that types and synonyms cannot be hidden | C08/imports; C08/type-synonyms | explained | Site repeats source error; correct explicitly: V6 |
| Lectures/Modules, Lists, Tuples.pdf; p7 | Same alias for two modules where names do not clash | C08/imports | explained | Ambiguity and alias resolution variants: V6 |
| Lectures/Modules, Lists, Tuples.pdf; p8-10 | Data.List, Data.Char, Data.Map, Data.Set overview | C08/imports | explained | Operations need depth: V7, V8, V9 |
| Lectures/Modules, Lists, Tuples.pdf; p10-14 | MyCalculator: addTwo, averageTwo, averageThree, areSorted, maxThree, showEven; client main | C08/modules; C04/case-by-example | explained | Build, export, test and repair this family: V6 |
| Lectures/Modules, Lists, Tuples.pdf; p15 | null, head, tail | C06/lists; C04/case-by-example; C09/maybe-in-depth | exam depth | - |
| Lectures/Modules, Lists, Tuples.pdf; p16 | last, init, cons and take boundary behaviour | C06/lists; C10/proof-patterns | explained | Executable algorithm and edge variations: V3 |
| Lectures/Modules, Lists, Tuples.pdf; p17 | length and !! with invalid-index failure | C06/lab-03; C09/either-in-depth | explained | Index implementation variations: V3 |
| Lectures/Modules, Lists, Tuples.pdf; p17 | reverse, sum, product, minimum, maximum | C06/lists; C07/applying-by-hand; C10/proof-patterns | explained | Safe extrema and recursive synthesis: V3 |
| Lectures/Modules, Lists, Tuples.pdf; p18 | ++ order, non-commutativity, repeated cons | C06/lists; C10/proofs-of-programs-i | exam depth | - |
| Lectures/Modules, Lists, Tuples.pdf; p19-20 | Ragged nested lists, String as [Char], mixed-list rejection | C06/comprehension-templates; C09/polymorphism-by-example | exam depth | - |
| Lectures/Modules, Lists, Tuples.pdf; p20-22 | Tuple arity/unit, no singleton, nesting, fst/snd | C06/tuples; C09/polymorphism-by-example; C09/maybe-either-exam-practice | exam depth | - |
| Lectures/Modules, Lists, Tuples.pdf; p23 | addAndSub, tuple argument add and polymorphic swap | C06/tuples; C09/polymorphism-by-example | exam depth | - |
| Lectures/Modules, Lists, Tuples.pdf; p23-26 | Output, generators, tests, order and five evaluated comprehensions | C06/comprehension-templates; C06/comprehension-exam-practice | exam depth | - |
| Lectures/Haskell Functions.pptx; slides 2-3 | Signature/definition, optional signature, invalid uppercase Square/Add/ListLen | C03/defining-functions; C09/polymorphism-by-example | explained | Systematic lexical repair questions: V16 |
| Lectures/Haskell Functions.pptx; slides 3-5 | isZero, dayName, head1 and empty error | C04/case-by-example; C09/maybe-in-depth | exam depth | - |
| Lectures/Haskell Functions.pptx; slide 6 | Shape, Circle/Rectangle, area; repair lowercase type/constructor | C08/data-types-by-example; C08/data-types-exam-practice | exam depth | - |
| Lectures/Haskell Functions.pptx; slides 7-8 | grade and isAdult compound guards | C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Lectures/Haskell Functions.pptx; slides 9-10 | BMI where; cylinderVolume let; local helpers | C03/where-and-local-definitions; C03/where-exam-practice | exam depth | - |
| Lectures/Haskell Functions.pptx; slide 11 | Recursive factorial and list sum | C05/how-recursion-works; C06/list-recursion | explained | Construction rather than recognition: V2, V3 |
| Lectures/Haskell Functions.pptx; slides 12-13 | [a], [[a]], cons equivalence and finite/infinite ranges | C09/polymorphism-by-example; C10/infinite-data-structures | exam depth | - |
| Lectures/Haskell Functions.pptx; slide 14 | head/tail/init/last/null/reverse/!! | C06/lists; C09/maybe-in-depth | explained | List operation implementations and varied edges: V3 |
| Lectures/Functions List Comprehensions.pptx; slide 2 | Factorial in if, patterns and guards | C05/writing-recursive-functions; C04/case-exam-practice | exam depth | - |
| Lectures/Functions List Comprehensions.pptx; slide 3 | XOR, maximum and isNeg | C04/case-by-example; C04/conditional-expressions | explained | Complete specification and truth-table variants: V13 |
| Lectures/Functions List Comprehensions.pptx; slide 3 | Mult using repeated addition | C05/writing-recursive-functions | explained | Both signs and zero multipliers: V2 |
| Lectures/Functions List Comprehensions.pptx; slides 4-7 | Mathematical set builder versus ordered list; squares/doubles/filters | C06/comprehension-templates; C06/comprehension-exam-practice | exam depth | - |
| Lectures/Functions List Comprehensions.pptx; slides 8-10 | Dependent generators and changing fastest generator | C06/comprehension-templates; C06/comprehension-exam-practice | exam depth | - |
| Lectures/Functions List Comprehensions.pptx; slides 11-12 | Even-number guards and factors 15 | C06/comprehension-exam-practice | exam depth | - |
| Lectures/Functions List Comprehensions.pptx; slides 13-14 | String comprehension and count 's' Mississippi | C06/comprehension-templates; C06/comprehension-exam-practice | exam depth | - |
| Lectures/Functions List Comprehensions.pptx; slide 15 | Mixed-type pair output, sum-pairs, multiplication table and broken brackets | C06/comprehension-templates; C06/comprehension-exam-practice | exam depth | - |
| Currying.pptx; slides 1-2 | One argument, returned function, right-associative arrows | C07/currying-and-sections; C09/polymorphism-by-example | exam depth | - |
| Currying.pptx; slides 3-4 | add10 and greaterThan threshold specialisations | C07/currying-and-sections; C07/applying-by-hand | exam depth | - |
| Currying.pptx; slide 5 | map square returns a list-processing function | C07/applying-by-hand; C09/polymorphism-by-example | exam depth | - |
| Currying.pptx; slide 6 | Named versus point-free pipeline | C07/currying-and-sections; C07/applying-by-hand | exam depth | - |
| Currying.pptx; slide 6 | sort/map toUpper example wrongly typed as [String] -> [String] | C07/currying-and-sections; C08/imports | explained | Repair map (map toUpper); sorting semantics: V7, V9 |
| Currying.pptx; slide 7 | a -> b -> c versus (a -> b) -> c | C09/polymorphism-by-example | exam depth | - |
| Currying.pptx; slides 8-9 | curry, uncurry and map (uncurry (+)) | C07/applying-by-hand | exam depth | - |
| Lectures/Currying.pptx; slides 1-2 | One argument, returned function, right-associative arrows | C07/currying-and-sections; C09/polymorphism-by-example | exam depth | - |
| Lectures/Currying.pptx; slides 3-4 | add10 and greaterThan threshold specialisations | C07/currying-and-sections; C07/applying-by-hand | exam depth | - |
| Lectures/Currying.pptx; slide 5 | map square returns a list-processing function | C07/applying-by-hand; C09/polymorphism-by-example | exam depth | - |
| Lectures/Currying.pptx; slide 6 | Named versus point-free pipeline | C07/currying-and-sections; C07/applying-by-hand | exam depth | - |
| Lectures/Currying.pptx; slide 6 | sort/map toUpper example wrongly typed as [String] -> [String] | C07/currying-and-sections; C08/imports | explained | Repair map (map toUpper); sorting semantics: V7, V9 |
| Lectures/Currying.pptx; slide 7 | a -> b -> c versus (a -> b) -> c | C09/polymorphism-by-example | exam depth | - |
| Lectures/Currying.pptx; slides 8-9 | curry, uncurry and map (uncurry (+)) | C07/applying-by-hand | exam depth | - |

### Complete notes book: both supplied editions

The HTML and PDF carry the same numbered teaching sequence. Each row cites both source editions; PDF line wrapping and lost diagrams do not count as a second gap. The Test1 rows above retain every runnable example and test separately.

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 00.1-00.2 | Course outcomes; try, predict, run, explain method | C01/programming-model; C02/ghci | explained | Integrated readiness evidence: V14 |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 01.1-01.5 | GHCi/runhaskell/ghc; loading, reloading, Hello World mistakes | C02/ghci; C02/first-program; C03/lab-01 | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 02.1 | Distinguish main signature from action definition | C03/complete-program; C03/output | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 02.2-02.4 | Output common types; print = putStrLn . show; quote behaviour | C03/output; C03/lab-01 | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 02.5 | tidyReport versus messyReport, missing line breaks | C03/output; C03/lab-01 | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 03.1 | Imperative/procedural/functional sum comparison | C01/functional-thinking; C01/Q | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 03.2-03.3 | Values, expression types, Int overflow versus Integer | C02/expressions-types; C02/Q | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 03.4-03.5 | Pure calculation/action; immutable names versus assignment | C01/programming-model; C03/input-processing | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 04.1-04.3 | Precedence and hand evaluation; whole/fractional division | C02/expressions-types; C09/standard-classes | explained | Signed and mixed arithmetic exam variations: V1 |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 04.4 | Square by repeated addition; power by repeated multiplication | C05/writing-recursive-functions; downloads Rec_Power | explained | State non-negative repetition precondition; negative squareByAdding claim is false: V1, V2 |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 05.1-05.4 | Definition anatomy; six-part construction; tests versus correctness | C03/defining-functions; C10/specification | explained | Full narrated contract tasks: V13 |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 05.3 | Curried and tupled rectangle functions | C07/applying-by-hand; C06/tuples | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 06.1-06.2 | if and guards, grade cut-offs, safe order | C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 06.3-06.5 | isEven, bothEven, isDiv, isVowel in several forms | C04/lab-02; C04/case-exam-practice | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 07.1-07.2 | Bool/list/tuple/wildcard equations and case | C04/case-by-example; C04/case-exam-practice | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 07.3 | BMI where, cylinder let, local scope | C03/where-and-local-definitions; C03/where-exam-practice | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 08.1-08.2 | Lists versus tuples; structural cons | C06/lists; C06/tuples; C09/polymorphism-by-example | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 08.3 | atPosition with Either and nested recursive helper | C06/lab-03; C09/either-in-depth | explained | Preserve original index, length boundary, recursive variations: V3 |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 09.1-09.2 | Factorial recursive structure and expansion | C05/how-recursion-works; C05/dry-running | explained | Further design variations: V2 |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 09.3 | multiply by repeated addition with negative multiplier | C05/writing-recursive-functions | explained | Signed multiplication algorithm: V2 |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 09.4 | factCountdown, factProduct, productList, factViaList | C05/writing-recursive-functions; C07/folds-and-composition | explained | Derive alternatives with domain agreement: V2 |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 09.5 | Recursive sumEvens and multList | C06/list-recursion; C06/Q | explained | Full recursive designs with varied types/data: V3 |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 10.1 | Positive filtering and descending sortedness | C06/lab-03; C06/list-recursion | explained | Sortedness equality and empty/singleton variants: V3 |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 10.2-10.4 | Comprehensions, generators, factorList, longNames, order | C06/comprehension-templates; C06/comprehension-exam-practice | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 11.1-11.3 | applyTwice, lambdas, sections, map/filter/fold pipelines | C07/applying-by-hand; C07/more-higher-order-functions | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 11.4-11.6 | Currying, curry/uncurry, named versus point-free process | C07/currying-and-sections; C07/applying-by-hand | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 12.1-12.3 | Exported Geometry core and qualified application | C08/modules; C08/imports | explained | Multi-file exam construction: V6 |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 13.1-13.2 | identity/first, constraints and parametric polymorphism | C09/polymorphism-by-example; C09/eq-and-class-constraints | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 13.3 | Result, Shape and area, constructors and deriving | C08/data-types-by-example; C08/data-types-exam-practice | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 14.1 | Read a line and bind it with <- | C03/input-processing | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 14.2-14.4 | readMaybe, parseMark, parseNumber, addTwoInputs; precise error source | C09/maybe-in-depth; C09/either-in-depth; C09/maybe-either-exam-practice | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 15.1 | Equational evaluation versus proof for every input | C10/proofs-of-programs-i; C10/proof-patterns | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 15.2 | Slow/fast reverse, recursive list costs, time and space | C10/complexity | explained | Accurate recurrences and sharing assumptions: V12 |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 15.3 | Diagnose compiler and runtime errors | C10/errors-and-testing; C04/case-exam-practice | exam depth | - |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 16.1-16.2 | Student records, average, outcome, summary, classAverage | C08/data-types-exam-practice; C09/maybe-either-exam-practice | explained | Complete integrated grade-book and missing-data policy: V14 |
| Resources/CSI243_Complete_Functional_Programming_Notes.html AND Resources/CSI243_Complete_Functional_Programming_Notes.pdf; 16.3-16.4 | Practical readiness and revision questions across topics | All chapter Q and R; downloads README | explained | Marked integrated mock with narrated solution: V14 |

### Lab 4 textbook: foundations, all three lab questions and appendices

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources/Haskell Lab4 Textbook.html; chapters 1-2 | Calculations, pure functions, immutability, GHCi, file anatomy, comments | C01/programming-model; C02/first-program; C03/complete-program | exam depth | - |
| Resources/Haskell Lab4 Textbook.html; 2.3 | Names, indentation and where | C03/where-and-local-definitions; C03/where-exam-practice | exam depth | - |
| Resources/Haskell Lab4 Textbook.html; 3.1-3.3 | Function types, type variables and constraints | C09/polymorphism-by-example; C09/eq-and-class-constraints | exam depth | - |
| Resources/Haskell Lab4 Textbook.html; 3.4 | Int/Double mismatch; convert weighted numerator with fromIntegral | C09/standard-classes | explained | Derive exact ff and alternative conversion placement: V4 |
| Resources/Haskell Lab4 Textbook.html; 4.1-4.3 | Definition/application, sections, anonymous functions | C07/applying-by-hand; C07/currying-and-sections | exam depth | - |
| Resources/Haskell Lab4 Textbook.html; 5.1-5.3 | Cons, ranges, list patterns and partial functions | C06/lists; C04/case-by-example | exam depth | - |
| Resources/Haskell Lab4 Textbook.html; 6.1-6.2 | Structural recursion and recognising sumSquares shape | C06/list-recursion; C05/dry-running | explained | Translate recursive step to combining function: V4 |
| Resources/Haskell Lab4 Textbook.html; 7.1-7.2 | Higher-order function types; map/filter/fold/zip choice | C07/applying-by-hand; C07/more-higher-order-functions | exam depth | - |
| Resources/Haskell Lab4 Textbook.html; 8.1-8.4 | foldr definition, nesting, argument order and hand traces | C07/applying-by-hand | exam depth | - |
| Resources/Haskell Lab4 Textbook.html; 8.5 | foldl contrast and non-associative subtraction | C07/applying-by-hand | exam depth | - |
| Resources/Haskell Lab4 Textbook.html; 9.1-9.3 | zip/zipWith, shortest list, recursive equations | C07/zip-and-zipwith; C07/applying-by-hand | exam depth | - |
| Resources/Haskell Lab4 Textbook.html; 10.1-10.5 Q1 | sumsq without map: seed, combiner, n<=0, tests | C07/folds-and-composition; C07/applying-by-hand | explained | Full restricted lab design: V4 |
| Resources/Haskell Lab4 Textbook.html; 11.1-11.4 Q2a | ff with weights 1:2 and fractional result | C09/standard-classes; C07/zip-and-zipwith | explained | Weight and conversion variants: V4 |
| Resources/Haskell Lab4 Textbook.html; 11 Q2b-c | fmark and fmarkLambda including unequal inputs | C07/zip-and-zipwith; C07/lambdas | explained | Exact narrated multi-part question: V4 |
| Resources/Haskell Lab4 Textbook.html; 12.1-12.3 Q3 | zipWithx general type, all stop cases, fp and traces | C07/more-higher-order-functions | explained | Write and test custom three-list recursion: V4 |
| Resources/Haskell Lab4 Textbook.html; 13.1-13.3 | Complete Lab4.hs, main, test grid and submission explanation | C03/complete-program; C08/modules | explained | Full executable lab and test matrix: V4 |
| Resources/Haskell Lab4 Textbook.html; Appendix A.1 | Int used where Double needed | C09/standard-classes; C03/input-processing | explained | Lab-specific diagnosis and repair: V4 |
| Resources/Haskell Lab4 Textbook.html; Appendix A.2 | Wrong combining-function arity in zipWithx type | C09/polymorphism-by-example | exam depth | - |
| Resources/Haskell Lab4 Textbook.html; Appendix A.3 | Bare operator passed to zipWith | C07/applying-by-hand; C07/currying-and-sections | exam depth | - |
| Resources/Haskell Lab4 Textbook.html; Appendix A.4 | Only all-empty base case; partial printed list before crash | C04/case-by-example; C10/lazy-evaluation | explained | Custom zipWithx failure and stop-case repair: V4 |
| Resources/Haskell Lab4 Textbook.html; Appendix A.5 | Bad indentation | C03/where-and-local-definitions; C04/case-exam-practice | exam depth | - |
| Resources/Haskell Lab4 Textbook.html; Appendix B | Definition/type/command reference and eta reduction | C07/applying-by-hand; C02/ghci; C09/polymorphism-by-example | exam depth | - |
| Resources/Haskell Lab4 Textbook.html; C.1 | productTo using foldr | C07/folds-and-composition | explained | Multiple restricted design examples: V4 |
| Resources/Haskell Lab4 Textbook.html; C.2 | myLength using foldr | C07/folds-and-composition | explained | Derive seed and ignored element argument: V4 |
| Resources/Haskell Lab4 Textbook.html; C.3 | countEvens conditional fold | C07/folds-and-composition | explained | Predicate-count design variations: V4 |
| Resources/Haskell Lab4 Textbook.html; C.4 | sumCubes adapting sumsq | C07/applying-by-hand | explained | Square/cube/weighted variants: V4 |
| Resources/Haskell Lab4 Textbook.html; C.5 | Dot product from zipWith and foldr | C07/zip-and-zipwith | explained | Complete derivation and length policy: V4 |
| Resources/Haskell Lab4 Textbook.html; C.6 | final3/fmark3 with weights 1:2:3 | C07/more-higher-order-functions | explained | Three-weight synthesis: V4 |
| Resources/Haskell Lab4 Textbook.html; C.7 | zip3x via tuple-producing lambda | C07/more-higher-order-functions | exam depth | - |
| Resources/Haskell Lab4 Textbook.html; C.8 | Implement myZipWith without copying | C07/zip-and-zipwith; C07/applying-by-hand | exam depth | - |

### Course outline, coverage matrix, roadmap, portable notes and suite support

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| Resources/CSI243 Functional Programming.pdf; p1 | FP versus imperative; modern language features | C01/programming-model; C01/functional-thinking | exam depth | - |
| Resources/CSI243 Functional Programming.pdf; p1 | Recursive definitions; non-trivial programs | C05/writing-recursive-functions; C06/list-recursion | explained | V2, V3 |
| Resources/CSI243 Functional Programming.pdf; p1 | Higher-order functions; abstraction of control | C07/applying-by-hand; C07/more-higher-order-functions | exam depth | - |
| Resources/CSI243 Functional Programming.pdf; p1 | Type inference; polymorphism; strong typing | C09/polymorphism-by-example; C09/eq-and-class-constraints | exam depth | - |
| Resources/CSI243 Functional Programming.pdf; p1 | Abstract data types; representation hiding | C08/modules; C08/custom-types | explained | Opaque interface and invariants: V6 |
| Resources/CSI243 Functional Programming.pdf; p1 | Modules; parameterised modules (functors) | C08/modules; C09/maybe-and-instances | mentioned | Module functors versus Haskell Functor: V6, V11 |
| Resources/CSI243 Functional Programming.pdf; p1 | Predicate logic and recursion | C04/guards; C07/applying-by-hand; C10/specification | explained | Quantifiers and negated specifications: V13 |
| Resources/CSI243 Functional Programming.pdf; p1 | Algorithm specification; partial correctness | C10/specification; C10/proofs-of-programs-i | explained | Formal claims and termination: V13 |
| Resources/CSI243 Functional Programming.pdf; p1 | Mathematical reasoning; proofs | C10/proof-patterns; C10/lab-proof-patterns | exam depth | - |
| Resources/CSI243 Functional Programming.pdf; p1 | Data structures and pattern matching | C08/data-types-by-example; C04/case-exam-practice | exam depth | - |
| Resources/CSI243 Functional Programming.pdf; p1 | I/O and applications | C03/input-processing; C03/output | explained | Whole programs: V10, V14 |
| Resources/CSI243 Functional Programming.pdf; p1 | Time complexity | C10/complexity | explained | Accurate cost derivations: V12 |
| Resources/CSI243 Functional Programming.pdf; p1 | Space complexity | C10/complexity; C10/lazy-evaluation | explained | Retained data, demand and accumulators: V12 |
| Resources/CSI243 Functional Programming.pdf; p1 | Labs 20%, tests 30%, examination 50% | Course overview; chapter Q/R | mentioned | Historical context; no teaching gap or claim that old weights remain current |
| Course/Source Coverage Matrix.md; 00 Start Here | GHC, GHCi, prompt, `:help`, `:load`, `:type`, `:info`, `:quit`, expressions, first file; practical: Environment check and first saved program | C02/ghci | exam depth | - |
| Course/Source Coverage Matrix.md; 01 Functional Thinking | Functions, expressions, purity, side effects, composition, FP vs imperative; practical: Compare two solutions and identify side effects | C01/functional-thinking | exam depth | - |
| Course/Source Coverage Matrix.md; 02 Expressions and Types | Syntax/type analysis, `Int`, `Integer`, `Float`, `Double`, `Bool`, `Char`, `String`, lists, tuples, inference; practical: Predict and verify expression types and results | C02/expressions-types | exam depth | - |
| Course/Source Coverage Matrix.md; 03 Defining Functions | Signature, specification, implementation, comments, identifiers, precedence, testing; practical: A documented `.hs` file with verified calls | C03/defining-functions | explained | V13 |
| Course/Source Coverage Matrix.md; 04 Making Choices | `if`, guards, pattern matching, `case`, ordering, exhaustiveness; practical: One problem implemented four ways | C04/case-exam-practice | exam depth | - |
| Course/Source Coverage Matrix.md; 05 Recursion | Base case, recursive step, termination, factorial, Fibonacci, invalid inputs, dry runs; practical: Recursive trace and lab functions | C05/writing-recursive-functions | explained | V2 |
| Course/Source Coverage Matrix.md; 06 Lists and Tuples | Homogeneous lists, heterogeneous tuples, cons, concatenation, indexing, nested structures; practical: Collection-operation lab | C06/lists; C06/tuples | explained | V3 |
| Course/Source Coverage Matrix.md; 07 Recursive Lists | Structural recursion, head/tail patterns, positional lookup, list construction; practical: Complete Lab 3 with tests | C06/list-recursion | explained | V3 |
| Course/Source Coverage Matrix.md; 08 Modules and Programs | Module naming, exports, imports, qualified imports, Prelude, `main`; practical: Two-module program | C08/modules; C08/imports | explained | V6 |
| Course/Source Coverage Matrix.md; 09 List Comprehensions | Output expression, generators, predicates, multiple generators; practical: Translate comprehensions and ordinary functions | C06/comprehension-exam-practice | exam depth | - |
| Course/Source Coverage Matrix.md; 10 Lambdas, Currying and Sections | Lambda expressions, curried definitions, returned functions, operator sections; practical: Rewrite named functions as lambdas/sections | C07/currying-and-sections | exam depth | - |
| Course/Source Coverage Matrix.md; 11 Higher-Order Functions | `map`, `filter`, folds, `takeWhile`, `dropWhile`, `zipWith`, `iterate`, scans; practical: Trace and compare higher-order pipelines | C07/applying-by-hand | exam depth | - |
| Course/Source Coverage Matrix.md; 12 Polymorphism and Typeclasses | Polymorphic signatures, constraints, common typeclasses; practical: Generic functions and signature reading | C09/polymorphism-by-example; C09/standard-classes | explained | V15 |
| Course/Source Coverage Matrix.md; 13 Data Types and Abstraction | Type synonyms, `data`, constructors, pattern matching, modules; practical: Model and process a custom data type | C08/data-types-by-example; C08/type-synonyms | explained | V5, V6 |
| Course/Source Coverage Matrix.md; 14 Reasoning and Complexity | Equational traces, correctness, recursive cost, list-operation cost; practical: Reasoning worksheet and complexity comparison | C10/proof-patterns; C10/complexity | explained | V12 |
| Course/Source Coverage Matrix.md; 15 Capstone and Revision | Integrated program, troubleshooting, practical and theory revision; practical: Capstone, mock lab, mock exam | All chapter Q/R; downloads README | explained | V14 |
| Course/Source Coverage Matrix.md; Completion gates | Compiled examples, comparison, traces, errors, practice and mastery | All chapter Q/R; downloads README | explained | Apply gates to integrated practical: V14 |
| Course/Study Roadmap.md; Phase 1 | Environment and diagnostic session | C02/ghci; C02/first-program | explained | V6 |
| Course/Study Roadmap.md; Phase 2 | Signatures, purpose and normal/boundary/invalid tests | C03/defining-functions; C10/specification | explained | V13 |
| Course/Study Roadmap.md; Phase 3 | Choices, terminating recursion and structures | C04/case-exam-practice; C05/writing-recursive-functions; C06/lab-03 | explained | V2, V3 |
| Course/Study Roadmap.md; Phase 4 | Modules and reusable abstractions | C08/modules; C07/applying-by-hand | explained | V6 |
| Course/Study Roadmap.md; Phase 5 | Independent capstone, explain every expression, timed mocks | All chapter Q/R; C10/errors-and-testing | explained | V14 |
| Notes\Current\00 - Start Here.md; What are GHC and GHCi" | What are GHC and GHCi" | C02/ghci; C02/first-program | exam depth | - |
| Notes\Current\00 - Start Here.md; Install or open Haskell | Install or open Haskell | C02/ghci; C02/first-program | exam depth | - |
| Notes\Current\00 - Start Here.md; Your first expressions | Your first expressions | C02/ghci; C02/first-program | exam depth | - |
| Notes\Current\00 - Start Here.md; GHCi commands versus Haskell expressions | GHCi commands versus Haskell expressions | C02/ghci; C02/first-program | exam depth | - |
| Notes\Current\00 - Start Here.md; Define and test a function interactively | Define and test a function interactively | C02/ghci; C02/first-program | exam depth | - |
| Notes\Current\00 - Start Here.md; Save the function in a file | Save the function in a file | C02/ghci; C02/first-program | exam depth | - |
| Notes\Current\00 - Start Here.md; Common first-day failures | Common first-day failures | C02/ghci; C02/first-program | exam depth | - |
| Notes\Current\00 - Start Here.md; Mastery check | Mastery check | C02/ghci; C02/first-program | exam depth | - |
| Notes\Current\01 - Functional Thinking.md; The central idea | The central idea | C01/functional-thinking | exam depth | - |
| Notes\Current\01 - Functional Thinking.md; What, why, when, and how | What, why, when, and how | C01/functional-thinking | exam depth | - |
| Notes\Current\01 - Functional Thinking.md; Expression versus statement | Expression versus statement | C01/functional-thinking | exam depth | - |
| Notes\Current\01 - Functional Thinking.md; Functional and imperative comparison | Functional and imperative comparison | C01/functional-thinking | exam depth | - |
| Notes\Current\01 - Functional Thinking.md; Immutability | Immutability | C01/functional-thinking | exam depth | - |
| Notes\Current\01 - Functional Thinking.md; Pure functions and side effects | Pure functions and side effects | C01/functional-thinking | exam depth | - |
| Notes\Current\01 - Functional Thinking.md; Function composition | Function composition | C01/functional-thinking | exam depth | - |
| Notes\Current\01 - Functional Thinking.md; Common misconceptions | Common misconceptions | C01/functional-thinking | exam depth | - |
| Notes\Current\01 - Functional Thinking.md; Practice | Practice | C01/functional-thinking | exam depth | - |
| Notes\Current\01 - Functional Thinking.md; Mastery check | Mastery check | C01/functional-thinking | exam depth | - |
| Notes\Current\02 - Expressions and Types.md; The two questions to ask | The two questions to ask | C02/expressions-types | exam depth | - |
| Notes\Current\02 - Expressions and Types.md; Reading a type signature | Reading a type signature | C02/expressions-types | exam depth | - |
| Notes\Current\02 - Expressions and Types.md; Basic types | Basic types | C02/expressions-types | exam depth | - |
| Notes\Current\02 - Expressions and Types.md; `Int` versus `Integer` | `Int` versus `Integer` | C02/expressions-types | exam depth | - |
| Notes\Current\02 - Expressions and Types.md; Whole-number division versus fractional division | Whole-number division versus fractional division | C02/expressions-types | explained | Mixed arithmetic and domains: V1 |
| Notes\Current\02 - Expressions and Types.md; Boolean expressions | Boolean expressions | C02/expressions-types | exam depth | - |
| Notes\Current\02 - Expressions and Types.md; Characters and strings | Characters and strings | C02/expressions-types | exam depth | - |
| Notes\Current\02 - Expressions and Types.md; Lists | Lists | C02/expressions-types | exam depth | - |
| Notes\Current\02 - Expressions and Types.md; Tuples | Tuples | C02/expressions-types | exam depth | - |
| Notes\Current\02 - Expressions and Types.md; Function application and precedence | Function application and precedence | C02/expressions-types | explained | Mixed arithmetic and domains: V1 |
| Notes\Current\02 - Expressions and Types.md; A mechanical type-checking method | A mechanical type-checking method | C02/expressions-types | exam depth | - |
| Notes\Current\02 - Expressions and Types.md; Type inference | Type inference | C02/expressions-types | explained | Mixed arithmetic and domains: V1 |
| Notes\Current\02 - Expressions and Types.md; Common errors | Common errors | C02/expressions-types | exam depth | - |
| Notes\Current\02 - Expressions and Types.md; Practice | Practice | C02/expressions-types | exam depth | - |
| Notes\Current\02 - Expressions and Types.md; Mastery check | Mastery check | C02/expressions-types | exam depth | - |
| Notes\Current\03 - Defining Functions.md; The six-part construction process | The six-part construction process | C03/defining-functions | explained | Complete contract and design variants: V13 |
| Notes\Current\03 - Defining Functions.md; Worked example: digit recognition | Worked example: digit recognition | C03/defining-functions | explained | Complete contract and design variants: V13 |
| Notes\Current\03 - Defining Functions.md; Anatomy of a definition | Anatomy of a definition | C03/defining-functions | explained | Complete contract and design variants: V13 |
| Notes\Current\03 - Defining Functions.md; Curried input versus tuple input | Curried input versus tuple input | C03/defining-functions | explained | Complete contract and design variants: V13 |
| Notes\Current\03 - Defining Functions.md; Purpose comments and useful comments | Purpose comments and useful comments | C03/defining-functions | explained | Complete contract and design variants: V13 |
| Notes\Current\03 - Defining Functions.md; Multiple definitions in a module | Multiple definitions in a module | C03/defining-functions | explained | Complete contract and design variants: V13 |
| Notes\Current\03 - Defining Functions.md; Why `else` is mandatory | Why `else` is mandatory | C03/defining-functions | explained | Complete contract and design variants: V13 |
| Notes\Current\03 - Defining Functions.md; Testing strategy | Testing strategy | C03/defining-functions | explained | Complete contract and design variants: V13 |
| Notes\Current\03 - Defining Functions.md; Diagnosing failures | Diagnosing failures | C03/defining-functions | explained | Complete contract and design variants: V13 |
| Notes\Current\03 - Defining Functions.md; Independent practice | Independent practice | C03/defining-functions | explained | Complete contract and design variants: V13 |
| Notes\Current\03 - Defining Functions.md; Mastery check | Mastery check | C03/defining-functions | explained | Complete contract and design variants: V13 |
| Resources/Test1/README.md | Run app, load -i.., run tests; exclude BrokenExamples | C02/first-program; C08/modules | explained | Suite workflow: V6, V14 |
| Resources/Test1/RunAllTests.ps1 | Discover tests, execute each, fail on non-zero status | C10/errors-and-testing | mentioned | Explain supplied runner as a tool: V14 |
| Resources/Test1/TestSupport.hs; assertEqual | Eq/Show constraints, expected/actual report | C09/eq-and-class-constraints; C10/errors-and-testing | explained | Tiny test harness: V14 |
| Resources/Test1/TestSupport.hs; assertTrue | Boolean property checks versus proof | C10/errors-and-testing; C10/proofs-of-programs-i | explained | Harness practice: V14 |
| Resources/Test1/TestSupport.hs; assertApprox | Absolute tolerance for Double | C09/standard-classes | explained | Tolerance and magnitude: V1, V14 |
| Resources/Test1/TestSupport.hs; runTests | sequence [IO Bool], count, and, pure (), exitFailure | C03/input-processing | mentioned | Action sequencing and test outcomes: V10, V14 |

### Existing downloadable lab and topic families

These are existing practice, not proposed additions. Every base question below already has V2 and V3 variants in both download folders. The vault text has no separate Lab 6 sheet; existing Lab 6 download questions are still included. The archived numbering differs from the 2026 sheets. No fresh compiler run is claimed by this audit.

| Source and location | Concept, term, example or exercise | Site page(s) | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| downloads/README.md; Lab1_AddAndSubtract.hs and V2/V3 | Return the sum and difference as a pair | C05/writing-recursive-functions; C06/tuples | explained | V3 |
| downloads/README.md; Lab1_Concatenate.hs and V2/V3 | Concatenate two lists of Int values | C05/writing-recursive-functions; C06/tuples | explained | V3 |
| downloads/README.md; Lab1_DifferenceSequences.hs and V2/V3 | Subtract corresponding sequence terms | C05/writing-recursive-functions; C06/tuples | explained | V3 |
| downloads/README.md; Lab1_Factorial.hs and V2/V3 | Calculate factorial recursively | C05/writing-recursive-functions; C06/tuples | explained | V2 |
| downloads/README.md; Lab1_Fibonacci.hs and V2/V3 | Define Fibonacci numbers and dry run F5 | C05/writing-recursive-functions; C06/tuples | explained | V2 |
| downloads/README.md; Lab1_IsIn.hs and V2/V3 | Test membership in a list of Int values | C05/writing-recursive-functions; C06/tuples | explained | V3 |
| downloads/README.md; Lab1_Length.hs and V2/V3 | Count the elements of a list of Int values | C05/writing-recursive-functions; C06/tuples | explained | V3 |
| downloads/README.md; Lab1_Occurrences.hs and V2/V3 | Count occurrences in a list of Int values | C05/writing-recursive-functions; C06/tuples | explained | V3 |
| downloads/README.md; Lab1_PairProjections.hs and V2/V3 | Extract components using tuple patterns | C05/writing-recursive-functions; C06/tuples | explained | V3 |
| downloads/README.md; Lab1_RangeSum.hs and V2/V3 | Sum all integers in an inclusive range | C05/writing-recursive-functions; C06/tuples | explained | V2 |
| downloads/README.md; Lab1_StructuralInduction.hs and V2/V3 | Prove that the generated set is the positive multiples of 3 | C05/writing-recursive-functions; C06/tuples | exam depth | - |
| downloads/README.md; Lab1_SumFactorials.hs and V2/V3 | Sum factorials from zero to n | C05/writing-recursive-functions; C06/tuples | explained | V2 |
| downloads/README.md; Lab1_SumFirst.hs and V2/V3 | Sum the first n terms of a sequence | C05/writing-recursive-functions; C06/tuples | explained | V2 |
| downloads/README.md; Lab1_SumList.hs and V2/V3 | Sum the terms of a sequence recursively | C05/writing-recursive-functions; C06/tuples | explained | V3 |
| downloads/README.md; Lab1_SumNumbers.hs and V2/V3 | Sum positive integers up to and including n | C05/writing-recursive-functions; C06/tuples | explained | V2 |
| downloads/README.md; Lab1_SumSequences.hs and V2/V3 | Add corresponding sequence terms | C05/writing-recursive-functions; C06/tuples | explained | V3 |
| downloads/README.md; Lab1_Swap.hs and V2/V3 | Rearrange tuple components with a pattern | C05/writing-recursive-functions; C06/tuples | explained | V3 |
| downloads/README.md; Lab1_TupleArithmetic.hs and V2/V3 | Add the components of an integer pair | C05/writing-recursive-functions; C06/tuples | explained | V3 |
| downloads/README.md; Lab2_ConcatLists.hs and V2/V3 | Concatenate two lists of Int values | C06/list-recursion | explained | V3 |
| downloads/README.md; Lab2_ElementOccurs.hs and V2/V3 | Count occurrences in a list of Int values | C06/list-recursion | explained | V3 |
| downloads/README.md; Lab2_IsElementIn.hs and V2/V3 | Test membership in a list of Int values | C06/list-recursion | explained | V3 |
| downloads/README.md; Lab2_ListLength.hs and V2/V3 | Count the elements of a list of Int values | C06/list-recursion | explained | V3 |
| downloads/README.md; Lab2_PowerNum.hs and V2/V3 | Raise an integer to a nonnegative integer power | C06/list-recursion | explained | V2 |
| downloads/README.md; Lab2_SumNumbers.hs and V2/V3 | Sum whole numbers strictly below n | C06/list-recursion | explained | V2 |
| downloads/README.md; Lab3_AtPosition.hs and V2/V3 | Return an index and its list element | C06/lab-03 | explained | V3 |
| downloads/README.md; Lab3_IsSorted.hs and V2/V3 | Check whether a list is sorted in descending order | C06/lab-03 | explained | V3 |
| downloads/README.md; Lab3_LargerY.hs and V2/V3 | Keep list elements larger than a threshold | C06/lab-03 | explained | V3 |
| downloads/README.md; Lab3_PositiveNumbers.hs and V2/V3 | Select all positive integers recursively | C06/lab-03 | explained | V3 |
| downloads/README.md; Lab4_AddSub.hs and V2/V3 | Return the sum and absolute difference of two integers. | C04/case-exam-practice | exam depth | - |
| downloads/README.md; Lab4_GradePointLetter.hs and V2/V3 | Convert exact grade points to letter grades. | C04/case-exam-practice | exam depth | - |
| downloads/README.md; Lab4_GradePoints.hs and V2/V3 | Convert percentage scores to grade points. | C04/case-exam-practice | exam depth | - |
| downloads/README.md; Lab4_LetterGrade.hs and V2/V3 | Convert percentage scores to letter grades. | C04/case-exam-practice | exam depth | - |
| downloads/README.md; Lab4_Recommendation.hs and V2/V3 | Convert percentage scores to university recommendations. | C04/case-exam-practice | exam depth | - |
| downloads/README.md; Lab4_SwapIntegers.hs and V2/V3 | Swap the contents of a pair of integers. | C04/case-exam-practice | exam depth | - |
| downloads/README.md; Lab5_Consonants.hs and V2/V3 | Produce the uppercase consonants of an alphabet. | C06/comprehension-exam-practice | exam depth | - |
| downloads/README.md; Lab5_MarkAverages.hs and V2/V3 | Find each student's test and assignment averages. | C06/comprehension-exam-practice | exam depth | - |
| downloads/README.md; Lab5_PythagoreanTriples.hs and V2/V3 | Generate primitive Pythagorean triples below a bound. | C06/comprehension-exam-practice | exam depth | - |
| downloads/README.md; Lab5_Squares.hs and V2/V3 | Square the odd integers in a list. | C06/comprehension-exam-practice | exam depth | - |
| downloads/README.md; Lab6_LastElement.hs and V2/V3 | Return the last element of a nonempty list. | C09/polymorphism-by-example | exam depth | - |
| downloads/README.md; Lab6_ReverseList.hs and V2/V3 | Reverse a list polymorphically. | C09/polymorphism-by-example | exam depth | - |
| downloads/README.md; Lab6_SwapElements.hs and V2/V3 | Swap the two elements of a polymorphic pair. | C09/polymorphism-by-example | exam depth | - |
| downloads/README.md; Lab6_TwoLists.hs and V2/V3 | Pair corresponding elements from two lists. | C09/polymorphism-by-example | exam depth | - |
| downloads/README.md; Rec_* with V2/V3 | Rec question family | C05/writing-recursive-functions | explained | V2 |
| downloads/README.md; List_* with V2/V3 | List question family | C06/list-recursion | explained | V3, V9 |
| downloads/README.md; Guard_* with V2/V3 | Guard question family | C04/case-exam-practice | exam depth | - |
| downloads/README.md; Comp_* with V2/V3 | Comp question family | C06/comprehension-exam-practice | exam depth | - |
| downloads/README.md; Hof_* with V2/V3 | Hof question family | C07/applying-by-hand; C07/more-higher-order-functions | exam depth | - |
| downloads/README.md; Data_* with V2/V3 | Data question family | C08/data-types-exam-practice | exam depth | - |
| downloads/README.md; Poly_* with V2/V3 | Poly question family | C09/polymorphism-by-example; C09/eq-and-class-constraints | exam depth | - |
| downloads/README.md; Lazy_* with V2/V3 | Lazy question family | C10/lazy-evaluation; C10/infinite-data-structures | exam depth | - |
| downloads/README.md; Proof_* with V2/V3 | Proof question family | C10/proof-patterns; C10/lab-proof-patterns | exam depth | - |

## 2. Question-type inventory

"Practice" below means a place where the student can attempt that form, not merely see a keyword. Chapter Q/R supplement the named lessons. The last column distinguishes an exact exercise from a transferable pattern.

| Question type and source | Where the student practises now | Remaining need |
| --- | --- | --- |
| Start GHCi, explain the prompt, choose a command (Lab 1 Tasks 1-2; Test1 01) | C02/ghci; C03/lab-01; C02/Q/R | Basic form covered; debugger and multi-module sessions in V6 |
| Predict an expression's value and parenthesisation (Lab 1 Task 3; Test1 04) | C02/expressions-types; C02/Q; C09/standard-classes | Signed arithmetic and exponent choices: V1 |
| State or infer a type, instantiate variables, unify a call (Lab 1 Task 4; Test1 03/11; handout 4) | C09/polymorphism-by-example; C09/eq-and-class-constraints; C09/Q/R | Exam depth for general inference; no repeat lane |
| Classify literal/name/constructor and repair capitalisation or quotes (Lab 1 Tasks 3/5; Test1 BrokenExamples) | C02/values-text; C03/output; C03/lab-01 | Advanced identifier/operator and legacy syntax repair: V16 |
| Predict exact terminal output, including quotes and newlines (Test1 01-03; LogicalErrorApp) | C03/output; C03/lab-01; C03/Q | Basic output covered; printf/character output in V10 |
| Explain pure value versus action, let versus <-, IO () (Test1 02/14) | C03/input-processing; C03/output; C03/Q/R | More action sequencing and final-do-line problems: V10 |
| Write a function from a prose specification (all labs; Test1 05) | C03/defining-functions; C10/specification; chapter Q | Further narrated design and formal contracts: V2, V3, V13 |
| Implement the same choice with if, guards, patterns and case (Making Choices Lab 2; Test1 06) | C04/case-by-example; C04/case-exam-practice; C04/lab-02 | Exam depth; no new case or where lane |
| Trace first matching alternative, overlapping equations or guard fall-through (Test1 06/07) | C04/case-exam-practice; C03/where-exam-practice | Exam depth |
| Identify an uncovered pattern or a crashing input (Test1 07/08; Lab 4 textbook A.4) | C04/case-exam-practice; C08/data-types-exam-practice | Generic form covered; custom zipWithx stopping cases in V4 |
| Write recursive specification, base/step, dry run and tests (Recursion Continued Q1-4; Making Choices exercises) | C05/dry-running; C05/writing-recursive-functions; C06/lab-03 | Multiple narrated numeric/list designs: V2, V3 |
| Compare inclusive/exclusive bounds; handle zero and negatives (rangeSum, sumFac; 2026 Lab 2 Q2-3) | C05/writing-recursive-functions; existing Rec_ and Lab1_ downloads | Deeper independent design: V2 |
| Return an index/value pair, test invalid bounds (Lab 3 Q1; Test1 08) | C06/lab-03; C09/either-in-depth; existing Lab3_AtPosition files | Exact recursive implementation and variations: V3 |
| Build a list with a comprehension, trace output order, count results (2026 Lab 2 Q4; Test1 10) | C06/comprehension-templates; C06/comprehension-exam-practice | Exam depth |
| Translate comprehension, recursion, map/filter/concatMap (2026 Lab 3 Q3; Test1 10/11) | C06/comprehension-exam-practice; C07/applying-by-hand | Exam depth for translations; more recursive construction in V3 |
| Evaluate a higher-order call by substitution (Lab 5 Q4; Test1 11) | C07/applying-by-hand; C07/more-higher-order-functions | Exam depth |
| Design a combining function under a restriction: foldr, no map (Lab 4 Q1; Lab 5 Q5; textbook C.1-C.4) | C07/folds-and-composition contains definitions; C07/applying-by-hand supplies traces | Exact synthesis practice: V4 |
| Calculate weighted marks, convert Int, use zipWith and then lambda (Lab 4 Q2a-c) | C07/zip-and-zipwith; C09/standard-classes | Full weighted-mark lab with variations: V4 |
| Generalise a function to three lists and change its signature (Lab 4 Q3; textbook C.6-C.8) | C07/more-higher-order-functions; C09/polymorphism-by-example | Derive zipWithx rather than call zipWith3: V4 |
| Explain partial application, returned function, curry/uncurry or point-free form (Lab 5 Q1-4; Test1 11) | C07/currying-and-sections; C07/applying-by-hand | Exam depth |
| Declare data for a scenario, implement each constructor, derive/write an instance (Test1 13/16) | C08/data-types-by-example; C08/data-types-exam-practice | Exam depth for data modelling; opaque module invariant in V6 |
| Expand a parameterised type alias and repair its declaration (handout 7; Test1 13) | C08/type-synonyms; C08/Q | Three-variation teaching and alias/parser exercises: V5 |
| Write module header/export list/imports and a client (Test1 12; MyCalculator) | C08/modules; C08/imports; C08/Q | Multi-file exam tasks and corrections: V6 |
| Read, parse, validate and report two independent inputs (Test1 14) | C03/input-processing; assumed C09/maybe-either-exam-practice | Pure Maybe/Either handling covered; repeat/sequence IO tasks in V10 |
| Find a type, scope, parse, class, import or logical error (all Test1 tests; labs) | C10/errors-and-testing; chapter Q; new exam-practice lessons | Integrated multi-file diagnosis in V14; module rule repair in V6 |
| Prove a universal property, generalise an accumulator claim, find a counterexample (handout 7 homework; Test1 15) | C10/proofs-of-programs-i; C10/proof-patterns; C10/lab-proof-patterns | General proof patterns are exam depth; the exact factorial specification-correctness homework still needs V13 |
| Derive time/space cost and compare two algorithms (Test1 15; outline) | C10/complexity; C10/Q | Accurate recurrences, assumptions and space accounting: V12 |
| Decide what is demanded, whether evaluation terminates, or observe a finite prefix (lecture lazy language; outline) | C10/lazy-evaluation; C10/infinite-data-structures | Exam depth, including seq and strict folds |
| Integrate record, safe average, classification, comprehension and reporting (Test1 16) | C08/data-types-exam-practice; C09/maybe-either-exam-practice; existing data downloads | Full grade-book, independent mock and marking: V14 |
| Test boundaries and compare implementations; approximate numeric answers (Test1 *Test.hs and TestSupport) | C10/errors-and-testing; C09/standard-classes; existing paired downloads | Write/use harness, interpret suite failures and policies: V14 |

## 3. Siblings

These are concrete neighbouring questions beyond the vault's named requests. They are not claims that every item is explicitly on the syllabus. Priority follows proximity to the supplied exercises; wider library and class material comes later. Coverage is assessed per row. A citation to a page that merely uses a function does not promote it to exam depth. "No" means no teaching found; "partial" means present at the stated depth; "yes" means exam depth. The S identifiers count sibling entries, not the number of functions grouped in a tightly related family.

| ID / topic | Neighbouring concept or examinable variation | Coverage and site evidence | Depth | Gap / lane |
| --- | --- | --- | --- | --- |
| S001 / 01 Hello World | Script without main versus executable Main; -o and runghc | partial: C02/first-program | explained | V6 |
| S002 / 01 Hello World | :browse, :show modules, :show paths, :! and -i search paths | partial: C02/ghci; C08/modules | explained | V6 |
| S003 / 01 Hello World | :break, :trace, :history, :list, :print and :force workflow | No | none | V6 |
| S004 / 02 Output | putChar versus putStr and print on Char | partial: C03/output | mentioned | V10 |
| S005 / 02 Output | Escaped newline, tab, quote and backslash in output | partial: C03/output; C02/values-text | explained | V7 |
| S006 / 02 Output | printf %.2f and integer/text placeholders | No; Test1 11 uses printf | none | V10 |
| S007 / 02 Output | mapM_ putStrLn versus map putStrLn; list of actions versus execution | partial: C07/zip-and-zipwith | explained | V10 |
| S008 / 02 Output | sequence_ and sequencing with >> | No | none | V10 |
| S009 / 03 Values/types | Defaulting versus inference, numeric annotations and ambiguous read | partial: C02/expressions-types; C09/standard-classes | explained | V1, V15 |
| S010 / 03 Values/types | Function arrow grouping versus application grouping | yes: C09/polymorphism-by-example; C07/applying-by-hand | exam depth | - |
| S011 / 03 Values/types | Numeric range limits, Int overflow, Integer cost assumptions | partial: C02/expressions-types; C09/standard-classes | explained | V1, V12 |
| S012 / 03 Values/types | Unit (), Bool, Ordering and product/sum shapes | yes: assumed C09/maybe-either-exam-practice; C08/data-types-by-example | exam depth | - |
| S013 / 04 Arithmetic | div/mod versus quot/rem on all sign combinations | partial: C09/standard-classes only lists quot/rem | mentioned | V1 |
| S014 / 04 Arithmetic | divMod versus quotRem and quotient-remainder identities | partial: C03/where-and-local-definitions uses divMod; no quotRem | mentioned | V1 |
| S015 / 04 Arithmetic | ^, ^^ and **; negative/fractional exponents and types | partial: C09/standard-classes | mentioned | V1 |
| S016 / 04 Arithmetic | negate, abs, signum and subtract; (-n) is not subtraction section | partial: C09/standard-classes; C07/currying-and-sections | explained | V1 |
| S017 / 04 Arithmetic | fromIntegral versus toInteger; conversion before division | partial: C09/standard-classes | explained | V1, V4 |
| S018 / 04 Arithmetic | floor/ceiling/truncate on negatives; round ties to even | partial: C09/standard-classes has examples and answers | explained | V1 |
| S019 / 04 Arithmetic | gcd/lcm, signs, zero and Euclid's algorithm | partial: Rec_Gcd downloads; no dedicated lesson | mentioned | V2 |
| S020 / 04 Arithmetic | recip and / on zero; Double Infinity/NaN versus integral exception | partial: C03/defining-functions; C10/specification | explained | V1 |
| S021 / 04 Arithmetic | sqrt/log/exp and trigonometric functions; radians and domains | partial: C09/standard-classes lists some | mentioned | V1 |
| S022 / 04 Arithmetic | Floating equality, approximate comparison, absolute/relative tolerance | partial: C09/standard-classes | explained | V1 |
| S023 / 05 Functions | Purpose/pre/postcondition with explicit domain and codomain | partial: C10/specification | explained | V13 |
| S024 / 05 Functions | Tuple return versus two inputs; swap, fst and snd | yes: C09/polymorphism-by-example; C06/tuples | exam depth | - |
| S025 / 05 Functions | Operator definitions and infixl/infixr/infix declarations | No | none | V16 |
| S026 / 05 Functions | Apostrophes, _ wildcard versus _name, reserved words, symbolic names | partial: C03/defining-functions; C02/first-program | explained | V16 |
| S027 / 05 Functions | let/in, nested where, local helpers, shadowing and layout | yes: C03/where-and-local-definitions; C03/where-exam-practice | exam depth | - |
| S028 / 05 Functions | Multi-argument lambdas and tuple-pattern lambdas | yes: C07/lambdas; C07/applying-by-hand | exam depth | - |
| S029 / 06 Choices | Pattern guards and guarded-case fall-through | yes: C04/case-by-example; C04/case-exam-practice | exam depth | - |
| S030 / 06 Choices | Strict versus non-strict inequalities at cut-offs; invalid-domain precedence | partial: C04/lab-02; C10/specification | explained | V13 |
| S031 / 06 Choices | XOR, implication, equivalence, De Morgan laws and truth tables | partial: C04/pattern-matching; C10/specification | explained | V13 |
| S032 / 06 Choices | Vacuous truth for all/any; universal/existential predicates | partial: C07/applying-by-hand; C10/specification | explained | V13 |
| S033 / 06 Choices | Non-exhaustive and overlapping patterns, repair warning inputs | yes: C04/case-exam-practice | exam depth | - |
| S034 / 07 Patterns | As-patterns and nested list/tuple/data patterns | yes: C04/case-by-example; C04/case-exam-practice | exam depth | - |
| S035 / 07 Patterns | Lazy pattern bindings versus strict case demand | yes: C10/lazy-evaluation; C03/where-and-local-definitions | exam depth | - |
| S036 / 07 Patterns | n+k legacy patterns versus guards; arithmetic expressions are not patterns | No | none | V16 |
| S037 / 07 Patterns | Repeated variable in a pattern versus Eq guard | partial: C04/pattern-matching; C09/eq-and-class-constraints | explained | V16 |
| S038 / 08 Lists/tuples | take/drop/splitAt including n<0 and beyond length | partial: C06/lists; C10/proof-patterns | explained | V3 |
| S039 / 08 Lists/tuples | head/tail/last/init/!! partiality and safe implementations | partial: C06/lists; C06/lab-03; assumed safe Maybe lesson | explained | V3 for recursive implementations only |
| S040 / 08 Lists/tuples | zip/unzip/zip3/zipWith3 shortest input and type changes | yes: C07/applying-by-hand; C07/more-higher-order-functions; C10/proof-patterns | exam depth | - |
| S041 / 08 Lists/tuples | concat and nested-list flattening; [] versus [[]] | yes: C10/proof-patterns; C06/comprehension-exam-practice | exam depth | - |
| S042 / 08 Lists/tuples | words/unwords with repeated whitespace and empty input | partial: words used in C01/functional-thinking; no unwords | mentioned | V8 |
| S043 / 08 Lists/tuples | lines/unlines, trailing newline and empty lines | partial: C06/lists names lines only | mentioned | V8 |
| S044 / 08 Lists/tuples | intersperse/intercalate and joining String versus [String] | partial: C08/imports names intercalate | mentioned | V8 |
| S045 / 08 Lists/tuples | Data.List.transpose on rectangular/ragged/empty matrices | partial: C06/comprehension-templates teaches a comprehension transpose | mentioned | V8 for library semantics |
| S046 / 08 Lists/tuples | repeat/replicate/cycle/iterate, finite observation and empty cycle | yes: C07/more-higher-order-functions; C10/infinite-data-structures | exam depth | - |
| S047 / 09 Recursion | Signed repeated-addition multiply and zero multiplier | partial: C05/writing-recursive-functions | explained | V2 |
| S048 / 09 Recursion | Recursive powers; exponentiation by squaring | partial: Rec_Power downloads only | mentioned | V2 |
| S049 / 09 Recursion | Digit sum/count/reversal, decimal decomposition with divMod | partial: C03/where-exam-practice; Rec_Digits downloads | explained | V2 |
| S050 / 09 Recursion | Inclusive/exclusive range sums, reversed endpoints and sum of factorials | partial: C05/writing-recursive-functions | explained | V2 |
| S051 / 09 Recursion | Fibonacci accumulator, repeated subproblems and two-branch recurrence | partial: C05/dry-running; C10/complexity | explained | V2, V12 |
| S052 / 09 Recursion | Mutual recursion and proof over even/odd functions | yes: C10/proof-patterns; C10/lab-proof-patterns | exam depth | - |
| S053 / 10 List processing | Count versus select versus transform in one recursive traversal | partial: C06/list-recursion; downloads List_* | explained | V3 |
| S054 / 10 List processing | Adjacent-pair sortedness, duplicates and strict ordering | partial: C06/lab-03; C06/list-recursion | explained | V3 |
| S055 / 10 List processing | Recursive append, interleave and accumulator reverse | partial: C06/list-recursion; downloads List_Append/List_Reverse | explained | V3 |
| S056 / 10 List processing | Safe extrema, empty input and initial accumulator pitfalls | partial: C06/lists; downloads List_Maximum | explained | V3 |
| S057 / 10 List processing | find/findIndex/elemIndex; first match versus every match | No | none | V8 |
| S058 / 10 List processing | nub/delete/group/isPrefixOf with Eq constraints | yes: C09/eq-and-class-constraints | exam depth | - |
| S059 / 10 List processing | isSuffixOf/isInfixOf and stripPrefix | No | none | V8 |
| S060 / 10 List processing | sort/sortBy; compare on a projected key; stable ties | partial: C08/imports uses sort; no sortBy | mentioned | V9 |
| S061 / 10 List processing | insert, insertion sort, merge and merge sort | partial: List_InsertionSort/List_Merge downloads | mentioned | V9 |
| S062 / 10 List processing | nub versus group . sort; run lengths versus frequencies | partial: C08/imports; equality aspects covered in C09 | explained | V9 for sorting pipeline only |
| S063 / 11 Higher-order | foldr1/foldl1, scanl/scanr and scanl1/scanr1 | yes: C07/applying-by-hand; C07/more-higher-order-functions | exam depth | - |
| S064 / 11 Higher-order | span/break/partition and takeWhile/filter distinction | yes: C07/applying-by-hand; C07/more-higher-order-functions | exam depth | - |
| S065 / 11 Higher-order | concatMap, until and list of functions | yes: C07/more-higher-order-functions | exam depth | - |
| S066 / 11 Higher-order | Derive filter/map/count/product as a fold from recursive equations | partial: C07/folds-and-composition definitions | explained | V4 for synthesis |
| S067 / 11 Higher-order | zipWithx arbitrary element types and every empty-list permutation | partial: C07/more-higher-order-functions uses zipWith3 | explained | V4 |
| S068 / 11 Higher-order | Dot product, weighted mean and three-test mark pipeline | partial: C07/zip-and-zipwith; C09/standard-classes | explained | V4 |
| S069 / 11 Higher-order | flip/curry/uncurry, composition, $, sections and manual substitution | yes: C07/applying-by-hand | exam depth | - |
| S070 / 12 Modules | T versus T(..) versus T(C1); opaque constructor exports | partial: C08/modules | explained | V6 |
| S071 / 12 Modules | Type synonym hiding and implicit Prelude hiding errors | partial: C08/imports and C08/type-synonyms contain misleading rules | explained | V6 |
| S072 / 12 Modules | Abstract stack/queue interface and invariant-preserving smart constructor | partial: C08/modules; C08/custom-types | mentioned | V6 |
| S073 / 12 Modules | Hierarchical module names, file search paths and cyclic imports | partial: C08/modules; C02/first-program | mentioned | V6 |
| S074 / 12 Modules | Qualified aliases and ambiguous names versus not-in-scope | partial: C08/imports | explained | V6 |
| S075 / 12 Modules | Map.fromList/lookup/insert/delete/member; duplicate-key policy | partial: C08/imports shows lookup/insert/member only | explained | V9 |
| S076 / 12 Modules | Set.fromList/member/insert/delete/union/intersection/difference | partial: C08/imports shows fromList/member/size | explained | V9 |
| S077 / 12 Modules | containers package versus base; no extra package install for examples assumed | partial: C08/imports names modules | mentioned | V9 |
| S078 / 12 Modules | Parameterised module functors versus higher-order functions and Functor class | partial: C09/maybe-and-instances names Functor only | mentioned | V6, V11 |
| S079 / 13 Custom types | Enumeration, fields, records, newtype and multi-parameter types | yes: C08/data-types-by-example; C08/data-types-exam-practice | exam depth | - |
| S080 / 13 Custom types | Recursive node/leaf-labelled trees, expression trees and mutual types | yes: C08/data-types-by-example; C10/proof-patterns | exam depth | - |
| S081 / 13 Custom types | Derived ordering compares constructor then fields; manual Eq/Ord/Show | yes: C08/data-types-by-example; C09/eq-and-class-constraints | exam depth | - |
| S082 / 13 Custom types | Type synonym saturation, parameter order and alias expansion | partial: C08/type-synonyms | explained | V5 |
| S083 / 13 Custom types | Parser alias: several parses, unconsumed suffix, failure as [] | partial: C08/type-synonyms only declares Parser | mentioned | V5 |
| S084 / 13 Custom types | Record selector partiality on a missing constructor | yes: C08/data-types-by-example; C08/data-types-exam-practice | exam depth | - |
| S085 / 14 I/O | readMaybe and read/show type annotations | yes: assumed C09/maybe-in-depth and maybe-either-exam-practice | exam depth | - |
| S086 / 14 I/O | getChar versus getLine and leftover newline | partial: C03/input-processing | mentioned | V10 |
| S087 / 14 I/O | readLn versus getLine then read; malformed input | No | none | V10 |
| S088 / 14 I/O | Recursive prompt-until-valid and sentinel-driven loop | No | none | V10 |
| S089 / 14 I/O | getContents/interact and whole-input processing | No | none | V10 |
| S090 / 14 I/O | readFile/writeFile/appendFile pure-core pipeline | No | none | V10 |
| S091 / 14 I/O | sequence [IO a] versus sequence_; mapM versus mapM_ | partial: mapM_ example in C07/zip-and-zipwith | mentioned | V10 |
| S092 / 14 I/O | return/pure do not exit a function; when/unless need IO () branches | partial: C03/input-processing uses return/pure | mentioned | V10 |
| S093 / 14 I/O | Maybe/Either eliminators, helpers, conversion and failure chaining | yes: assumed C09/maybe-in-depth; either-in-depth | exam depth | - |
| S094 / 14 I/O | fmap on lists/Maybe/Either and Functor laws; custom Tree instance | partial: C09/maybe-and-instances; assumed Maybe/Either maps covered | explained | V11 for abstraction/custom instance |
| S095 / 14 I/O | pure/<*> lifting two independent possibly failing values | No; Test1 Recursion.hs uses <*> | none | V11 |
| S096 / 14 I/O | >>= dependent computation, list branching and do desugaring | partial: C03/input-processing; assumed Maybe/Either chains covered | explained | V11 for general class/list case |
| S097 / 15 Reasoning | Correctness of factorial versus positivity of factorial | partial: C10/proof-patterns proves positivity; the exact product-specification claim is absent | explained | V13 |
| S098 / 15 Reasoning | Fold fusion, accumulator generalisation, structural/mutual/strong induction | yes: C10/proof-patterns; C10/lab-proof-patterns | exam depth | - |
| S099 / 15 Reasoning | Partial versus total correctness; explicit termination measure | partial: C10/specification; C05/termination-and-errors | explained | V13 |
| S100 / 15 Reasoning | T(n)=T(n-1)+1 versus T(n)=2T(n/2)+n | partial: C10/complexity uses an over-broad branching rule | mentioned | V12 |
| S101 / 15 Reasoning | Best/worst case, two input sizes, logarithmic divide-and-conquer | No | none | V12 |
| S102 / 15 Reasoning | Stack, accumulator thunks, retained list prefixes and output space | partial: C10/complexity; C10/lazy-evaluation | explained | V12 |
| S103 / 15 Reasoning | Sharing of invariant computations; optimisation assumptions | partial: C10/complexity makes unconditional length-in-comprehension claim | explained | V12 |
| S104 / 15 Reasoning | seq, $!, WHNF versus deep forcing, foldl' | yes: C10/lazy-evaluation | exam depth | - |
| S105 / 15 Reasoning | Productive cycles, ones, numsFrom, infinite tree, Fibonacci and sieve | yes: C10/infinite-data-structures | exam depth | - |
| S106 / 16 Capstone | Average of student averages versus average of all marks | partial: Test1 GradeBook; no full site capstone | mentioned | V14 |
| S107 / 16 Capstone | Empty class, no marks, invalid mark, duplicate name and unequal weights | partial: data/Maybe lessons teach components | explained | V14 |
| S108 / 16 Capstone | Core/model/report modules and pure versus IO tests | partial: C08/modules; C10/errors-and-testing | explained | V14 |
| S109 / 16 Capstone | assertEqual, assertApprox, failure labels and runner exit status | partial: C10/errors-and-testing | mentioned | V14 |
| S110 / 16 Capstone | Independent timed mock, marking rubric and diagnose unfamiliar program | partial: chapter Q/R cover individual topics | explained | V14 |
| S111 / Lecture character functions | ord/chr with Unicode code points; invalid chr range | partial: C08/imports names code functions | mentioned | V7 |
| S112 / Lecture character functions | isAscii/isUpper/isLower/isAlpha/isAlphaNum predicates | partial: C08/imports library list | mentioned | V7 |
| S113 / Lecture character functions | isDigit versus digitToInt/intToDigit and guarded conversion | partial: assumed Maybe lesson parses a digit; library functions not taught | mentioned | V7 |
| S114 / Lecture character functions | isSpace versus literal ' '; tabs and empty String | No | none | V7 |
| S115 / Lecture character functions | map toUpper on String versus map (map toUpper) on [String] | partial: C07/map-and-filter; C08/imports | explained | V7 |
| S116 / Lecture classes | Ord laws, compare/min/max and Eq consistency beyond derived data | partial: C09/standard-classes | explained | V15 |
| S117 / Lecture classes | Show/Read round trip, contextual type choice and failures | partial: C09/standard-classes | explained | V15 |
| S118 / Lecture classes | Enum methods succ/pred/toEnum/fromEnum and boundary errors | partial: C09/standard-classes; C08/data-types-by-example covers derived enumerations | explained | V15 for library method/error questions only |
| S119 / Lecture classes | Bounded does not imply Enum; enumerate only with both constraints | partial: C09/standard-classes | explained | V15 |
| S120 / Lecture classes | Real/RealFrac and Floating in the numeric class graph | partial: C09/standard-classes omits intermediate hierarchy detail | mentioned | V15 |
| S121 / Lecture classes | Infer multiple minimal constraints without requiring Eq unnecessarily | yes: C09/eq-and-class-constraints; C09/polymorphism-by-example | exam depth | - |

## 4. Follow-on lanes

Order: direct lab/test construction first, then nearby library/application questions, then wider class and syntax variants. The V identifiers are stable cross-references from the tables. Each lane creates one or two lessons and addresses only the listed gaps. Existing exam-depth teaching is a prerequisite to link, not material to write again. The lead can wire the sidebar and extend chapter Q/R/CS after integration; those shared files are not lane-owned.

Every concept below must receive the brief's complete pattern: plain explanation, a general template, at least the stated number of distinct worked variations, an exam question with narrated reasoning, common errors with checked compiler messages, and answered practice. Minimum exam totals are per lane and must still include at least one question for every concept, so the larger requirement wins. A variation changes the type, data shape, boundary or constraint rather than just renaming values. Downloads listed in section 5 supplement this teaching.

### Lane V1: arithmetic choices, numeric domains and conversions

Files: `content/docs/sem3/csi243/02-expressions-types/notes/arithmetic-by-example.mdx` and `content/docs/sem3/csi243/02-expressions-types/notes/arithmetic-exam-practice.mdx`.

Extend `expressions-types.mdx` and sit beside `values-text.mdx`, linking `09-polymorphism/notes/standard-classes.mdx`. Chapter 2 sidebar: after Expressions and Types, before Values, Names, Types, and Text; practice immediately after its lesson.

Cover precedence and associativity with full arithmetic/Boolean traces; construct expressions from prose; `div`/`mod` against `quot`/`rem` on all sign combinations; `divMod`/`quotRem` and their identities; `^`, `^^`, `**` and their domains; repeated addition/multiplication and the non-negative precondition of `squareByAdding`; `negate`, `abs`, `signum`, `subtract`, `recip`; `fromIntegral`, `toInteger`, conversion before division; `floor`, `ceiling`, `truncate`, half-to-even `round`; numeric annotations, defaulting and Int limits; approximate equality, absolute/relative tolerance, Infinity and NaN; `sqrt`, `log`, `exp`, `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, radians and domain restrictions. Separate type errors from undefined mathematical inputs and floating results. Do not imply exponentiation by a fractional power is exact or that every zero division raises an exception.

Minimum: three worked variations per operator/function/conversion, four per signed quotient/remainder operation and exponent family, including zero and negative cases; at least eighteen narrated exam questions, plus additional questions if needed to cover every concept. Repair the book/Test1 implication that `sum (replicate (fromIntegral n) n) == n*n` holds for negative n. Existing round and conversion examples should be referenced before adding genuinely different cases.

### Lane V2: designing recursive numeric algorithms

Files: `content/docs/sem3/csi243/05-recursion/notes/numeric-recursion-by-example.mdx` and `content/docs/sem3/csi243/05-recursion/notes/numeric-recursion-exam-practice.mdx`.

Extend `writing-recursive-functions.mdx` and `dry-running.mdx`. Chapter 5 sidebar: after Writing Recursive Functions, before Dry Running; put the new practice after Dry Running. Existing Rec_ and Lab1_ downloads are prerequisites and must not be re-created.

Cover the full specification-to-tests process for factorial variants, inclusive/exclusive sums, range sums with a stated reversed-bounds policy, `sumFac`, `cube`/`multTen` as simple starting specifications, signed multiplication by repeated addition, recursive power, exponentiation by squaring, Euclid `gcd` and derived `lcm`, decimal digit sum/count/reversal and Fibonacci with an accumulator. Distinguish one recursive call, changing both parameters, and repeated work in two branches. Keep domains and decreasing measures explicit; show equivalent if/guard/pattern definitions only where it helps a new algorithm, since conversion itself is covered. Cross-link V11 for the existing Either Fibonacci applicative expression, V12 for cost and existing proof pages for correctness.

Minimum: four worked variations per algorithm family, including zero, negative-domain policy and another recurrence or bound; at least twelve narrated exam questions. Include repair-a-base-case, derive-a-recurrence, dry-run-a-new-function and choose-an-accumulator tasks. Do not write another factorial induction lesson.

### Lane V3: designing recursive list functions and boundary cases

Files: `content/docs/sem3/csi243/06-lists-tuples/notes/recursive-list-design.mdx` and `content/docs/sem3/csi243/06-lists-tuples/notes/recursive-list-exam-practice.mdx`.

Extend `list-recursion.mdx`, `lab-03.mdx` and `lab-03a.mdx`. Chapter 6 sidebar: after List Recursion, before the Lab 03 lessons; practice immediately after the design lesson. Link existing List_ and Lab2_/Lab3_ downloads.

Cover each Recursion Continued question (`atPosition`, `largerY`, `positiveNumbers`, descending `isSorted`) with its signature, base/step, narrated dry run and test design. Add the 2026 `sums`, `multList` and `has` tasks; recursive count/select/transform, `take`, `drop`, `splitAt`, `takeWhile`, append/interleave, accumulator reverse and safe extrema. Use no-library restrictions where specified. Teach empty, singleton, unequal-list and strict/non-strict sortedness cases; preserve the original index through a helper; reject index equal to length. Explain when `head`, `tail`, `last`, `init` and `!!` demand missing data. Safe-result consumption is already covered in Maybe/Either; concentrate on deriving the recursive algorithm. Sorting belongs to V9.

Minimum: four worked variations per recursive shape and per original lab question, three per additional named function, at least fifteen narrated exam questions. Include negative/oversize take/drop counts, no matching elements, all matching elements and duplicate sorted values.

### Lane V4: the exact fold and zip laboratory, designed from first principles

Files: `content/docs/sem3/csi243/07-higher-order/notes/designing-folds-and-zips.mdx` and `content/docs/sem3/csi243/07-higher-order/notes/lab-04-folds-and-zips.mdx`.

Extend `folds-and-composition.mdx` and sit beside `zip-and-zipwith.mdx`; use `applying-by-hand.mdx` for tracing prerequisites. Chapter 7 sidebar: design after Folds and Composition; lab after Zip and ZipWith and More Higher-Order Functions.

Cover exact October Lab 4 Q1, Q2a-c and Q3, Lab 5 Q5, and textbook Appendix C. Derive the fold seed and combining function from recursive equations, including `sumsq` without `map`, product, length, conditional count, cube totals, `map` and `filter` as folds. Derive `ff`, `fmark`, the direct lambda formula and correct Int-to-Double conversion; generalise to three weights; dot product. Derive `zipWithx :: (a -> b -> c -> d) -> [a] -> [b] -> [c] -> [d]`, `fp`, the recursive case and all shortest-list stopping cases; contrast calling existing `zipWith3` with implementing the requested function. Include malformed arity, wrong operator argument, all-empty-only base case and partially printed output before a crash. State empty sums/products and negative n policy. Do not repeat the twenty already-covered higher-order tracing concepts.

Minimum: four worked variations per design concept and original lab question/subpart, three for each Appendix C adaptation; at least twelve narrated exam questions plus every original lab part as a fully answered task. Use a commented complete lab program and a normal/boundary/invalid test grid.

### Lane V5: type synonyms, parameter substitution and tiny parser values

Files: `content/docs/sem3/csi243/08-modules-types/notes/type-synonyms-in-depth.mdx` and `content/docs/sem3/csi243/08-modules-types/notes/type-synonym-exam-practice.mdx`.

Extend `type-synonyms.mdx`. Chapter 8 sidebar: immediately after Type Synonyms, before Custom Types; practice after the new lesson. Cross-link data examples already at exam depth.

Cover `String`, `Pos`, `Board`, `Course`, `Assoc k v`, `Pair a` and `Parser a` through expansion, concrete instantiation, aliases built from aliases, parameter ordering, saturation and function signatures. Write keys/values/table operations and a few tiny character/digit parsers represented as functions returning a list of result/suffix pairs; show failure, one result, multiple results and leftover input. This is about reading/using the alias, not a new parser framework. Compare aliases with newtype/data through type-checking decisions; repair `data Course = (title, code, credits)`, undeclared parameters and recursive aliases. State correct import/export behaviour and defer its full module mechanics to V6.

Minimum: four worked variations per synonym shape, three per parser result shape/error, at least ten narrated exam questions. Include expand-a-type, infer-a-client-signature, model-a-domain, explain-no-extra-type-safety and repair-a-declaration tasks.

### Lane V6: modules, abstraction and real GHCi diagnostic sessions

Files: `content/docs/sem3/csi243/08-modules-types/notes/modules-and-abstraction-practice.mdx` and `content/docs/sem3/csi243/08-modules-types/notes/module-debugging-exam-practice.mdx`.

Extend `modules.mdx`, `imports.mdx` and the tool work in `02-expressions-types/notes/first-program.mdx` and `ghci.mdx`. Chapter 8 sidebar: after Importing, before Type Synonyms; debugging practice immediately after the new module lesson.

Cover building and testing Geometry/MyCalculator-style core/client/test modules, filenames and hierarchical paths, `-i` search paths, `Main`, interpreted versus compiled execution and `.hi`/`.o` roles. Practise export lists, `T` versus `T(..)` versus selected constructors, explicit type-name scope, qualified/aliased imports, Prelude name clashes, cyclic dependencies and missing modules. Build an opaque stack or validated mark interface with representation invariants and smart constructors. Explicitly correct "types/synonyms cannot be hidden/are always exported": the importing module's source-level names are controlled by imports/exports, even when the compiler knows hidden types internally. Correct the implication that an unqualified import prevents qualified access. Explain the outline's parameterised module/functor term, distinguish it from Haskell `Functor`, and demonstrate Haskell's ordinary alternatives using function/type parameters rather than inventing module syntax.

The debugging lesson supplies complete GHCi sessions for `:browse`, `:show modules`, `:show paths`, `:!`, load/reload, `:break`, `:trace`, `:history`, `:list`, `:print` and `:force`; distinguish observation from forcing a lazy binding. Tie each command to an actual failing small program. Include tool-role questions from Lecture 2 rather than a catalogue alone.

Minimum: three worked variations per import/export/interface/tool concept and per debugger command, four distinct multi-file programs, at least twelve narrated exam questions. Flag the old module/type-synonym claims for the lead to correct in the existing lessons and their Q/R/CS; a new page must not leave contradictory review answers unreported.

### Lane V7: characters, codes and whole-string transformations

Files: `content/docs/sem3/csi243/06-lists-tuples/notes/characters-and-data-char.mdx` and `content/docs/sem3/csi243/06-lists-tuples/notes/character-exam-practice.mdx`.

Extend `02-expressions-types/notes/values-text.mdx`, `04-making-choices/notes/lab-02.mdx` and `08-modules-types/notes/imports.mdx`. Chapter 6 sidebar: after Lists and before Tuples; character practice immediately after the new character lesson.

Cover `ord`, `chr`, Unicode versus the ASCII subset, valid code-point domain, numeric escapes, newline/tab/backslash/quote escapes, `toUpper`, `toLower`, `isAscii`, `isUpper`, `isLower`, `isAlpha`, `isDigit`, `isAlphaNum`, `isSpace`, guarded `digitToInt`/`intToDigit` and predicate differences. Explain there is no empty Char; distinguish `' '` from `""`, space counting from whitespace counting, and the lecture's informal getCode/getChar operations from actual `ord`/`chr` and input action `getChar`. Build character and String normalisers, then `[String]` transformations with nested map. Repair the Currying slide's `map toUpper :: [String] -> [String]` mismatch. Do not repeat generic comprehension or safe Maybe design already covered.

Minimum: three worked variations per named function/escape family, including nonletters and boundary cases, four for String versus [String] transformations; at least twelve narrated exam questions.

### Lane V8: text and list library operations beyond the usual examples

Files: `content/docs/sem3/csi243/06-lists-tuples/notes/text-and-list-library.mdx` and `content/docs/sem3/csi243/06-lists-tuples/notes/list-library-exam-practice.mdx`.

Extend `lists.mdx` and sit beside the comprehension lessons; link the existing equality lesson for `nub`, `delete`, `group`, `isPrefixOf` and `lookup`. Chapter 6 sidebar: after List Comprehensions and its exam practice, before the lab lessons.

Cover `words`, `unwords`, `lines`, `unlines`, `intersperse`, `intercalate`, `find`, `findIndex`, `elemIndex`, `isSuffixOf`, `isInfixOf`, `stripPrefix` and `Data.List.transpose`. For each teach exact types, order, empty input and failure form. Contrast literal spaces with arbitrary whitespace, empty lines and final newline behaviour; show why split/join round trips can normalise information. Explain substring as `take count . drop start` under a stated policy, and the lecture's informal cat as `(++)`, not a missing standard function. Show rectangular and ragged transpose, and contrasts with the already-covered nested comprehension. Safe Maybe results and general concat/comprehension rules are prerequisites, not duplicate topics.

Minimum: three worked variations per function, four per split/join family including lost-information cases; at least fourteen narrated exam questions, including choosing a library operation, predicting exact text, composing two operations and repairing a type error.

### Lane V9: ordering algorithms, maps and sets

Files: `content/docs/sem3/csi243/07-higher-order/notes/sorting-and-merging.mdx` and `content/docs/sem3/csi243/08-modules-types/notes/maps-and-sets-by-example.mdx`.

Extend the sorting examples in `08-modules-types/notes/imports.mdx` and sit beside `more-higher-order-functions.mdx`; extend existing List_InsertionSort/List_Merge downloads. Chapter 7 sidebar: Sorting and Merging after More Higher-Order Functions. Chapter 8 sidebar: Maps and Sets after Importing and the V6 module practice, before Type Synonyms.

The sorting lesson covers `sort`, `sortBy`, `compare` with a projected key, ascending/descending/stable ties, insertion/insertion sort, merge/merge sort and grouping after sorting to make frequency tables. Trace the algorithms and use Ord versus a supplied comparator correctly; do not repeat the equality lesson's generic group/nub/delete teaching. State when sorting changes the original order a question asks you to preserve. Cross-link V12 for cost rather than trusting the old branching heuristic.

The collections lesson covers qualified `Data.Map`/`Data.Set` from `containers`, association-list versus Map versus Set, immutable update, `empty`, `fromList`, `toList`, `lookup`, `member`, `insert`, `delete`, `size`, duplicate-key policy, Map keys/values and Set union/intersection/difference. Give concrete names and types for functions that share a name across modules. Correct the slides' unqualified "Map is unsorted" wording by distinguishing insertion order from ordered key traversal. Explain package availability without turning package installation into the lesson.

Minimum: three worked variations per sorting algorithm, comparator shape and named collection operation; at least eight narrated sorting questions and ten collection questions. Every search/update example includes absent and existing elements; every merge includes empty/unequal lists and ties.

### Lane V10: sequencing input/output and processing complete input

Files: `content/docs/sem3/csi243/03-defining-functions/notes/io-sequencing-and-loops.mdx` and `content/docs/sem3/csi243/03-defining-functions/notes/text-and-file-io-practice.mdx`.

Extend `input-processing.mdx`, `complete-program.mdx` and `output.mdx`; sit beside `lab-01.mdx`. Chapter 3 sidebar: after Input, Bindings, and Processing, before Where and Local Definitions; both new pages precede Lab 01.

Cover action/result types, `getChar`/`putChar`, `getLine`/`readLn`, leftover newlines, `do` final-expression rules, `let`/`<-`, `pure`/`return` versus exit, `(>>)`/`(>>=)` operational sequencing, `when`/`unless`, prompt-until-valid recursion and sentinel loops. Teach `mapM`, `mapM_`, `sequence` and `sequence_`, distinguishing a list of actions from executing them. Reuse existing safe parsers instead of reteaching Maybe/Either. Add exact `printf` formatting used by Test1 11 and distinguish that formatting from rounding a numeric value.

The second page covers `getContents`, `interact`, `readFile`, `writeFile`, `appendFile`, pure text processors composed with IO, and labelled success/error transcripts for two separate inputs. State newline/EOF behaviour, file overwrite/append behaviour and when lazy input is demanded. Provide tiny local input fixtures and deterministic pure checks. Include the suite's `sequence [IO Bool]`, `pure ()` and `exitFailure` use. All terminal examples need exact input and output; code requiring actual IO should be a plain fence if the site's interpreter cannot support it.

Minimum: three worked variations per action/combinator/control form, four complete input-processing programs and four file/whole-input programs; at least fourteen narrated exam questions across both lessons.

### Lane V11: the Functor, Applicative and Monad patterns behind existing code

Files: `content/docs/sem3/csi243/09-polymorphism/notes/functor-and-applicative-patterns.mdx` and `content/docs/sem3/csi243/09-polymorphism/notes/dependent-computation-patterns.mdx`.

Extend `maybe-and-instances.mdx` after the new Maybe/Either sequence. Chapter 9 sidebar: after Maybe/Either Exam Practice, before chapter revision. Link V6 for the unrelated module-functor terminology and V10 for effects.

Cover type constructors versus concrete types; generic `fmap` and its identity/composition laws; list/Maybe/Either comparisons and a hand-written Tree Functor instance; `pure`, `<$>`, `<*>` and lifting binary/ternary functions; type derivation and first-failure behaviour of the exact `fibonacci` Either expression in Test1 09. Contrast independent arguments combined applicatively with a next computation chosen from the preceding result using `>>=`. Give list branching/Cartesian application and list bind, name the relevant class relationships and show small do desugarings. Teach the general pattern and custom instance; existing Maybe/Either eliminators, safe functions, mapping and chains remain covered prerequisites. Do not imply Haskell Functor is a parameterised module or that Either accumulates every error by default.

Minimum: three worked variations per general operation/type context, four contrasts of independent versus dependent computation, at least twelve narrated exam questions, including type errors, missing wrappers, wrong sequencing and a custom-instance law check.

### Lane V12: accurate time and space reasoning

Files: `content/docs/sem3/csi243/10-reasoning-revision/notes/complexity-by-recurrence.mdx` and `content/docs/sem3/csi243/10-reasoning-revision/notes/complexity-exam-practice.mdx`.

Extend `complexity.mdx`; use `lazy-evaluation.mdx` as an already-covered prerequisite. Chapter 10 sidebar: immediately after The Cost of a Definition and before final revision questions; practice after the new lesson.

Cover operation counts, input-size definitions, base cases, linear/quadratic/logarithmic/exponential growth and two-input bounds. Derive factorial/length, naive and accumulator Fibonacci, slow/fast reverse, repeated factorial sums, insertion sort and merge sort. Include best/worst case, short-circuit searches, output-size lower bounds and the distinction between numeric arithmetic cost and a unit-cost assumption. Correct "one call means linear; two calls mean exponential": subproblem sizes and local work determine the recurrence. Use `T(n)=T(n-1)+c`, summation costs, halving and `2T(n/2)+O(n)` with worked solutions.

Explain auxiliary space versus result space, stack versus pending thunks, retained inputs, sharing and demand. Correct the unconditional claim that `[x | x <- xs, length xs > 3]` necessarily recomputes an invariant length for each element: state source-level/no-sharing cost separately from sharing/optimisation, and use changing suffixes for an unambiguous quadratic example. Reuse seq/foldl' teaching rather than proposing another strictness lesson. Provide a correction list for existing complexity Q/R/CS for the lead.

Minimum: four worked variations per recurrence family and per space-accounting pattern, at least fourteen narrated exam questions including "find the wrong complexity claim". No benchmark timing should substitute for a derivation.

### Lane V13: specifications, predicate logic and ambiguous requirements

Files: `content/docs/sem3/csi243/10-reasoning-revision/notes/contracts-and-predicate-logic.mdx` and `content/docs/sem3/csi243/10-reasoning-revision/notes/specification-exam-practice.mdx`.

Extend `specification.mdx` and the design process in `03-defining-functions/notes/defining-functions.mdx`. Chapter 10 sidebar: immediately after Specification, before Equational Reasoning; practice after the contract lesson.

Cover purpose/precondition/postcondition, domain/codomain versus valid/invalid subsets, partial versus total correctness and a decreasing termination measure. Translate "every", "some", "none", "only if", "if and only if", implication, XOR and De Morgan laws into Boolean predicates and `all`/`any`; include empty-domain/vacuous truth and quantified order. Compose contracts by checking the earlier postcondition against the next precondition. Use exact ambiguous lab requirements: invalid parity for an Int, divisor zero versus equality/order, index equal to length, square 0 specially defined as 1, negative range bounds and grade cut-offs. State assumptions before writing code and test each disjoint input partition. Add concrete comparison questions for functional/procedural/OO/declarative descriptions, markup versus programming and concurrency/optimisation benefits without promising automatic speed.

Minimum: four worked variations per contract/logical form, three for each ambiguity policy, at least twelve narrated exam questions. Include the exact ho7 homework proof that the factorial implementation equals the specified mathematical product, with the zero case, inductive product identity and termination stated separately. Existing positivity proofs do not discharge this claim. Give three correctness-to-specification variations (factorial, range product and shifted/double factorial) using the existing proof template. Other proof machinery and counterexample technique already covered are linked, not rewritten.

### Lane V14: an integrated grade-book practical and independent mock

Files: `content/docs/sem3/csi243/10-reasoning-revision/notes/grade-book-capstone.mdx` and `content/docs/sem3/csi243/10-reasoning-revision/notes/integrated-mock-practical.mdx`.

Sit beside `errors-and-testing.mdx`, using existing data, comprehension, Maybe/Either and module lessons as prerequisites. Chapter 10 sidebar: after all taught material and before Questions and Review; capstone before mock.

Build the exact Test1 16 model/core/report/application shape. Work through `Student`, safe `average`, `outcome`, `summary` and `classAverage`; distinguish an average of student means from pooling all marks when class sizes differ. Address no students, no marks, invalid marks, duplicate names, explicit weighting and classification boundaries. Derive the existing constructor-pattern comprehension and error/report paths without reteaching their syntax. Include a module-and-test layout, supplied TestSupport-style `assertEqual`, `assertTrue`, `assertApprox`, labelled failures, test-suite runner/exit status and the exclusion of intentionally broken examples. Explain supplied PowerShell as a way to run tests, not as another language to learn. Show that passing cases is evidence, not proof.

The mock supplies an unfamiliar but comparable dataset/domain, a timed practical and a written diagnostic component. Include a full mark scheme, independent starter, complete narrated answer, dry runs, tests, error repairs and a justified cost comparison. Existing chapter Q/R remain useful; the gap is integration under a single specification.

Minimum: three worked variations per integration decision (missing data, averaging policy, validation, module boundary and test oracle), four complete datasets including unequal student mark counts; at least ten narrated capstone questions and twelve independently attemptable mock questions with full answers.

### Lane V15: standard classes beyond recognising the class name

Files: `content/docs/sem3/csi243/09-polymorphism/notes/standard-class-exam-patterns.mdx` and `content/docs/sem3/csi243/09-polymorphism/notes/standard-class-exam-practice.mdx`.

Extend `standard-classes.mdx` and `type-classes.mdx`. Chapter 9 sidebar: after The Standard Type Classes, before the Maybe/Either sequence; the practice page follows the new class lesson.

Cover general `Ord` laws, compare/min/max, lexicographic tie decisions and consistency with Eq; `Show`/`Read` round trips, annotations supplied by context and malformed/ambiguous input; `Enum` methods `succ`, `pred`, `toEnum`, `fromEnum` and endpoint errors; `Bounded` independent from `Enum`, with enumeration requiring both constraints; an accurate numeric superclass map including Real/RealFrac and Floating, with method-driven constraint choices. Separate properties the compiler checks from laws an instance should satisfy; qualify laws for partial values and floating NaN rather than claiming every derived instance is mathematically lawful for every payload. Numeric calculation practice belongs to V1. The existing Eq lesson and handwritten/derived data instances are exam depth and must not be recreated.

Minimum: three worked variations per method/law/constraint decision, four contextual Read and enumeration-boundary cases, at least twelve narrated exam questions. Include a correction note for the existing simplified numeric class graph and unconditional equality/order law wording, for the lead to reconcile in Q/R/CS.

### Lane V16: operators, identifiers and legacy pattern repairs

Files: `content/docs/sem3/csi243/03-defining-functions/notes/operators-and-lexical-rules.mdx` and `content/docs/sem3/csi243/03-defining-functions/notes/operator-and-pattern-repairs.mdx`.

Extend the naming rules in `defining-functions.mdx` and sit beside `07-higher-order/notes/currying-and-sections.mdx`; link the current case/pattern lessons. Chapter 3 sidebar: after Defining Functions and before A Complete Haskell Program; repair practice immediately after the operator lesson.

Cover legal value/type/constructor/operator names, apostrophes and underscores, wildcard versus an underscore-prefixed binding, reserved words and source capitalisation mistakes. Define a symbolic operator with a signature, give `infixl`, `infixr` and non-associative `infix` declarations, parenthesise mixed operators and diagnose conflicting fixities. Use non-commutative examples so precedence and associativity change the result. Distinguish ordinary value operators from constructor operators beginning with a colon. Explain repeated variables cannot express equality inside one pattern and rewrite using a guard. Address ho7's legacy `n+k` syntax through the optional legacy extension and the recommended ordinary pattern/guard rewrite; arithmetic expressions are not general patterns. Point to existing section/lambda/negative-section teaching instead of repeating it.

Minimum: three worked variations per naming, operator and repair concept, four per fixity form and legacy-pattern repair; at least ten narrated exam questions, including parse versus scope versus type failures and a fully parenthesised reduction.

## 5. Haskell file compilations

This is the requested compilation plan, not a claim that new Haskell files have been written or compiled. Lane A writes only this audit. For each family below, add matching question files under both `public/files/sem3/csi243/downloads/completed-examples/` and `public/files/sem3/csi243/downloads/starter-code/`. Use the stated prefix plus a descriptive question name, followed by V2/V3 (and further variants where the lane requires four). Search the existing README before assigning names; retain all existing Lab1-Lab6, Rec, List, Guard, Comp, Hof, Data, Poly, Lazy and Proof files.

Every completed file starts with the question, includes a commented reasoning outline, the solution, `main`, several normal/boundary/error checks and expected results. A starter holds the identical question, requested signatures with `undefined` bodies and the same test main, without solution hints. Definitions involving type errors or non-termination must be commented deliberately failing alternatives, excluded from the normal execution path; a question can still ask the student to explain the failure. Proof/property-check comments must distinguish finite checks from a universal proof. Compiler diagnostics must come from the intended GHC version, not be invented from memory.

| Lane | New question-file name prefixes and concrete question families | Required paired practice / verification emphasis |
| --- | --- | --- |
| V1 | `Arith_SignedDivision_`, `Arith_DivisionPairs_`, `Arith_ExponentChoice_`, `Arith_Conversions_`, `Arith_FloatingDomain_`, `Arith_ExpressionTrace_` | All sign combinations; three power operators; conversions/ties; tolerance and non-finite results. Include the negative repeated-addition counterexample. |
| V2 | `Rec_DesignRange_`, `Rec_DesignMultiply_`, `Rec_DesignPower_`, `Rec_DesignEuclid_`, `Rec_DesignDigits_`, `Rec_DesignSumFactorials_`, `Rec_DesignFibAcc_` | New specifications and boundary policies beside existing Rec_ examples; compare algorithms on finite valid inputs. |
| V3 | `List_DesignIndex_`, `List_DesignThreshold_`, `List_DesignSorted_`, `List_DesignScale_`, `List_DesignTakeDrop_`, `List_DesignPrefix_`, `List_DesignInterleave_`, `List_DesignExtrema_` | Each lab question and every new list algorithm; explicit empty/singleton/negative-count/oversize cases; no duplicate Lab3 filenames. |
| V4 | `Hof_DesignSumSq_`, `Hof_DesignFold_`, `Hof_WeightedMarks_`, `Hof_ThreeListZip_`, `Hof_DesignDotProduct_`, `Hof_Lab04Integrated_` | Exact October Lab 4 parts and Appendix C adaptations; test every shortest-list case and mixed element types; Lab 5 fold-filter implementation. |
| V5 | `Alias_Expand_`, `Alias_Assoc_`, `Alias_Course_`, `Alias_ParserResult_`, `Alias_Repair_` | Alias expansion and instantiation, simple parser failures/suffixes, same underlying type versus distinct wrappers. |
| V6 | `Module_Export_`, `Module_AbstractStack_`, `Module_ValidatedMark_`, `Module_ImportRepair_`, `Module_GhciSession_` | Real multi-module question bundles, not several module headers in one .hs file. Put each bundle in a uniquely named subdirectory with core/client/test files in both folders. The question at the top identifies the entry file, load/build command and expected scope failures. Debugger commands belong in comments beside executable definitions. |
| V7 | `Char_CodePoint_`, `Char_Classify_`, `Char_DigitConversion_`, `Char_EscapeOutput_`, `Char_Normalise_`, `Char_CountWhitespace_` | Character versus String versus list of String, Unicode/ASCII boundary, spaces/tabs, guarded conversion and exact escaped output. |
| V8 | `TextList_Words_`, `TextList_Lines_`, `TextList_Join_`, `TextList_Search_`, `TextList_PrefixSuffix_`, `TextList_Substring_`, `TextList_Transpose_` | Exact newline behaviour, empty and ragged structures, missing search result and normalising versus lossless round trips. |
| V9 | `Sort_Comparator_`, `Sort_Insertion_`, `Sort_Merge_`, `Sort_Frequency_`, `Collections_Map_`, `Collections_Set_` | Stable ties and order, comparator types, duplicate map keys, immutable update and set algebra; record containers requirement and qualify shared names. |
| V10 | `IO_Character_`, `IO_Sequence_`, `IO_PromptLoop_`, `IO_Sentinel_`, `IO_WholeInput_`, `IO_FilePipeline_`, `IO_FormattedReport_` | Fixed input transcripts in question comments; deterministic pure-core self-tests in main where useful. File exercises use named small fixtures and a temporary output path inside their exercise directory; never assume interactive stdin during an automated run. |
| V11 | `Context_FunctorTree_`, `Context_Applicative_`, `Context_EitherFib_`, `Context_ListApplication_`, `Context_DependentBind_`, `Context_DoRewrite_` | General class patterns and custom instances; independent/dependent failure cases; compare rewritten definitions on the same inputs. Reuse, rather than replace, any Maybe/Either files from the concurrent lane. |
| V12 | `Cost_Recurrence_`, `Cost_Sort_`, `Cost_Reverse_`, `Cost_Sharing_`, `Cost_Space_` | Counted/instrumented pure models with stated cost assumptions; formula and derivation in comments. Do not assert exact allocation, optimiser behaviour or wall-clock timing from printed values alone. |
| V13 | `Spec_Domain_`, `Spec_Predicate_`, `Spec_Quantifier_`, `Spec_ContractComposition_`, `Spec_AmbiguousRequirement_`, `Spec_ParadigmComparison_`, `Proof_FactorialSpecification_` | Preconditions/postconditions and truth tables in question comments; executable Boolean checks including empty domains and contradictory requirements. Compare input partitions; do not turn an unsatisfied precondition into a fabricated result. |
| V14 | `Capstone_GradeBook_`, `Capstone_AveragePolicy_`, `Capstone_Validation_`, `Capstone_TestHarness_`, `Capstone_Mock_` | Multi-module bundles with an entry program and tests, as for V6; fixtures for empty/unequal groups and invalid data. Include tiny assertion helpers and success/failure reporting; demonstrate the suite runner without making PowerShell a Haskell exercise. |
| V15 | `Class_OrdLaw_`, `Class_ReadShow_`, `Class_EnumBoundary_`, `Class_BoundedEnum_`, `Class_NumericHierarchy_` | Generic class-method and law questions beside existing Poly_/Data_ files; avoid repeating already-covered Eq or handwritten data instances. Error questions leave invalid alternatives commented. |
| V16 | `Operator_Fixity_`, `Operator_Definition_`, `Operator_NameRepair_`, `Operator_Constructor_`, `Operator_LegacyPattern_` | Fully parenthesised expected reductions; legal operator declarations; ordinary Haskell rewrites of legacy n+k syntax. Keep any optional extension example isolated from portable examples. |

For each distinct concept, include at least the number of different worked question variants required by its lane, with V2/V3 as the baseline rather than the entire quota. Add every new question pair and bundle entry to the shared downloads README during integration. Modules and IO may need verification beyond the current single-file runner: inspect its supported layout first, then compile each declared entry with its directory on the search path; feed fixed stdin and create fixtures explicitly. The integration lead should run `node scripts/verify-haskell-files.mjs` on the supported new files and real GHC/runghc checks for every multi-file, package and IO case it cannot exercise. This audit has not run those future compilation checks.

Coverage rows: 640  
Siblings listed: 121  
Lanes proposed: 16
