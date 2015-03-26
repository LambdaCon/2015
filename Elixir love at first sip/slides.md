class: center, first-slide

# Elixir: love at first sip

???

I thought I was being clever by using the word "sip" in the talk title since the
language is called Elixir. Well, I wasn't.



---
class: sips
<!-- ######################################################################## -->

--

![The First Few Sips](images/sips/the-first-few-sips.png)

--

![@elixirsips](images/sips/elixir-sips.png)

--

![A Sip of Elixir](images/sips/a-sip-of-elixir.png)



---
class: center
<!-- ####################################################################### -->

# Andrea Leopardi

@whatyouhide

andrea@leopardi.me

.avatar[![](images/avatar.jpg)]

???

My name is Andrea Leopardi.

This is my face on the internet.

I'm a recent CS graduate. I've been working on the web for about three years
now, doing frontend work at the beginning and backend work now.

I met Elixir about four months ago and I loved it right away; I started using it
on a bunch of project and I've been contributing to a lot of Elixir libraries
out there, including some work with the Elixir team.



---
class: center
<!-- ####################################################################### -->

# Questions

Interrupt me!

???

If you have any questions at any moment feel free to interrupt me, I'd be glad
if you did.

So, today I'm going to tell you about Elixir.



---
<!-- ######################################################################## -->

# Elixir

> Elixir is a dynamic, functional language designed for building scalable and
> maintainable applications.

--

Nice!

???

I could have come up with a nice pitch for Elixir, but I'm lazy and the Elixir
website already has one.

So, let's briefly see what that means.



---
<!-- ######################################################################## -->

# Erlang

--
- ERicsson LANGuage

--
- Built to handle telecom applications

--
- In 1986, ~30 years ago!

--
- Features:

--
  - Highly available

--
  - Extremely concurrent

--
  - Fault tolerant

???

Elixir is a language built on top of the Erlang virtual machine. It shares
pretty much everything with Erlang: Elixir data structures are Erlang data
structures, Elixir functions are Erlang functions and so on.


---
<!-- ######################################################################## -->

# What does it look like

```elixir
defmodule Slugger do
  @doc "Slugs a string."
  @spec slufigy(String.t) :: String.t
  def slugify(str) do
    str
    |> String.downcase
    |> String.replace("'", "")
    |> String.replace(~/[?!,\-:;.]/, "-")
  end
end
```

???

This is what Elixir looks like, just to give you an idea.

So, the pitch I showed you before said Elixir is:

- **Dynamic**
- **Functional**
- Designed for building **scalable**
- and **maintainable** applications

Let's take a look at those four points.



---
<!-- ######################################################################## -->

# Dynamic

- Dynamically typed (strongly typed)
- Runtime code evaluation


---
<!-- ######################################################################## -->

# Functional



---
<!-- ######################################################################## -->

# Functional

Immutable data structures


```elixir
list = [:foo, :bar, :baz]

List.delete_at(list, 1)
#=> [:foo, :baz]

list
#=> [:foo, :bar, :baz]
```

???

Most Elixir (actually, Erlang) data structures are immutable, with only a
handful of exceptions.



---
<!-- ######################################################################## -->

# Functional

High-order functions

```elixir
sum = fn(n) ->
  fn(x) -> x + n end
end

add42 = sum.(42)
add42.(1)
#=> 43
```

--

```elixir
Enum.map [1, 2, 3, 4], fn(x) ->
  x * 3
end
#=> [3, 6, 9, 12]
```



---
<!-- ######################################################################## -->

## Not *purely* functional

--

Side effects:

```elixir
iex> IO.puts "Hello world!"
Hello world!
:ok
```

--

Call-dependent results:

```elixir
iex> :erlang.now()
{1426, 179468, 348062}
iex> :erlang.now()
{1426, 179478, 386986}
```



---
<!-- ######################################################################## -->

# Scalable

```elixir
for _ <- 1..1_000_000 do
  spawn fn ->
    "hello"
  end
end
```

Thanks Erlang!

???

As I said, the Erlang VM has awesome support for concurrency, and Elixir takes
advantage of all that.

We will dig deeper into this later on.



---
<!-- ######################################################################## -->

# Maintainable

- Nice syntax
- *Extremely* extensible
- Well documented

???

Erlang's syntax is derived from Prolog and it isn't very nice, especially since
very few people are familiar with Prolog. Elixir is very Ruby-ish in its syntax,
so it has a friendlier syntax.

We'll talk about extensibility later on.

