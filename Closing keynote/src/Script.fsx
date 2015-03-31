let genRandomNumbers count min max =
      let rnd = System.Random()
      List.init count (fun _ -> rnd.Next (min, max))
  
let shortList = genRandomNumbers 10 1 290

printfn "\n\nThe winner is %i\n\n"
  (shortList.Item 0)