/**
 * Java source for the helper classes that stand in for the parts of the JDK the in-browser compiler lacks.
 * The runner appends only the parts a program needs, after the program's own source, so line numbers in
 * compiler messages still point at the student's code.
 *
 * The code must compile under both TeaVM's class library and a real JDK (scripts/test-java-shim.mjs compares it
 * with the JDK), and so it avoids backslashes (newline is (char) 10) and every API the browser runner lacks.
 */

/** printf and String.format. TeaVM's Formatter fails with a null pointer on %f and %e. */
export const FORMAT_SHIM = `
final class __Fmt {
    static void printf(String pattern, Object... args) {
        System.out.print(format(pattern, args));
    }

    static void eprintf(String pattern, Object... args) {
        System.err.print(format(pattern, args));
    }

    static String format(String pattern, Object... args) {
        StringBuilder out = new StringBuilder();
        int next = 0;
        int i = 0;
        int n = pattern.length();
        while (i < n) {
            char c = pattern.charAt(i);
            if (c != '%') {
                out.append(c);
                i++;
                continue;
            }
            i++;
            if (i >= n) {
                throw new IllegalArgumentException("Format specifier '%' is incomplete");
            }
            int explicit = -1;
            int j = i;
            while (j < n && pattern.charAt(j) >= '0' && pattern.charAt(j) <= '9') {
                j++;
            }
            if (j > i && j < n && pattern.charAt(j) == '$') {
                explicit = Integer.parseInt(pattern.substring(i, j)) - 1;
                i = j + 1;
            }
            boolean left = false;
            boolean zero = false;
            boolean plus = false;
            boolean space = false;
            boolean comma = false;
            boolean paren = false;
            while (i < n) {
                char f = pattern.charAt(i);
                if (f == '-') {
                    left = true;
                } else if (f == '0') {
                    zero = true;
                } else if (f == '+') {
                    plus = true;
                } else if (f == ' ') {
                    space = true;
                } else if (f == ',') {
                    comma = true;
                } else if (f == '(') {
                    paren = true;
                } else if (f == '#') {
                    left = left;
                } else {
                    break;
                }
                i++;
            }
            int width = -1;
            j = i;
            while (j < n && pattern.charAt(j) >= '0' && pattern.charAt(j) <= '9') {
                j++;
            }
            if (j > i) {
                width = Integer.parseInt(pattern.substring(i, j));
                i = j;
            }
            int precision = -1;
            if (i < n && pattern.charAt(i) == '.') {
                i++;
                j = i;
                while (j < n && pattern.charAt(j) >= '0' && pattern.charAt(j) <= '9') {
                    j++;
                }
                if (j == i) {
                    throw new IllegalArgumentException("Format specifier has a dot with no precision");
                }
                precision = Integer.parseInt(pattern.substring(i, j));
                i = j;
            }
            if (i >= n) {
                throw new IllegalArgumentException("Format specifier is incomplete");
            }
            char conv = pattern.charAt(i);
            i++;
            if (conv == 'n') {
                out.append((char) 10);
                continue;
            }
            if (conv == '%') {
                out.append(pad("%", width, left));
                continue;
            }
            int index = explicit >= 0 ? explicit : next;
            if (explicit < 0) {
                next++;
            }
            if (index >= args.length) {
                throw new IllegalArgumentException("Format specifier '%" + conv + "' has no argument");
            }
            out.append(convert(conv, args[index], width, precision, left, zero, plus, space, comma, paren));
        }
        return out.toString();
    }

    private static String convert(char conv, Object arg, int width, int precision, boolean left, boolean zero,
                                  boolean plus, boolean space, boolean comma, boolean paren) {
        switch (conv) {
            case 'd': {
                if (arg == null) {
                    return pad("null", width, left);
                }
                if (!(arg instanceof Integer || arg instanceof Long || arg instanceof Short || arg instanceof Byte
                        || arg instanceof java.math.BigInteger)) {
                    throw new IllegalArgumentException("%d does not accept this argument");
                }
                String digits = arg.toString();
                boolean negative = digits.startsWith("-");
                if (negative) {
                    digits = digits.substring(1);
                }
                if (comma) {
                    digits = group(digits);
                }
                return signed(digits, negative, width, left, zero, plus, space, paren);
            }
            case 'f': {
                if (arg == null) {
                    return pad("null", width, left);
                }
                if (arg instanceof java.math.BigDecimal) {
                    java.math.BigDecimal big = (java.math.BigDecimal) arg;
                    boolean negative = big.signum() < 0;
                    String text = big.abs().setScale(precision < 0 ? 6 : precision, java.math.RoundingMode.HALF_UP).toPlainString();
                    return signed(comma ? groupNumber(text) : text, negative, width, left, zero, plus, space, paren);
                }
                double value = asDouble(arg, "f");
                if (Double.isNaN(value) || Double.isInfinite(value)) {
                    return special(value, width, left, plus, space);
                }
                boolean negative = value < 0 || (value == 0 && 1 / value < 0);
                java.math.BigDecimal magnitude = new java.math.BigDecimal(Double.toString(Math.abs(value)));
                String text = magnitude.setScale(precision < 0 ? 6 : precision, java.math.RoundingMode.HALF_UP).toPlainString();
                return signed(comma ? groupNumber(text) : text, negative, width, left, zero, plus, space, paren);
            }
            case 'e':
            case 'E': {
                if (arg == null) {
                    return pad("null", width, left);
                }
                double value = asDouble(arg, "e");
                if (Double.isNaN(value) || Double.isInfinite(value)) {
                    return special(value, width, left, plus, space);
                }
                boolean negative = value < 0 || (value == 0 && 1 / value < 0);
                String text = scientific(Math.abs(value), precision < 0 ? 6 : precision);
                if (conv == 'E') {
                    text = text.toUpperCase();
                }
                return signed(text, negative, width, left, zero, plus, space, paren);
            }
            case 's':
            case 'S': {
                String text = String.valueOf(arg);
                if (precision >= 0 && precision < text.length()) {
                    text = text.substring(0, precision);
                }
                if (conv == 'S') {
                    text = text.toUpperCase();
                }
                return pad(text, width, left);
            }
            case 'c':
            case 'C': {
                String text;
                if (arg == null) {
                    text = "null";
                } else if (arg instanceof Character) {
                    text = String.valueOf(((Character) arg).charValue());
                } else if (arg instanceof Integer) {
                    text = String.valueOf((char) ((Integer) arg).intValue());
                } else {
                    throw new IllegalArgumentException("%c does not accept this argument");
                }
                if (conv == 'C') {
                    text = text.toUpperCase();
                }
                return pad(text, width, left);
            }
            case 'b':
            case 'B': {
                String text = arg == null ? "false" : (arg instanceof Boolean ? arg.toString() : "true");
                if (conv == 'B') {
                    text = text.toUpperCase();
                }
                return pad(text, width, left);
            }
            case 'x':
            case 'X':
            case 'o': {
                if (arg == null) {
                    return pad("null", width, left);
                }
                String text;
                if (arg instanceof Integer) {
                    int v = ((Integer) arg).intValue();
                    text = conv == 'o' ? Integer.toOctalString(v) : Integer.toHexString(v);
                } else if (arg instanceof Long) {
                    long v = ((Long) arg).longValue();
                    text = conv == 'o' ? Long.toOctalString(v) : Long.toHexString(v);
                } else {
                    throw new IllegalArgumentException("%" + conv + " does not accept this argument");
                }
                if (conv == 'X') {
                    text = text.toUpperCase();
                }
                if (zero && width > text.length() && !left) {
                    text = zeros(width - text.length()) + text;
                }
                return pad(text, width, left);
            }
            default:
                throw new IllegalArgumentException("Unknown format conversion '%" + conv + "'");
        }
    }

    private static double asDouble(Object arg, String conv) {
        if (arg instanceof Double || arg instanceof Float) {
            return ((Number) arg).doubleValue();
        }
        throw new IllegalArgumentException("%" + conv + " does not accept this argument");
    }

    private static String special(double value, int width, boolean left, boolean plus, boolean space) {
        String text;
        if (Double.isNaN(value)) {
            text = "NaN";
        } else if (value < 0) {
            text = "-Infinity";
        } else {
            text = (plus ? "+" : space ? " " : "") + "Infinity";
        }
        return pad(text, width, left);
    }

    private static String scientific(double magnitude, int precision) {
        if (magnitude == 0) {
            return (precision == 0 ? "0" : "0." + zeros(precision)) + "e+00";
        }
        java.math.BigDecimal value = new java.math.BigDecimal(Double.toString(magnitude));
        int exponent = value.precision() - value.scale() - 1;
        java.math.BigDecimal mantissa = value.movePointLeft(exponent).setScale(precision, java.math.RoundingMode.HALF_UP);
        if (mantissa.compareTo(java.math.BigDecimal.TEN) >= 0) {
            exponent++;
            mantissa = value.movePointLeft(exponent).setScale(precision, java.math.RoundingMode.HALF_UP);
        }
        int e = Math.abs(exponent);
        return mantissa.toPlainString() + "e" + (exponent < 0 ? "-" : "+") + (e < 10 ? "0" : "") + e;
    }

    private static String group(String digits) {
        StringBuilder out = new StringBuilder();
        int count = 0;
        for (int i = digits.length() - 1; i >= 0; i--) {
            if (count > 0 && count % 3 == 0) {
                out.append(',');
            }
            out.append(digits.charAt(i));
            count++;
        }
        return out.reverse().toString();
    }

    private static String groupNumber(String text) {
        int dot = text.indexOf('.');
        return dot < 0 ? group(text) : group(text.substring(0, dot)) + text.substring(dot);
    }

    private static String signed(String digits, boolean negative, int width, boolean left, boolean zero,
                                 boolean plus, boolean space, boolean paren) {
        String prefix = negative ? (paren ? "(" : "-") : (plus ? "+" : (space ? " " : ""));
        String suffix = negative && paren ? ")" : "";
        int length = prefix.length() + digits.length() + suffix.length();
        if (width > length) {
            if (left) {
                return prefix + digits + suffix + spaces(width - length);
            }
            if (zero) {
                return prefix + zeros(width - length) + digits + suffix;
            }
            return spaces(width - length) + prefix + digits + suffix;
        }
        return prefix + digits + suffix;
    }

    private static String pad(String text, int width, boolean left) {
        if (width <= text.length()) {
            return text;
        }
        return left ? text + spaces(width - text.length()) : spaces(width - text.length()) + text;
    }

    private static String spaces(int count) {
        return repeat(' ', count);
    }

    private static String zeros(int count) {
        return repeat('0', count);
    }

    private static String repeat(char c, int count) {
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < count; i++) {
            out.append(c);
        }
        return out.toString();
    }
}
`;