The documentation is very thorough and there's first-class support for
documentation baked right in the language.



---
class: center, elixir-loves-erlang
<!-- ####################################################################### -->

# Elixir <3 Erlang

???

As I said, Elixir shares most of its features with Erlang.

I will divide the rest of this talk in two main parts:

- in the first one I'll talk about all the awesome things that Elixir inherits
  from Erlang
- in the second one I'll focus on what Elixir brings to the table and why one
  may want to choose it over Erlang

I will skim over the basics (syntax, data types) and over the "classic"
functional features of the language, like:

- high-order functions
- immutable data structures

We're at a conference about functional languages after all!



---
<!-- ####################################################################### -->

# Pattern matching

`=` is not what it looks like.

???

This is a feature that a lot of languages have, and it's a feature that makes it
hard to program in languages that don't have it.

--

```elixir
list = [1, 2, 3, 4]

[first, second|rest] = list

first  #=> 1
second #=> 2
rest   #=> [3, 4]
```

???

We can match the structure of some data and bind variables while doing it.

Pattern matching is extremely useful to destructure complex data and filter only
the data we need.

--

```elixir
tuple = {:my, 3, "elements", :tuple}

{:my, how_many, "ele" <> rest_of_the_string, :tuple} = tuple

how_many           #=> 3
rest_of_the_string #=> "ments"
```

???

We can match on arbitrarily complex data structures and we also can match on the
values (instead of just binding).

`=` can be used à-la-assignment because a "variable" matches anything and is
bounded to it.



---
<!-- ####################################################################### -->

# Pattern matching

Can be used in function heads:

```elixir
def do_action(:something) do
  something()
end

def do_action(:something_else) do
  something_else()
end
```

???

Pattern matching can be used in function heads too.

- it is very optimized by the Erlang VM
- it makes code much cleaner and easier to understand than when conditionals are
  used (since the spotlight is on the structure of the data) and it moves that
  logic "out" of the function



---
<!-- ####################################################################### -->

# Pattern matching + guards = polymorphism

(on steroids!)

```elixir
defmodule Math do
  def factorial(n) when n < 0 do
    raise "negative"
  end

  def factorial(0) do
    1
  end

  def factorial(n) do
    n * factorial(n - 1)
  end
end
```

???

Usually polymorphism is done through types.

In Elixir you can do that through guards and a bunch of type-related test
functions (like `is_integer/1`), but you can push further and guard on the value
of the arguments.

This provides even *more* polymorphism, so to speak :).



---
<!-- ####################################################################### -->

# Processes

???

Erlang allows to build very distributed, scalable and fault-tolerant
applications.

In Erlang, the basic unit of computation is the **process**.

If you understand how an Erlang process works, then you will see all the power
of this language.

The first thing to keep in mind is that *an Erlang/Elixir process is not an OS
process*. It is entirely handled by the VM, allowing processes to:

- be very lightweight
- behave consistently over different OSs



---
<!-- ####################################################################### -->

# Processes

```elixir
pid = spawn fn ->
  IO.puts "Hello world!"
end
#=> #PID<0.61.0>
```

???

