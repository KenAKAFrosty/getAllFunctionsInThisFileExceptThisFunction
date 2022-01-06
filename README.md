# The logic:

1) Let's take the file this function is in, and first read it as text, just like any other file we would read as plain text
2) We'll use esprima to parse that text into a valid tree, part of which will contain our functions
3) We'll filter out that tree to only contain functions (except for this function we're using to do this! We're not after it)
4) For that, we'll need to grab the easy function declarations
5) But ideally we can also grab any functions that were declared as variables with arrow expressions, which will take a little more work but is very doable.
6) Next we want to reconstruct these objects from the tree back into actual usable functions in the code, so for all of our functions:
7) Use escodegen to reconstruct that object into a string that looks just like written code for that function
8) Convert that string into a usable function within the script itself again


The end result will spit back out an object with the key:value pairs where the key is the string of the function's name, and the value is the function itself.