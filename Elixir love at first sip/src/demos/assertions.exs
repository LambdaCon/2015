# First version with generic assertion code.
defmodule Assertions do
  defmacro assert(code) do
    quote do
      if unquote(code) do
        IO.puts "ok"
      else
        raise """
        Failure!
        Code: #{unquote(Macro.to_string(code))}
        """
      end
    end
  end
end


# Second version which uses pattern matching to differentiate operators in order
# to show LHS and RHS.

defmodule Assertions do
  defmacro assert({_op, _meta, [lhs, rhs]} = code) do
    quote do
      if unquote(code) do
        IO.puts "ok"
      else
        raise """
        Failure!
        Code: #{unquote(Macro.to_string(code))}
        LHS: #{unquote(lhs)}
        RHS: #{unquote(rhs)}
        """
      end
    end
  end

  defmacro assert(code) do
    quote do
      if unquote(code) do
        IO.puts "ok"
      else
        raise """
        Failure!
        Code: #{unquote(Macro.to_string(code))}
        """
      end
    end
  end
end


# This has a bug because the operator isn't checked and the `{op, meta, [lhs,
# rhs]}` form could easily represent a function call with two arguments. To fix
# that, we should check that `op` is in a list of known operators, but we're not
# going to do that now.
