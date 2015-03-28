% TDD, as in <span class="red">Type</span>-Directed Development
% Clément Delafargue
% LambdaCon 2015-03-28

-------------------------------------------

# I'm online!

 - [\@clementd](https://twitter.com/clementd) on twitter
 - [cltdl.fr/blog](https://cltdl.fr/blog)
 - [clever cloud](http://clever-cloud.com)

-------------------------------------------

![](assets/clever.png)

-------------------------------------------

<span style="font-size: 5.5em;">λ</span>

-------------------------------------------

![](http://clementd-files.cellar-c1.clvrcld.net/lol/forrest.jpg)

-------------------------------------------

## Example time

-------------------------------------------

# Example time

    GET /endpoint?number=5

    10

-------------------------------------------

```scala

def addFiveAction(
    params: Map[String, String]
) = {

    val nbS = params("number")
    if(nbS != "") {
        val nb = nbS.toInt
        nb + 5
    } else {
        0
    }
}

```

-------------------------------------------

```scala

addFiveAction(Map("number" -> "12"));
    // 17

addFiveAction(Map("yolo" -> "12"));
    // java.lang.NullPointerException

addFiveAction(Map("number" -> "yolo"));
    // java.lang.NumberFormatException

```

-------------------------------------------

# Pokemon Driven Development
<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/cat-clothes.webm" loop/>

-------------------------------------------

<div style="font-size: 0.8em;">

```scala

def addFiveAction(
  params: Map[String, String]) = {
    val nbS = params("number")

    if(nbS != null) {
        if(!nbS != "") {
            try {
                val nb = nbS.toInt
                nb + 5
            } catch {
                case e: NumberFormatException e => 0
            }
        }
    } else {
        0
    }
}

```
</div>

# De plous en plous difficile

    GET /endpoint?n1=20&n2=22

    42
-------------------------------------------

<div style="font-size: 0.5em;">

```scala

def addNumbersAction(
  params: Map[String, String]) = {
    val nbS1 = params("n1");
    val nbS2 = params("n2");

    if(nbS1 != null) {
        if(!nbS1 != "") {
            try {
                val nb1 = nbS1.toInt
                if(nbS2 != null) {
                    if(!nbS2 != "") {
                        try {
                            val nb2 = nbS2.toInt
                            nbS1 + nbS2
                        } catch {
                            case e: NumberFormatException => 0
                        }
                    }
                }
            } catch {
                case e: NumberFormatException => 0
            }
        }
    } else {
        0
    }
}

```
</div>

<details>Hard to read, easy to get wrong, information lost. The code's
structure si not correlated to the problem structure anymore. accidental
complexity</details>

-------------------------------------------

![](assets/carrie.jpg)

-------------------------------------------

## Thinking with types

<details>Encode that information in the type system</details>

-------------------------------------------

## From a map, I can get a value…

-------------------------------------------

## maybe

-------------------------------------------

```scala
def getKeyAt(
  values: Map[String, String],
  key: String
): MaybeString
```

-------------------------------------------

## from a string, I can get an int…

-------------------------------------------

## maybe

-------------------------------------------

```scala
def parseInt(
  string: String
): MaybeInt
```

-------------------------------------------

![](assets/option.png)

<details>Aka maybe, optional</details>

-------------------------------------------


```scala
def parseInt(str: String):
  Option[Int]

map[A,B]#get(key: A): Option[B]
```

-------------------------------------------

```scala
def getInt(
    index: String,
    vals: Map[String, String]
): Option[Int]
```

-------------------------------------------

![](assets/flatmap.png)

<details>Chain the computations, fail if one fails: sequentiality</details>

-------------------------------------------

<div style="font-size: 0.9em;">
```scala
def addNumbersAction(
  params: Map[String, String]
): Int = {
    val i1 = getInt("n1", params)
    val i2 = getInt("n2", params)
    i1.getOrElse(0) + i2.getOrElse(0)
}

```
</div>

<details>We can change the default data injection point, and the types will change</details>


-------------------------------------------

<div style="font-size: 0.5em;">

```scala

def addNumbersAction(
  params: Map[String, String]) = {
    val nbS1 = params("n1");
    val nbS2 = params("n2");

    if(nbS1 != null) {
        if(!nbS1 != "") {
            try {
                val nb1 = nbS1.toInt
                if(nbS2 != null) {
                    if(!nbS2 != "") {
                        try {
                            val nb2 = nbS2.toInt
                            nbS1 + nbS2
                        } catch {
                            case e: NumberFormatException => 0
                        }
                    }
                }
            } catch {
                case e: NumberFormatException => 0
            }
        }
    } else {
        0
    }
}

```
</div>

-------------------------------------------

<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/computer-ok.webm" loop/>

-------------------------------------------

## Correct

-------------------------------------------

## by construction

<details>Impossible to express an incorrect program.</details>


-------------------------------------------

<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/obviously.webm" loop/>

-------------------------------------------

![](http://clementd-files.cellar-c1.clvrcld.net/lol/correcto.jpg)

-------------------------------------------

## Why not tests?

<details>Not the real question</details>

-------------------------------------------

## Why not <span class="red">*only*</span> tests?

-------------------------------------------

<span style="font-size: 5.5em;">∃</span>

« there exists »

<details>tests show the presence of bugs, not their absence</details>

-------------------------------------------

## `Int -> Int`

-------------------------------------------

### 2<sup>32</sup>

<details>if the code is deterministic</details>

-------------------------------------------

### 2<sup>64</sup>

<details>if the code is deterministic</details>

-------------------------------------------

## `String -> String`

-------------------------------------------

## &infin;

<details>if the code is deterministic</details>

-------------------------------------------

<span style="font-size: 5.5em;">∀</span>

« for all »

-------------------------------------------

## Type &hArr; Property

-------------------------------------------

## Program &hArr; Proof

-------------------------------------------

# <br/><br />  <small>provably > probably</small>

<details>not necessarily a formal proof (expensive), but it's doable and the
program has the same structure as the proof</details>

-------------------------------------------

## Expressive type systems

<details>not necessarily a formal proof (expensive), but it's doable and the
program has the same structure as the proof</details>

-------------------------------------------

## Typed control strucures

-------------------------------------------

## Everything is an expression

-------------------------------------------

# homogeneous branches

<div style="margin-top: 300px;">
```scala
val myValue = if(expression) {
  "if true"
} else {
  "if false"
}
```
</div>

-------------------------------------------

# Typed control structures

<div style="margin-top: 300px;">
```scala
val myValue =
  for(x <- xs)
  yield x*x
```
</div>

-------------------------------------------

## Maybe

-------------------------------------------

## NonEmptyList

<details>list guaranteed to have at least one element</details>

-------------------------------------------

## newtype + smart constructor

<details>email / string. No runtime cost. Gateway when you construct value</details>

-------------------------------------------

## Tagged types

<details>perfect for physical quantities. Type + unit</details>

-------------------------------------------

```scala
sealed trait Meter
sealed trait Mile

type RegularLength = Int @@ Meter
type ImperialGobbledygook = Int @@ Mile


val marsProbeAltitude: RegularLength = …
```

-------------------------------------------

## Parametricity

-------------------------------------------

## Parametricity <br /> (aka generics)

<details>Most important feature in a type system. I don't take seriously
languages with static types and no parametricity</details>

# Ignorance is bliss

<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/i-dont-care.webm" loop/>

<details>Prevents you from assuming too much. You can only use the properties
you've explicitely asked for</details>

# Parametricity

<div class="text big">

```scala
def f[A](x: A): A
```
</div>

<details>Assuming it returns a value and doesn't crash or do stupid things, it
can only return its argument: no way to construct an A</details>

# Parametricity

<div class="text big">

```scala
def compose[A,B,C](
    g: (B => C),
    f: (A => B)
): (A => C)
```
</div>

<details>only way to get a C is to apply g to a B, only way to get a B is to
apply f to an A, which you have.</details>

# Parametricity

```scala
def rev[A](xs: List[A]): List[A]
```

<details>types aren't always once-inhabited, but they still prove interesting
things and reduce dramatically the number of tests needed</details>

-------------------------------------------

### `rev(Nil)` <br /> `==` <br/> `Nil`

<details>you can't create As out of thin air, so nil -> nil</details>

-------------------------------------------

### `x in rev(a) => x in a`

# Theorems for free
<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/money-loop.webm" loop/>

-------------------------------------------
  
  
  
```scala
trait List[A] {
    def filter(p: A => Boolean): List[A]

    def map[B](f: A => B): List[B]
}

l.filter(compose(p,f)).map(f) ==
l.map(f).filter(p)
```

<details>mathematical proof of that equality. No test needed</details>

-------------------------------------------

## Discipline

-------------------------------------------

# no `null`s
<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/bang-boom.webm" loop/>

-------------------------------------------

## type  &hArr; property

-------------------------------------------

## proof  &hArr; program

-------------------------------------------

## `null` can inhabit any type

-------------------------------------------

## `null` can prove any property

# no reflection
<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/bicycle-gorilla.webm" loop/>

-------------------------------------------

### reflection breaks blissful ignorance

-------------------------------------------

# Reflection

<div class="text big">
```scala
def f[A](x: A): String
```
</div>

-------------------------------------------

<div class="text big bottom">
```scala
def f[A](x: A): String =

x match {
  case v: String => v
  case v: Int => "int"
  case _ => "whatever"
}
```
</div>

# toString / equals / hashCode
<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/driving-fail.webm" loop/>

<details>same as reflection: breaks ignorance by giving behaviour to all types</details>

-------------------------------------------

<div class="text big">
```scala
def f[A](x: A): String =
x.toString
```
</div>


# no exceptions
<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/retards.webm" loop/>

<details>same as null: bottom</details>

# Side effects
![](http://clementd-files.cellar-c1.clvrcld.net/lol/spock-sob.jpg)

# side-effects

```scala
def f[A](x: A): String = {
  launchBallisticMissile()

  System.getenv("JAVA_HOME")
}
```

<details>side effects not encoded in types => hidden information. Includes
unrestricted mutability</details>

-------------------------------------------

# Fast and loose reasoning is morally correct

<details>Let's program in a safe subset. It's ok to do so even though it isn't
enforced by the compiler</details>

# <span class="red">Type</span>-Directed Development

# Not a silver bullet
<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/itworks.webm" loop/>

<details>types can't always prove everything</details>


# Just helpful
<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/fabulous.webm" loop/>

<details>but they bring a lot</details>

# Confidence
<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/bungee_explosion.webm" loop/>

-------------------------------------------

## Big Refactoring

-------------------------------------------

## Dependencies update

-------------------------------------------

## Play Framework

<details>minor version but changes in the streaming layer, which I used
extensively</details>

-------------------------------------------

## Scalaz 6.x -> 7.x

<details>major bump, whole different architecture, type changes</details>

-------------------------------------------

## DB access library

-------------------------------------------

### It typechecks, ship it

<details>4 evenings / nights of mindless refactoring. When it compiled, it was
ok (I also ran tests to be sure, though)</details>



# Modular thinking

<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/hamsters.webm" loop/>

<details>Properties are enforced at the boundaries, you can safely ignore the
rest of the world when working on a function</details>

-------------------------------------------

## Not just about safety
<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/fire-trick.webm" loop/>

<details>often the first argument but imo not the most important</details>

# Types lay out algorithms
<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/gym.webm" loop/>

<details>just as TDD is important for design</details>

# Hole-Driven-Development
<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/abyss.webm" loop/>

<details>step by step, compiler assisted code writing</details>

-------------------------------------------

```scala
case object Hole

def compose[A,B,C](
    g: (B => C),
    f: (A => B)
): (A => C) = Hole

Hole: A => C
```


-------------------------------------------

```scala

def compose[A,B,C](
    g: (B => C),
    f: (A => B)
): (A => C) = (x: A) => Hole

x: A
Hole: C
```


-------------------------------------------

```scala

def compose[A,B,C](
    g: (B => C),
    f: (A => B)
): (A => C) = (x: A) => g(Hole)

X: A
Hole: B
```

-------------------------------------------


```scala

def compose[A,B,C](
    g: (B => C),
    f: (A => B)
): (A => C) = (x: A) => g(f(Hole))

x: A
Hole: A
Hole = x
```

-------------------------------------------

```scala

def compose[A,B,C](
    g: (B => C),
    f: (A => B)
): (A => C) = (x: A) => g(f(x))

```

-------------------------------------------

```scala

def fmap[A,B](
    f: (A => B),
    xs: List[A]
): List[B] = Hole

Hole: List[B]
```

-------------------------------------------

```scala

def fmap[A,B](
    f: (A => B),
    xs: List[A]
): List[B] = xs match {
    case Nil => Nil
    case (head :: tail) =>
        Hole1 :: Hole2
}

head: A
tail: List[A]
Hole1: B
Hole2: List[B]
```

-------------------------------------------

```scala

def fmap[A,B](
    f: (A => B),
    xs: List[A]
): List[B] = xs match {
    case Nil => Nil
    case (head :: tail) =>
        f(head) :: fmap(f, tail)
}
```

# Test-Driven Development

![](assets/red-green-refactor.png)

# <span>Type</span>-Driven Development

![](assets/red-green-refactor.png)


-------------------------------------------

### Types make communication easy

# With machines

<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/cyberman_dance.webm" loop/>

<details>obvious</details>

-------------------------------------------

## Type checking

-------------------------------------------

# Tooling
<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/hammer.webm" loop/>

-------------------------------------------

<div style="background-color: blue; width: 100%; height: 100%">
### <span style="font-family: 'Comic Sans MS'; color: yellow;">Haskell type syntax</span>
</div>

-------------------------------------------

## `a -> a`

-------------------------------------------

## `Int -> Int`

-------------------------------------------

## `a -> b -> a`

<details>function which takes an a and a b, produces an a</details>

-------------------------------------------

## `(a, b) -> a`

<details>function which takes an a and a b, produces an a</details>

-------------------------------------------

## `a -> (b -> a)`

<details>currying. function which takes an a, produces a function that takes a
b, produces an a. allows for very effective composition</details>


-------------------------------------------

## `(Ord a) =>`<br/>`[a] -> [a]`

<details>The only thing we know about a is that it has a total order</details>

-------------------------------------------

## Intent

-------------------------------------------

# Hoogle \<3 \<3

<http://www.haskell.org/hoogle>

-------------------------------------------

## Remove duplicates

-------------------------------------------

### `Eq a =>` <br /> `[a] -> [a]`

-------------------------------------------

<video src="assets/hoogle-nub.webm" controls/>

-------------------------------------------

### `[Maybe a] ->` <br /> `Maybe [a]`

-------------------------------------------

<video src="assets/hoogle-sequence.webm" controls/>

# With humans

<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/dumb_dumber.webm" loop/>

<details>I use types when I program in javascript. I'm just not helped by a
compiler</details>

-------------------------------------------

# Types can't always prove everything

-------------------------------------------

## And that's ok

-------------------------------------------

<div class="text big">
```scala

def reverse[A](
    xs: List[A]
): List[A]
```
</div>

<details>How many tests do i have to write to completely specify its
behaviour?</details>

-------------------------------------------

<div style="font-size: 1.2em;">

```scala

def reverseProp[A: Equal](
  xs: List[A],
  ys: List[A]
) = {

    reverse(xs ++ ys) ==
    reverse(ys) ++ reverse(xs)
}
```

</div>

# Property-based reasoning

# Perfect for edge cases

# Test the specification

<details>used by John Hugues to assess the consistency of norms in embeded
systems for cars</details>

-------------------------------------------

Types *then*

Property-based tests *then*

Unit tests

-------------------------------------------

![](assets/pyramid.png)

-------------------------------------------

## Lay out the function types

-------------------------------------------

## Write property-based tests

-------------------------------------------

### Operations on a type + Laws

-------------------------------------------

<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/oh-yeah.webm" loop/>

# Algebra
![](./assets/chalkboard.jpg)

-------------------------------------------

## Figure out the data structure

-------------------------------------------

## Implement

-------------------------------------------

## Unit test for regressions

-------------------------------------------

## ???

-------------------------------------------

## Profit

![](http://clementd-files.cellar-c1.clvrcld.net/lol/epic-granny.jpg)

-------------------------------------------

## Types are

-------------------------------------------

## Safety feature

-------------------------------------------

## High level reasoning tool

-------------------------------------------

## Communication tool

-------------------------------------------

## Let's use them
<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/banco.webm" loop/>

# Read this

 - [TAPL](http://www.cis.upenn.edu/~bcpierce/tapl/)
 - [PFPL](http://www.cs.cmu.edu/~rwh/plbook/book.pdf)

# Read this

 - [Functional Programming in Scala](http://manning.com/bjarnason)
 - [Functional and Reactive Domain Modeling](http://manning.com/ghosh2/)

# Read this

 - [\@parametricity](https://twitter.com/parametricity)
 - [Parametricity](http://dl.dropboxusercontent.com/u/7810909/media/doc/parametricity.pdf)
 - [Theorems for free](http://ttic.uchicago.edu/~dreyer/course/papers/wadler.pdf)

# Thanks
<video src="http://clementd-files.cellar-c1.clvrcld.net/lol/axolotl.webm" loop/>

-------------------------------------------

 - [\@clementd](https://twitter.com/clementd) on twitter
 - [cltdl.fr/blog](https://cltdl.fr/blog)
 - [clever-cloud.com](http://clever-cloud.com)
