AniMachine
==========
Declarative Animation and Simple Machine State.
- 4.5KB minified and Gzipped

### [→ Demo ←](http://jfroffice.github.io/ani-machine/)

Optional Dependencies
---------------------
- [animate.css](http://daneden.github.io/animate.css/)
- [csshake](http://elrumordelaluz.github.io/csshake/)

How to start 
------------ 
Add JS dependency
```html
<script src="../ani-machine.min.js"></script>
```

At the end of DOM
```html
<script>am.start();</script>
```

Enter Animation
---------------
![enter!](https://github.com/jfroffice/ani-machine/raw/master/tuts/enter.gif)

Add __data-am__ attribute on DOM element with __":enter"__ special keyword
```html
<div data-am=":enter left move 500px over 1.0s">HelloWorld</div>
```

State
-----
![state](https://github.com/jfroffice/ani-machine/raw/master/tuts/state.gif)

__default__ state is declare with __data-am__
```html
<div class="element" 
	data-am=":on enter :animate pulse
			 :on leave :animate tada">
</div>
```
_Here we define animation on mouseenter and mouseleave_

If you want to declare a __next__ state
```html
<div class="element" 
	data-am=""
 	data-am-next=":on enter :animate bounce">
</div>
```

How to change state ?
---------------------
![changestate!](https://github.com/jfroffice/ani-machine/raw/master/tuts/changestate.gif)

You need to use __":go"__ keyword followed by state name to change state when played animation is finished
```html
<div class="element" 
	data-am=":enter left move 500px :go next"
	data-am-next=":on enter :animate pulse
				  :on leave :animate tada">
</div>
```

How to launch CSS Animation ?
---------------------------
Add __":animate"__ keyword followed by animation CSS class name
```html
<div class="element" 
	data-am=":animate tada">
</div>
```
Here we use [animate.css](http://daneden.github.io/animate.css/) class name, but it might be another css class

To chain CSS animation 
```html
<div class="element" 
	data-am=":animate tada pulse">
</div>
```

How to launch CSShake Animation ?
---------------------------
![shake!](https://github.com/jfroffice/ani-machine/raw/master/tuts/shake.gif)

Add __":shake"__ followed by [csshake](http://elrumordelaluz.github.io/csshake/) animation name you want to apply
```html
<div class="element" 
	data-am=":shake slow">
</div>
```

How to trigger animation ?
------------------------
![trigger!](https://github.com/jfroffice/ani-machine/raw/master/tuts/trigger.gif)

Use __":trigger"__ keyword
```html
<div class="element" 
	data-am-special=":animate bounce
					 :trigger .btn--trigger click">
</div>
<div class=".btn--trigger"></div>
```
You can use default event 
- click (click 	    event)
- enter (mouseenter event)
- leave (mouseleave event)
- ...

Autostart
---------
By default, all DOM element with __data-am__ attribute will be in __default__ state

Reveal Animation
----------------

Special state name are use to specify animations you want to play when element is entering or leaving the viewport.

You can trigger animation with state __enter__
```html
<div class="element" 
	data-am-enter=":enter left move 500px">
</div>
```
or state __leave__
```html
<div class="element" 
	data-am-leave=":animate bounceOutRight">
</div>
```

Before and After Callbacks
--------------------------

You can bind __":before"__ or __":after"__ callback animation event
```html
<div class="element" 
	data-am-enter=":before beforeFn() :enter left move 500px :after afterFn()">
</div>
```

```html
<script>
function beforeFn() {
	console('before callback');
}
function afterFn() {
	console('after callback');
}
</script>
```

How to add a pause ?
------------------
You can use __":wait"__ to make a pause before running animation or after
```html
<div class="element" 
	data-am-enter=":wait 0.2s :animate pulse">
</div>
```

Release History
---------------
- v0.1.9: 
	add :wait operator
	add element as first parameter in before and after callbacks
	remove some old browser compatibility codes
- v0.1.8: remove all dependencies
- v0.1.7: initial revision working with AngularJS

Browser Support
---------------
IE10+
Chrome4+
FF5+
Opera12+

License
-------
Copyright (c) 2014 John Fischer
Licensed under the MIT license.
