X_B = {
  ("B", "s1"): ("X", "R", "s2"),
  ("B", "s2"): ("B", "L", "s3"),
  ("X", "s3"): ("B", "R", "s4"),
  ("B", "s4"): ("B", "L", "s1")
}

ADDER = {
  ("B", "s1"): ("(", "R", "s2"),
  ("B", "s2"): ("1", "R", "s3"),
  ("B", "s3"): ("1", "R", "s4"),
  ("B", "s4"): ("+", "R", "s5"),
  ("B", "s5"): ("1", "R", "s6"),
  ("B", "s6"): ("1", "R", "s7"),
  ("B", "s7"): ("1", "R", "s8"),
  ("B", "s8"): (")", "R", "s9"),

  ("B", "s9"): ("B", "L", "s9"),
  (")", "s9"): (")", "L", "s9"),
  ("1", "s9"): ("1", "L", "s9"),
  ("+", "s9"): ("1", "R", "s10"),

  ("1", "s10"): ("1", "R", "s10"),
  (")", "s10"): ("B", "L", "s11"),

  ("1", "s11"): (")", "R", "s12"),

  ("B", "s12"): ("B", "R", "s13"),
  ("B", "s13"): ("B", "L", "s12")
}

def simulate (instructions):
  tape = ["B"] * 16
  head = 0
  state = "s1"

  for _ in range(24):
    print(state.rjust(4) + ": " + "".join(tape))
    print(" " * 6 +  " " * head + "^")
    
    tape[head], head_dir, state = instructions[(tape[head], state)]
    head += 1 if head_dir == "R" else -1

simulate(ADDER)