# JQuery.Arrange

## demo:
Check out [`index.html`](https://github.com/alex-georgiou/JQuery.Arrange/blob/master/index.html index.html) to see it in action

## usage:
run on a container to arrange its children in random positions within the container 
e.g. `$('#container').arrange();`
 
## optional parameters:
- `avoid`: selector of elements that are to be avoided, but that should not be arranged themselves
- `arrange`: selector of elements that are to be arranged
- `bailout`: how many tries to compute per element before giving up arrangement
- `slack`: minimum pixel distance between elements