/** Standard input as text: a Scanner and a BufferedReader over what the reader typed in the Input box. */
export const STDIN_SHIM = `
final class __In {
    static int pos = 0;

    static int read() {
        return pos < __Stdin.TEXT.length() ? __Stdin.TEXT.charAt(pos++) : -1;
    }
}

class InputMismatchException extends java.util.NoSuchElementException {
    InputMismatchException(String message) {
        super(message);
    }
}

class Scanner {
    private final String text;
    private int pos;

    Scanner() {
        this(__Stdin.TEXT);
    }

    Scanner(String text) {
        this.text = text;
    }

    private static boolean isSpace(char c) {
        return c == ' ' || c == (char) 9 || c == (char) 10 || c == (char) 13 || c == (char) 12;
    }

    private void skipSpace() {
        while (pos < text.length() && isSpace(text.charAt(pos))) {
            pos++;
        }
    }

    private String peekToken() {
        int save = pos;
        skipSpace();
        int start = pos;
        while (pos < text.length() && !isSpace(text.charAt(pos))) {
            pos++;
        }
        String token = text.substring(start, pos);
        pos = save;
        return token;
    }

    public boolean hasNext() {
        int save = pos;
        skipSpace();
        boolean has = pos < text.length();
        pos = save;
        return has;
    }

    public String next() {
        skipSpace();
        if (pos >= text.length()) {
            throw new java.util.NoSuchElementException();
        }
        int start = pos;
        while (pos < text.length() && !isSpace(text.charAt(pos))) {
            pos++;
        }
        return text.substring(start, pos);
    }

    public boolean hasNextInt() {
        if (!hasNext()) {
            return false;
        }
        try {
            Integer.parseInt(peekToken());
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public boolean hasNextLong() {
        if (!hasNext()) {
            return false;
        }
        try {
            Long.parseLong(peekToken());
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public boolean hasNextDouble() {
        if (!hasNext()) {
            return false;
        }
        try {
            Double.parseDouble(peekToken());
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public int nextInt() {
        if (!hasNext()) {
            throw new java.util.NoSuchElementException();
        }
        if (!hasNextInt()) {
            throw new InputMismatchException("For input string: \\"" + peekToken() + "\\"");
        }
        return Integer.parseInt(next());
    }

    public long nextLong() {
        if (!hasNext()) {
            throw new java.util.NoSuchElementException();
        }
        if (!hasNextLong()) {
            throw new InputMismatchException("For input string: \\"" + peekToken() + "\\"");
        }
        return Long.parseLong(next());
    }

    public double nextDouble() {
        if (!hasNext()) {
            throw new java.util.NoSuchElementException();
        }
        if (!hasNextDouble()) {
            throw new InputMismatchException("For input string: \\"" + peekToken() + "\\"");
        }
        return Double.parseDouble(next());
    }

    public float nextFloat() {
        return (float) nextDouble();
    }

    public boolean nextBoolean() {
        String token = next();
        if (token.equalsIgnoreCase("true")) {
            return true;
        }
        if (token.equalsIgnoreCase("false")) {
            return false;
        }
        throw new InputMismatchException("For input string: \\"" + token + "\\"");
    }

    public boolean hasNextLine() {
        return pos < text.length();
    }

    public String nextLine() {
        if (pos >= text.length()) {
            throw new java.util.NoSuchElementException("No line found");
        }
        int start = pos;
        while (pos < text.length() && text.charAt(pos) != (char) 10) {
            pos++;
        }
        String line = text.substring(start, pos);
        if (pos < text.length()) {
            pos++;
        }
        if (line.endsWith(String.valueOf((char) 13))) {
            line = line.substring(0, line.length() - 1);
        }
        return line;
    }

    public void close() {
    }
}
`;

