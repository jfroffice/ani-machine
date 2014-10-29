AniMachine
==========

Declarative animation and machine state build

No Dependencies
---------------
10,4 Kb minified

Optional Dependencies
---------------------
- Animate.css (optional)
- CSShake.css (optional)

Credits & Inspirations
----------------------
[scrollReveal](https://github.com/julianlloyd/scrollReveal.js)
[animate.css](http://daneden.github.io/animate.css/)
[csshake](http://elrumordelaluz.github.io/csshake/)

How to start 
------------

Add JS dependency
```
<script src="https://raw.githubusercontent.com/jfroffice/ani-machine/master/dist/ani-machine.min.js"></script>
```

Enter Animation
---------------

Add __data-am__ on DOM element to animate
```
<div data-am=":enter left move 500px over 1.0s">HelloWorld</div>
```

State
-----

by default you can declare a __default__ state like this
```
<div class="element" am-element>
	<am-state value="default">
		<am-event on="enter" animate="pulse"></am-event>
		<am-event on="leave" animate="tada"></am-event>
	</am-state>
</div>
```

inside you declare you would like to bind and special animation you would like to trigger on events

(Here is animation from animate.css)

Trigger Event
--------------

State can be change from a trigger
```
<am-state value="triggered" trigger=".btn click">
	<am-event on="enter" animate="bounce"></am-event>
</am-state>
```

In this case, when user click on element selector by class ".btn" element will is state defined by value

Autostart
---------

You can play animation on state activation using keyword __active__

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