A process is created by **spawning** a function. Obviously, spawning is
asynchronous (or it wouldn't make sense, right?).



---
<!-- ####################################################################### -->

# **Lightweight** processes


```elixir
:timer.tc fn ->
  Enum.each 1..100_000, fn(_) ->
*   spawn(fn -> :foo end)
  end
end
#=> {1735741, :ok}
```

That's about **1.7s** for 100k spawned processes!

???

Processes are **extremely** lightweight since they're handled by the VM. In the
example, we're timing (`:timer.tc`) the spawning of a *hundred thousand*
processes and it only takes less than two seconds to do it.



---
<!-- ####################################################################### -->

# Sending messages

```elixir
pid = spawn fn ->
  :timer.sleep 20_000
end

send pid, "Hello!"
#=> "Hello!"
```

???

Processes cannot share memory.

The only form of communication between processes is through *asynchronous*
message passing.

Sending is **asynchronous**; it always returns the message being sent.

Messages sent to a process are guaranteed to be delivered to that process, and
they end up in that process' **message queue**.



---
<!-- ####################################################################### -->

# Receiving messages

```elixir
pid = spawn fn ->
  receive do
    {from, :hello} -> send from, {self(), "Hello to you!"}
    {from, :bye}   -> send from, {self(), "Bye bye!"}
  end
end
```
???

Receiving messages is **synchronous** and done through the `receive` construct.

When a process calls `receive`, the first message in the queue that matches one
of the patterns is removed from the queue. If no messages are in the queue, the
process waits for one.

The process stops receving only if a message matches one of the patterns.

--

```elixir
send pid, {self(), :hello}
#=> {#PID<0.79.0>, :hello}
```

--

```elixir
receive do
  {_from, message} -> "Response: #{message}"
end
#=> "Response: Hello to you!"
```



---
class: actor
<!-- ####################################################################### -->

```elixir
defmodule Actor do
  # "Client"
  def start(initial_state) do
    spawn fn -> loop(initial_state) end
  end

  def get(pid) do
    send pid, {:get, self()}
    receive do
      state -> state
    end
  end

  def put(pid, state) do
    send pid, {:put, self(), state}
  end

  # "Server"
  def loop(state) do
    receive do
      {:get, from} ->
        send(from, state)
        loop(state)
      {:put, from, new_state} ->
        loop(new_state)
    end
  end
end
```

???

These constructs give enough power to implement complex behaviours.

For example, you can implement an instance of the actor pattern to keep state
with just these primitives.

I know this is a lot of code for one slide, but it's just to show that it looks
very concise and short and isn't particularly complicated.

--

```elixir
actor = Actor.start(1)
Actor.set(actor, 2)

Actor.get(actor)
#=> 2
```



---
class: center, otp
<!-- ####################################################################### -->

# OTP

Open Telecom Platform

???

We could talk a lot longer about Erlang processes and concurrency, especially
since Erlang has OTP.

The OTP is a set of Erlang libraries which solve the most common
concurrency-related problems.

We won't have time to dig into it, but if you're interested in it just **run**
to the *Closure Hall* where there's an entire workshop on it happening **right
now** :).


---
class: center, like-cs-for-js
<!-- ####################################################################### -->

Ah, like CoffeeScript for JavaScript

???

This is the point where people usually arrive at the conclusion that Elixir is
for Erlang what CoffeeScript is for JavaScript: a nicer syntax over the same language.

That's not true.

It's very similar to what Clojure is for Java.

In the rest of the talk, we will talk about what makes Elixir great and why it's
a valid choice over Erlang.

--

.no[NO]

--

More like Clojure for Java



---
class: funny-quote
<!-- ####################################################################### -->

> Elixir is what would happen if **Erlang**, **Clojure** and **Ruby** somehow
> had a baby and it wasn't an accident.
> -- <cite>Devin Torres</cite>

???

This quote nicely sums up what Elixir is.



---
<!-- ####################################################################### -->

# Interop

???

When you build a language on top of another, one of the most important things is
compatibility.

Erlang is ~30 years old, so it has a lot of libraries around and it's nice you
can use them from Elixir.

--

Erlang

```erlang
random:uniform().
%=> 0.4435846174457203
```

Elixir

```elixir
:random.uniform
#=> 0.4435846174457203
```

???

Actually, you're often forced to use Erlang libraries (e.g., `crypto`) since
there is no Elixir alternative.



---
<!-- ####################################################################### -->

# Interop

Erlang

```erlang
lists:map(fun(El) -> El + 2 end, [1, 2, 3]).
%=> [3, 4, 5]
```

Elixir

```elixir
:lists.map(fn(el) -> el + 2 end, [1, 2, 3])
#=> [3, 4, 5]
```

???

Elixir can interop with data structures too, since they're shared with Erlang.



---
<!-- ####################################################################### -->

# Protocols

