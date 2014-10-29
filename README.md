AniMachine
==========

Declarative animation and machine state build (11 KB minified)

Optional Dependencies
---------------------
- [animate.css](http://daneden.github.io/animate.css/)
- [csshake](http://elrumordelaluz.github.io/csshake/)

How to start 
------------
Add JS dependency
```
<script src="https://raw.githubusercontent.com/jfroffice/ani-machine/master/dist/ani-machine.min.js"></script>
```

Enter Animation
---------------

Add __data-am__ attribute on DOM element to animate it
```
<div data-am=":enter left move 500px over 1.0s">HelloWorld</div>
```
using __:enter__ keyword

State
-----
__default__ state can be declare like this
```
<div class="element" 
	data-am=":on enter :animate pulse
			 :on leave :animate tada">
</div>
```
If you want to declare another state called __next__
```
<div class="element" 
	data-am=""
 	data-am-next=":on enter :animate pulse
			 	  :on leave :animate tada">
</div>
```

How to change state ?
---------------------
You need to add __:go__ keyword to change state when animation play and is finished
```
<div class="element" 
	data-am=":enter left move 500px :go next"
	data-am-next=":on enter :animate pulse
				  :on leave :animate tada">
</div>
```

How to launch CSS Animation
---------------------------
Add __:animate__ to follow be animation css class name

```
<div class="element" 
	data-am=":animate tada">
</div>
```

To chain css animation 
```
<div class="element" 
	data-am=":animate tada pulse flash">
</div>
```

How to trigger animation
------------------------
Use __:trigger__ keyword
```
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

By default, element with __data-am__ attribute will be in __default__ state

Reveal Animation
----------------

Special state name are use to specify what animation you would like to play when entering or leaving the viewport.

This might happend when user scroll or resize browser window.

You can trigger animation with state __enter__
```
<am-state value="enter">
	<am-event on="active" animate="bounceInLeft"></am-event>
</am-state>
```

or state __leave__
```
<am-state value="leave">
	<am-event on="active" animate="bounceOutRight"></am-event>
</am-state>
```

Chaining
--------

You can chain animation using separate animate class name.

```
<am-state value="special" trigger=".trigger click">
	<am-event on="enter" animate="bounce rollOut"></am-event>
</am-state>
```

Or you chain animation by current __state__ using special word __goto__ 

```
<am-state value="default" trigger=".trigger click">
	<am-event on="enter" animate="bounce"></am-event>
	<am-event on="leave" goto="chain"></am-event>
</am-state>
<am-state value="chain">
	<am-event on="active" animate="rollOut"></am-event>
</am-state>
```

in the second case, trigger event will be unregistered which might be useful

Before and After Animation
--------------------------

You can bind callback before and after animation event.

```
<am-state value="enter">
	<am-event on="active" before="show()" animate="bounceOutRight" after="hide()"></am-event>
</am-state>
```



Credits & Inspirations
----------------------
- [scrollReveal](https://github.com/julianlloyd/scrollReveal.js)
- [animate.css](http://daneden.github.io/animate.css/)
- [csshake](http://elrumordelaluz.github.io/csshake/)