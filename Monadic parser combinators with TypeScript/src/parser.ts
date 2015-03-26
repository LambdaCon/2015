interface IParser<A> {
  (cs:string): [A, string][];
}

interface Parser<A> extends IParser<A> {
  bind: <B>(f:(v:A) => Parser<B>) => Parser<B>;
}

interface Monad<A> {
  unit: (v:A) => Monad<A>;
  bind: <B>(m:Monad<A>) => (f:(v:A) => Monad<B>) => Monad<B>;
}

var concat = [].concat.apply.bind([].concat, []);

export var mp = <A>(p:IParser<A>):Parser<A> => {
  var parser = <Parser<A>>p;

  parser.bind =
    <B>(f) => mp<B>(cs => concat(p(cs).map(res => f(res[0])(res[1]))));

  return parser;
};

export var item = mp(cs => cs.length ? [[cs[0], cs.substr(1)]] : []);
export var unit = <A>(a:A):Parser<A> => mp(cs => [[a, cs]]);
export var zero = <T>() => mp<T>(cs => []);
export var plus = <A>(p:Parser<A>, q:Parser<A>):Parser<A> => mp(cs => p(cs).concat(q(cs)));

export var pplus = <A>(p:Parser<A>, q:Parser<A>):Parser<A> => mp(cs => {
  var res = plus<A>(p, q)(cs);
  return res.length ? [res[0]] : [];
});

export var sat = (pred:(v:string) => boolean):Parser<string> =>
  item.bind(x => pred(x) ? unit(x) : zero<string>());

export var char = (x:string) => sat(y => y === x);

export var string = (x:string):Parser<string> =>
  x.length ? char(x[0]).bind(c => string(x.substr(1)).bind(cs => unit(c + cs))) : unit('');

export var seq = <A, B>(p:Parser<A>, q:Parser<B>):Parser<[A, B]> =>
  p.bind(x => q.bind(y => unit<[A, B]>([x, y])));

export var naiveSeq = <A, B>(p:Parser<A>, q:Parser<B>):Parser<[A, B]> => mp(cs => {
  var pRes:[A, string][] = p(cs);
  var qRes:[B, string][] = q(pRes[0][1]);
  var res:[A,B] = [pRes[0][0], qRes[0][0]];

  return [[res, qRes[0][1]]];
});

export var digit = sat(x => x >= '0' && x <= '9');
export var lower = sat(x => x >= 'a' && x <= 'z');
export var upper = sat(x => x >= 'A' && x <= 'Z');

export var letter = plus(lower, upper);
export var alphanum = plus(letter, digit);

export var word:Parser<string> = plus(letter.bind(x => word.bind(xs => unit(x + xs))), unit(''));
export var many1 = <A>(p:Parser<A>):Parser<A[]> => p.bind(x => many(p).bind(xs => unit([x].concat(xs))));
export var many = <A>(p:Parser<A>):Parser<A[]> => pplus(many1(p), unit([]));

export var ident = lower.bind(x => many(alphanum).bind(xs => unit(x + xs)));
export var nat:Parser<number> = many1(digit).bind(xs => unit(parseFloat(xs.join(''))));

export var sepby1 = <A, B>(p:Parser<A>, sep:Parser<B>):Parser<A[]> =>
  p.bind(x => many(sep.bind(_ => p)).bind(xs => unit([x].concat(xs))));

export var sepby = (p, sep) => pplus(sepby1(p, sep), unit([]));

export var chainl1 = <A>(p:Parser<A>, op:Parser<(a:A) => (b:A) => A>):Parser<A> => {
  var rest = (x:A):Parser<A> => pplus(op.bind(f => p.bind(y => rest(f(x)(y)))), unit(x));
  return p.bind(rest);
};

export var chainl = (p, op, a) => pplus(chainl1(p, op), unit(a));

export var int = plus(char('-').bind(_ => nat.bind(n => unit(-n))), nat);
export var ints = char('[').bind(_ => sepby1(int, char(',')).bind(ns => char(']').bind(_ => unit(ns))));
export var bracket = (open, p, close) => open.bind(_ => p.bind(x => close.bind(_ => unit(x))));
export var intsv2 = bracket(char('['), sepby1(int, char(',')), (char(']')));

export var space = many(sat(x => x == ' '));
export var token = <A>(p:Parser<A>):Parser<A> => p.bind(a => space.bind(_ => unit(a)));
export var symb = (cs:string):Parser<string> => token(string(cs));
export var apply = <A>(p:Parser<A>, cs:string):[A, string][] => space.bind(_ => p)(cs);

export var expr:Parser<number>;
export var addop:Parser<(a:number) => (b:number) => number>;
export var mulop:Parser<(a:number) => (b:number) => number>;
export var term:Parser<number>;
export var factor:Parser<number>;
export var numericDigit:Parser<number>;

addop = pplus(
  symb('+').bind(_ => unit(a => b => a + b)),
  symb('-').bind(_ => unit(a => b => a - b))
);

mulop = pplus(
  symb('*').bind(_ => unit(a => b => a * b)),
  symb('/').bind(_ => unit(a => b => a / b))
);

numericDigit = token(digit).bind(x => unit(parseInt(x)));

factor = pplus(
  numericDigit,
  symb('(').bind(_ => expr.bind(n => symb(')').bind(_ => unit(n))))
);

term = chainl1(factor, mulop);
expr = chainl1(term, addop);