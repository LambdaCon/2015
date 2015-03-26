defmodule MoneyPlease.Mixfile do
  use Mix.Project

  def project do
    [app: :currencies,
     version: "0.0.1",
     elixir: "~> 1.0",
     deps: deps]
  end

  defp deps do
    [{:httpoison, "~> 0.6"}]
  end

  def application do
    [applications: [:logger]]
  end
end