/** getMessage, getLocalizedMessage: the compile-time class library has no Throwable.getMessage. */
export const MESSAGE_SHIM = `
final class __Ex {
    static String msg(Throwable t) {
        String s = t.toString();
        int i = s.indexOf(": ");
        return i < 0 ? null : s.substring(i + 2);
    }
}
`;

/** System.exit and Thread.sleep. exit ends the run by raising an error the runner recognises. */
export const EXIT_SHIM = `
final class __Sys {
    static void exit(int status) {
        System.err.print(String.valueOf((char) 1) + "EXIT");
        throw new Error("exit");
    }

    static void sleep(long millis) throws InterruptedException {
    }
}
`;

/** The line that holds what the program may read from standard input. */
export function stdinConstant(text: string): string {
  let literal = '';
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const code = text.charCodeAt(index);
    if (character === '"') literal += '\\"';
    else if (character === '\\') literal += '\\\\';
    else if (character === '\n') literal += '\\n';
    else if (character === '\r') literal += '\\r';
    else if (character === '\t') literal += '\\t';
    else if (code < 32 || code > 126) literal += '\\u' + code.toString(16).padStart(4, '0');
    else literal += character;
  }
  return `\nfinal class __Stdin {\n    static final String TEXT = "${literal}";\n}\n`;
}
