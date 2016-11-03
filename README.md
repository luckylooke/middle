# middle.js
a micro-library for quick implementation of "middleware" support into any project.
By "middleware" I mean something between Express.js middleware pattern and event handling in javascript.

This tool will help you implement [open/closed](https://en.wikipedia.org/wiki/Open/closed_principle) principle from [SOLID](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design))

By micro-library I mean really micro, it has only 1.6kB minified. 

## Install

You have several options to install middle.js

1. Download built files from github:
```
https://github.com/luckylooke/middle/tree/master/dist
```

2. Clone via git:
```
git clone https://github.com/luckylooke/middle.git
```

3. Install via npm:
```
npm install middle.js
```

3. Install via bower:
```
bower install middle.js
```

## Usage

Let say you want users of your library/system/... to be able to use middleware on your public methods. For example imagine you have super cool message library with method send(consignee, message).

```js
mySuperMsgLib.send('Superman', 'I love you, Lois Lane');
```

Superman get message 'I love you, Lois Lane'. Lib user enhance this by adding footer like this

```js
mySuperMsgLib.send.use(function addFooter(next, consignee, message){
    message += '<br>send by Daily Planet message system.'; // enahancing message
    next(consignee, message); // passing data to next middleware or at last to ending method
});
```

Now when you send again the message

```js
mySuperMsgLib.send('Superman', 'I really love you, Lois Lane');
```

Superman get message 'I really love you, Lois Lane<br>send by Daily Planet message system.'.
To add this functionality to your method for one instace of class, you need to do this:

```js
var mySuperMsgLib = new MySuperMsgLib();
mySuperMsgLib.send = new Middle(MySuperMsgLib.prototype.send, mySuperMsgLib);
```

For all instances, apply on prototype:

```js
MySuperMsgLib.prototype.send = new Middle(function(){
    // send implementation
});
```


### TODO:
- Finish tests migration
- Docs
- plugin for middlewares order management (use.first(fn), use.last(fn), use.at(index, fn))
- plugin for middlewares on fn return