<!-- Highlighted as Ruby since highlight.js is messy sometimes :( -->
```ruby
defprotocol Blank do
  def blank?(data)
end
```

???

Inspired by Clojure. Similar to interfaces.

Another tool for polymorphism; they make many things extremely easy, like the
`Inspect` protocol with which data structures can print themselves.

--

```elixir
defimpl Blank, for: List do
  def blank?(list) do
    Enum.empty? list
  end
end
```

--

```elixir
Blank.blank? []        #=> true
Blank.blank? [1, 2, 3] #=> false
```



---
<!-- ####################################################################### -->

# Pipe operator

???

Singing the praises of an *operator* may sound silly, but the pipe operator can
really make code **extremely** clear.

--

This...

```elixir
Enum.map(List.flatten([1, [2], 3]), fn(x) -> x * 2 end)
```

--

...becomes this:

```elixir
[1, [2], 3]
|> List.flatten
|> Enum.map(fn(x) -> x * 2 end)
```

???

The pipe operator simply takes the expression on its left-hand side and
passes it as the first argument to the function call on its right-hand side.

It works just like the Unix pipe. It's really useful especially because Elixir
is a functional language, and functional languages are often based on
transforming data (because of immutability). The pipe operator makes
transformation very clear.



---
<!-- ####################################################################### -->

# Pipe operator

Non-ridicolous (still simplified) example:

```elixir
def eval_file(path) do
  path
  |> File.read!
  |> Tokenizer.tokenize
  |> Parser.parse
  |> Interpreter.eval
end
```

Nice, uh?



---
<!-- ####################################################################### -->

# Tooling

Great REPL (IEx):

```elixir
iex(1)> 3 + 4
7
iex(3)> v(1) + 4
11
```



---
<!-- ####################################################################### -->

# Tooling

Built-in templating language (EEx):

```elixir
EEx.eval_string "Hello, <%= name %>", [name: "José"]
#=> "Hello, José"
```



---
<!-- ####################################################################### -->

# Tooling

Build/test/project management tool (Mix):

```bash
mix new my_new_project
cd my_new_project
mix compile
mix test
```



---
<!-- ####################################################################### -->

# Tooling

Package manager (Hex):

```elixir
def dependencies do
  [{:cowboy, "~> 1.0"},
   {:plug, github: "elixir-lang/plug"}]
end
```

(not in the core)



---
<!-- ####################################################################### -->

Ok, so that's pretty much it...

--

.wait[WAIT]

???

We saw that Elixir adds a lot of niceties to Erlang, and it's a valid
alternative. Learning the syntax and all the quirks may not be worth it, but
it's nice to have another option.

Ok, the talk is ov-WAIT! METAPROGRAMMING!



---
class: metaprogramming, center
<!-- ####################################################################### -->

# METAPROGRAMMING



---
class: center
<!-- ####################################################################### -->

# MACROS!

.kid[![](images/metaprogramming.gif)]



---
class: center
<!-- ####################################################################### -->

# HOMOICONICITY!

.andy[![](images/homoiconicity.gif)]



---
class: center
<!-- ####################################################################### -->

.minions[![](images/minions.gif)]

???

To be honest, this is how I imagined you at this point but, well... ok.



---
<!-- ####################################################################### -->

# Homoiconicity

> In a homoiconic language the primary representation of programs is also a data
> structure in a primitive type of the language itself.

The representation of Elixir code is valid Elixir code!

???

This will be familiar to Lispers because the syntax reflects this property.



---

# Quoting

```elixir
quote do
  1 + 2
end
#=> {:+, _metadata, [1, 2]}
```

???

You can **quote** an expression to get its internal representation (the
*Abstract Syntax Tree*).

--

Looks not-so-different from Lisp:

```lisp
(+ 1 2)
```

???

Quoting a primitive value returns that value, while quoting everything else
returns a three-elements tuple with:

* function name
* metadata
* arguments

--

```elixir
{op, meta, args} = quote(do: 1 + 2)

new_args = Enum.map(args, fn(x) -> x * 2 end)
#=> [2, 4]

Code.eval_quoted {op, meta, new_args}
#=> 6
```

???

You can manipulate the AST just like any other Elixir code.



---
<!-- ####################################################################### -->

# Unquoting

--

```elixir
a = 1

quote do
  a + 3
end
#=> {:+, _metadata, [{:a, [], Elixir}, 3]}
```

???

When you want to inject a value into a quoted expression. Think of it like
**string interpolation** for code.

--

```elixir
a = 1

quote do
  unquote(a) + 3
end
#=> {:+, _metadata, [1, 3]}
```



---
<!-- ####################################################################### -->

# Macros

```elixir
defmodule MyMacros do
  defmacro unless(condition, do: something) do
    quote do
      if !unquote(condition) do
        unquote(something)
      end
    end
  end
end
```

???

Defining a macro is analogous to defining a function, except it receives ASTs
instead of values and returns an AST.

--

```elixir
MyMacros.unless 2 + 2 == 5 do
  "Math still works"
end
#=> "Math still works"
```



---
class: center, demo-time
<!-- ####################################################################### -->

# Demo time!

May the demo gods be with me

???

People who are familiar with macros know the power they bring with them, but I
think it's hard to grasp it just by explaining how they work.

So, for the remaining part of the talk, I'd like to quickly show you some use
cases of macros.

Dataset:
https://dspl.googlecode.com/hg/datasets/google/canonical/currencies.csv



---
class: center
<!-- ####################################################################### -->

# Questions?

Andrea Leopardi

@whatyouhide (twitter/github)

andrea@leopardi.me
