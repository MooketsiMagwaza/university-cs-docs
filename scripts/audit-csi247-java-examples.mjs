#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const contentRoots = [
  join(root, 'content', 'docs', 'sem3', 'csi247', 'sorting-and-searching'),
  join(root, 'content', 'docs', 'sem3', 'csi247', 'packages'),
];
const work = mkdtempSync(join(tmpdir(), 'csi247-java-audit-'));
const sourceRoot = join(work, 'src');
const classRoot = join(work, 'classes');
mkdirSync(sourceRoot, { recursive: true });
mkdirSync(classRoot, { recursive: true });

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : entry.name.endsWith('.mdx') ? [full] : [];
  });
}

try {
  const programs = [];
  const teachingMethods = new Map();
  const teachingSources = new Map();
  let teachingSnippetCount = 0;
  for (const file of contentRoots.flatMap(walk)) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/(?:```|~~~)java[^\r\n]*\r?\n([\s\S]*?)(?:```|~~~)/g)) {
      const code = match[1];
      const className = code.match(/public class\s+([A-Za-z_$][\w$]*)/)?.[1];
      if (!className) {
        // Standalone complete methods in the four assigned lessons get a class wrapper.
        // A while-loop fragment requires surrounding local variables and is intentionally excluded.
        const teachingFile = /notes[\\/](linear-search|binary-search|bubble-and-selection-sort|insertion-sort)\.mdx$/.test(file);
        const method = code.match(/public static (?:int|void)\s+(\w+)\s*\(/)?.[1];
        if (teachingFile && method) {
          const wrapper = `TeachingSnippet${teachingSnippetCount++}`;
          const target = join(sourceRoot, `${wrapper}.java`);
          writeFileSync(target, `public class ${wrapper} {\n${code}\n}\n`, 'utf8');
          teachingMethods.set(method, wrapper);
          teachingSources.set(method, code);
          programs.push({ className: wrapper, packageName: '', target });
        }
        continue;
      }
      const packageName = code.match(/^package\s+([\w.]+);/m)?.[1] ?? '';
      const target = join(sourceRoot, ...packageName.split('.').filter(Boolean), `${className}.java`);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, code, 'utf8');
      programs.push({ className, packageName, target });
    }
  }

  if (programs.length < 12) throw new Error(`Expected at least 12 complete Java examples, found ${programs.length}.`);
  execFileSync('javac', ['--release', '8', '-d', classRoot, ...programs.map(({ target }) => target)], { stdio: 'inherit' });

  const expected = new Map([
    ['LinearSearchDemo', '[63, 29, 85, 72, 18, 42, 23, 54, 8, 32]\n18 -> 4\n31 -> -1'],
    ['BinarySearchDemo', '18 -> 1\n31 -> -1\n85 -> 9'],
    ['SimpleSortsDemo', 'bubble:    [1, 2, 3, 4, 5]\nselection: [1, 2, 3, 4, 5]'],
    ['InsertionSortDemo', '[1, 3, 5, 8]'],
    ['MergeSortDemo', '[3, 18, 29, 49, 54, 63, 72, 85]'],
    ['LinearSearchFormsDemo', 'recursive found=1\nrecursive absent=-1\nrecursive empty=-1\nascending absent=-1\ndescending found=1'],
    ['BinarySearchFormsDemo', 'ascending absent=-1\ndescending found=1\ndescending recursive=1\nempty=-1\nduplicate=2'],
    ['BubbleSortFormsDemo', 'literal=20\nshortened=10\nsorted early=4\nrecursive=[99, 4, 3, 2, 1, -99]\niterative=[99, 4, 3, 2, 1, -99]'],
    ['SelectionDescendingDemo', '[5, 4, 3, 2, 1]'],
    ['TaggedSortStabilityDemo', 'bubble=[1C, 2A, 2B]\ninsertion=[1C, 2A, 2B]\nselection=[1C, 2B, 2A]'],
    ['InsertionDescendingDemo', 'mixed=[5, 4, 3, 2, 1]\nduplicates=[3, 2, 2, 1]\nempty=[]\nsingleton=[7]'],
    ['DistanceDemo', '9.0'],
    ['app.Tester', '42\nclass B'],
  ]);

  for (const [name, wanted] of expected) {
    const actual = execFileSync('java', ['-cp', classRoot, name], { encoding: 'utf8' }).trim().replaceAll('\r\n', '\n');
    if (actual !== wanted) throw new Error(`${name} output mismatch\nExpected:\n${wanted}\nActual:\n${actual}`);
  }


  // Instrument the actual displayed methods, so table counts cannot drift from their code.
  const countMethods = ['bubbleSort', 'selectionSort', 'insertionSort'].map((method) => {
    let code = teachingSources.get(method);
    if (!code) throw new Error(`Missing standalone teaching method: ${method}`);
    code = code.replace('arr[j] > arr[j + 1]', 'greater(arr[j], arr[j + 1])')
      .replace('arr[j] < arr[minIndex]', 'less(arr[j], arr[minIndex])')
      .replace('j >= 0 && arr[j] > current', 'nonnegative(j) && greater(arr[j], current)');
    if (method !== 'insertionSort') {
      code = code.replace('int temp = arr[', 'swaps++;\n                int temp = arr[');
    } else {
      code = code.replace('arr[j + 1] = arr[j];', 'arr[j + 1] = arr[j]; shifts++;')
        .replace('arr[j + 1] = current;', 'arr[j + 1] = current; insertions++;');
    }
    return code.replace(/(arr\[[^\n;]+\] = [^\n;]+;)/g, '$1 writes++;');
  }).join('\n');
  const instrumented = `public class InstrumentedSorting {
    static int comparisons, boundaries, swaps, shifts, insertions, writes;
    static boolean greater(int a, int b) { comparisons++; return a > b; }
    static boolean less(int a, int b) { comparisons++; return a < b; }
    static boolean nonnegative(int j) { boundaries++; return j >= 0; }
    static void reset() { comparisons=boundaries=swaps=shifts=insertions=writes=0; }
    ${countMethods}
  }`;
  const instrumentationPath = join(sourceRoot, 'InstrumentedSorting.java');
  writeFileSync(instrumentationPath, instrumented, 'utf8');

  const harness = `import java.util.Arrays;
  public class AcademicBoundaryChecks {
    static int checks;
    static void check(boolean value, String context) {
      checks++;
      if (!value) throw new AssertionError(context);
    }
    static void same(int[] actual, int[] wanted, String context) {
      check(Arrays.equals(actual, wanted), context + Arrays.toString(actual));
    }
    static int[] reversed(int[] input) {
      int[] result = input.clone();
      for (int i=0; i<result.length/2; i++) {
        int saved=result[i]; result[i]=result[result.length-1-i]; result[result.length-1-i]=saved;
      }
      return result;
    }
    static void counts(int comparisons, int swaps, int shifts, int insertions, int writes, String context) {
      check(InstrumentedSorting.comparisons==comparisons, context+" key comparisons");
      check(InstrumentedSorting.swaps==swaps, context+" swaps");
      check(InstrumentedSorting.shifts==shifts, context+" shifts");
      check(InstrumentedSorting.insertions==insertions, context+" insertion writes");
      check(InstrumentedSorting.writes==writes, context+" array writes");
    }
    public static void main(String[] args) {
      int[][] fixtures = {{}, {7}, {4,2,5,1,3}, {3,3,1,2,3}, {-2,4,0,-2,1},
                          {5,4,3,2,1}, {1,2,3,4,5}, {9,1,7,3,5}};
      for (int[] fixture: fixtures) {
        int[] ascending=fixture.clone(); Arrays.sort(ascending);
        int[] descending=reversed(ascending);
        int[] actual=fixture.clone(); SimpleSortsDemo.bubbleSort(actual); same(actual,ascending,"bubble");
        actual=fixture.clone(); SimpleSortsDemo.selectionSort(actual); same(actual,ascending,"selection");
        actual=fixture.clone(); InsertionSortDemo.insertionSort(actual); same(actual,ascending,"insertion");
        actual=fixture.clone(); SelectionDescendingDemo.selectionDescending(actual); same(actual,descending,"descending selection");
        actual=fixture.clone(); InsertionDescendingDemo.insertionDescending(actual); same(actual,descending,"descending insertion");
        actual=fixture.clone(); BubbleSortFormsDemo.descendingIterative(actual,0,actual.length-1); same(actual,descending,"descending bubble");
        actual=fixture.clone(); BubbleSortFormsDemo.descendingRecursive(actual,0,actual.length-1); same(actual,descending,"recursive bubble");
        for (int key: new int[]{-3,-2,1,2,3,4,7,10}) {
          int first=-1;
          for(int i=0;i<fixture.length;i++) if(fixture[i]==key) { first=i; break; }
          check(LinearSearchDemo.linearSearch(fixture,key)==first,"iterative linear");
          check(LinearSearchFormsDemo.linearSearchRecursive(fixture,key,0)==first,"recursive linear");
          check(${teachingMethods.get('linearSearch')}.linearSearch(fixture,key)==first,"linear snippet");
          int firstSorted=-1;
          for(int i=0;i<ascending.length;i++) if(ascending[i]==key) { firstSorted=i; break; }
          check(${teachingMethods.get('firstIndexOf')}.firstIndexOf(ascending,key)==firstSorted,"first duplicate index");
          check(${teachingMethods.get('orderedLinearSearch')}.orderedLinearSearch(ascending,key)==firstSorted,"ordered snippet");
          check(LinearSearchFormsDemo.orderedAscending(ascending,key)==firstSorted,"ordered ascending");
          int firstDescending=-1;
          for(int i=0;i<descending.length;i++) if(descending[i]==key) { firstDescending=i; break; }
          check(LinearSearchFormsDemo.orderedDescending(descending,key)==firstDescending,"ordered descending");
          int[] matches = {
            BinarySearchDemo.binarySearch(ascending,key),
            ${teachingMethods.get('binarySearch')}.binarySearch(ascending,key),
            ${teachingMethods.get('binarySearchRecursive')}.binarySearchRecursive(ascending,key,0,ascending.length-1),
            BinarySearchFormsDemo.ascendingRecursive(ascending,key,0,ascending.length-1)
          };
          for(int index: matches) check(firstSorted==-1 ? index==-1 : index>=0 && index<ascending.length && ascending[index]==key,"binary ascending");
          int index=BinarySearchFormsDemo.descendingIterative(descending,key);
          check(firstDescending==-1 ? index==-1 : index>=0 && index<descending.length && descending[index]==key,"binary descending");
          index=BinarySearchFormsDemo.descendingRecursive(descending,key,0,descending.length-1);
          check(firstDescending==-1 ? index==-1 : index>=0 && index<descending.length && descending[index]==key,"recursive binary descending");
        }
        actual=fixture.clone();
        int literal=BubbleSortFormsDemo.lectureBubble(actual);
        check(literal==fixture.length*Math.max(0,fixture.length-1),"literal comparison formula");
        same(actual,ascending,"literal result");
        actual=fixture.clone();
        check(BubbleSortFormsDemo.shortenedBubble(actual)==fixture.length*Math.max(0,fixture.length-1)/2,"shortened comparison formula");
        same(actual,ascending,"shortened result");
        actual=ascending.clone();
        check(BubbleSortFormsDemo.earlyStopBubble(actual)==Math.max(0,fixture.length-1),"sorted early-stop comparisons");
      }
      int[] subrange={99,4,1,3,2,-99};
      BubbleSortFormsDemo.descendingRecursive(subrange,1,4);
      same(subrange,new int[]{99,4,3,2,1,-99},"inclusive sentinels");
      int[] noWork={99,4,-99};
      BubbleSortFormsDemo.descendingRecursive(noWork,1,1);
      BubbleSortFormsDemo.descendingRecursive(noWork,2,1);
      same(noWork,new int[]{99,4,-99},"singleton and empty subranges");

      InstrumentedSorting.reset(); InstrumentedSorting.bubbleSort(new int[]{4,2,5,1,3});
      counts(10,6,0,0,12,"bubble visual");
      InstrumentedSorting.reset(); InstrumentedSorting.selectionSort(new int[]{4,2,5,1,3});
      counts(10,2,0,0,4,"selection visual");
      InstrumentedSorting.reset(); InstrumentedSorting.insertionSort(new int[]{4,2,5,1,3});
      counts(8,0,6,4,10,"insertion visual");
      check(InstrumentedSorting.boundaries==10,"insertion boundary guards");
      InstrumentedSorting.reset(); InstrumentedSorting.insertionSort(new int[]{1,2,3,4,5});
      counts(4,0,0,4,4,"sorted insertion");
      InstrumentedSorting.reset(); InstrumentedSorting.insertionSort(new int[]{5,4,3,2,1});
      counts(10,0,10,4,14,"reverse insertion");
      System.out.println("Academic boundary and count checks passed: "+checks);
    }
  }`;
  const harnessPath = join(sourceRoot, 'AcademicBoundaryChecks.java');
  writeFileSync(harnessPath, harness, 'utf8');
  execFileSync('javac', ['--release','8','-cp',classRoot,'-d',classRoot,instrumentationPath,harnessPath], { stdio:'inherit' });
  process.stdout.write(execFileSync('java',['-cp',classRoot,'AcademicBoundaryChecks'],{ encoding:'utf8' }));

  // Compile each playground separately: every source deliberately declares Main.
  const playgroundSource = readFileSync(join(root,'lib','java-playground','examples.ts'),'utf8');
  const playgroundExpected = new Map([
    ['linear-search','18 -> 4\n31 -> -1'],
    ['binary-search','low=0, mid=4, high=8, value=50\nlow=5, mid=6, high=8, value=76\nlow=7, mid=7, high=8, value=83\nlow=8, mid=8, high=8, value=90\nresult=-1'],
    ['bubble-sort','end=4 [2, 4, 1, 3, 5]\nend=3 [2, 1, 3, 4, 5]\nend=2 [1, 2, 3, 4, 5]\nend=1 [1, 2, 3, 4, 5]'],
    ['selection-sort','start=0 [1, 2, 5, 4, 3]\nstart=1 [1, 2, 5, 4, 3]\nstart=2 [1, 2, 3, 4, 5]\nstart=3 [1, 2, 3, 4, 5]'],
    ['insertion-sort','i=1 [2, 4, 5, 1, 3]\ni=2 [2, 4, 5, 1, 3]\ni=3 [1, 2, 4, 5, 3]\ni=4 [1, 2, 3, 4, 5]'],
    ['merge-sort', [
      'merged 0..1 [29, 63, 72, 85, 18, 49, 3, 54]',
      'merged 2..3 [29, 63, 72, 85, 18, 49, 3, 54]',
      'merged 0..3 [29, 63, 72, 85, 18, 49, 3, 54]',
      'merged 4..5 [29, 63, 72, 85, 18, 49, 3, 54]',
      'merged 6..7 [29, 63, 72, 85, 18, 49, 3, 54]',
      'merged 4..7 [29, 63, 72, 85, 3, 18, 49, 54]',
      'merged 0..7 [3, 18, 29, 49, 54, 63, 72, 85]',
      'result [3, 18, 29, 49, 54, 63, 72, 85]'
    ].join('\n')],
    ['built-in-packages','date=2026-10-06\nmarks=[64, 72, 91]'],
    ['linear-search-recursive', expected.get('LinearSearchFormsDemo')],
    ['binary-search-descending', expected.get('BinarySearchFormsDemo')],
    ['bubble-sort-variants', expected.get('BubbleSortFormsDemo')],
    ['selection-sort-descending', expected.get('SelectionDescendingDemo')],
    ['insertion-sort-descending', expected.get('InsertionDescendingDemo')],
    ['tagged-sort-stability', expected.get('TaggedSortStabilityDemo')],
  ]);
  let playgroundCount=0;
  for (const match of playgroundSource.matchAll(/id: ['"]([^'"]+)['"],[\s\S]*?code: `([\s\S]*?)`/g)) {
    const [, id, code]=match;
    if (!code.includes('//')) throw new Error(`Uncommented playground example: ${id}`);
    const exampleRoot=join(work,'playground',id), exampleClasses=join(exampleRoot,'classes');
    mkdirSync(exampleClasses,{ recursive:true });
    const target=join(exampleRoot,'Main.java');
    writeFileSync(target,code,'utf8');
    execFileSync('javac',['--release','8','-d',exampleClasses,target],{ stdio:'pipe' });
    const result=spawnSync('java',['-cp',exampleClasses,'Main'],{ encoding:'utf8',timeout:10000 });
    if (result.error) throw result.error;
    if (id==='fix-the-loop') {
      if (result.status===0 || !result.stderr.includes('ArrayIndexOutOfBoundsException')) throw new Error('Off-by-one exercise did not produce its expected exception');
    } else {
      const wanted=playgroundExpected.get(id);
      if (wanted===undefined) throw new Error(`No expected playground output: ${id}`);
      const actual=result.stdout.trim().replaceAll('\r\n','\n');
      if (result.status!==0 || actual!==wanted) throw new Error(`Playground output mismatch: ${id}\nExpected:\n${wanted}\nActual:\n${actual}\n${result.stderr}`);
    }
    playgroundCount++;
  }
  if (playgroundCount!==playgroundExpected.size+1) throw new Error('Playground fixture inventory did not match extracted examples');

  console.log(`CSI247 Java audit passed: ${programs.length} examples compile with --release 8; ${expected.size} lesson outputs and ${playgroundCount} playground examples verified; ${teachingSnippetCount} standalone method snippets compiled.`);
} finally {
  const resolvedWork = resolve(work);
  const resolvedTemp = resolve(tmpdir());
  if (!resolvedWork.startsWith(`${resolvedTemp}\\`) && !resolvedWork.startsWith(`${resolvedTemp}/`)) {
    throw new Error(`Refusing to remove unexpected audit directory: ${resolvedWork}`);
  }
  rmSync(resolvedWork, { recursive: true, force: true });
}
