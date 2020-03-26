def halts(f):
  pass

def halter():
  return

def looper():
  while True:
    pass

def impossible():
  return halts(impossible) and looper()

# assume impossible halts
#  => impossible does not halt
# assume impossible does not halt
#  => impossible does halt

# proof by contradiction

# COMPILERS

def returns_constant(f):
  pass

def halts(f):
  def inner ():
    f()
    return 0
  return returns_constant(inner)

# REFACTORING

def fns_are_equiv(f, g):
  pass

def halts(f):
  def inner():
    f()
    return 0
  def inner2():
    return 0
  return fns_are_equiv(inner, inner2)

# Idris (totality checker)

total def f():
  pass

def conservative_halts(f):
  pass