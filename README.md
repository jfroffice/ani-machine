AniMachine
==========

Declarative animation and machine state build

Optional Dependencies
---------------------
- [animate.css](http://daneden.github.io/animate.css/)
- [csshake](http://elrumordelaluz.github.io/csshake/)

How to start 
------------ 
import JS dependency
```
<script src="https://raw.githubusercontent.com/jfroffice/ani-machine/master/dist/ani-machine.min.js"></script>
```

When you DOM is ready, execute
```
<script>am.start();</script>
```

Enter Animation
---------------

Add __data-am__ attribute on DOM element with __":enter"__ special keyword to animate it
```
<div data-am=":enter left move 500px over 1.0s">HelloWorld</div>
```

State
-----
__default state__ can be declare like this
```
<div class="element" 
	data-am=":on enter :animate pulse
			 :on leave :animate tada">
</div>
```
If you want to declare a __next state__
```
<div class="element" 
	data-am=""
 	data-am-next=":on enter :animate pulse
			 	  :on leave :animate tada">
</div>
```

How to change state ?
---------------------
You need to use __":go"__ keyword to change state when animation played is finished
```
<div class="element" 
	data-am=":enter left move 500px :go next"
	data-am-next=":on enter :animate pulse
				  :on leave :animate tada">
</div>
```

How to launch CSS Animation
---------------------------
Add __":animate"__ followde by animation CSS class name

```
<div class="element" 
	data-am=":animate tada">
</div>
```

To chain CSS animation 
```
<div class="element" 
	data-am=":animate tada pulse">
</div>
```

How to launch CSShake Animation
---------------------------
Add __":shake"__ follow shake animation you wna tot apply
```
<div class="element" 
	data-am=":shake slow">
</div>
```

How to trigger animation
------------------------
Use __":trigger"__ keyword
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

By default, all DOM element with __data-am__ attribute will be in __default__ state

Reveal Animation
----------------

Special state name are use to specify what animation you would like to play when entering or leaving the viewport.

This might happend when user scroll or resize browser window.

You can trigger animation with state __enter__
```
<div class="element" 
	data-am-enter=":enter left move 500px">
</div>
```

or state __leave__
```
<div class="element" 
	data-am-leave=":animate bounceOutRight">
</div>
```

Before and After Callbacks
--------------------------

You can bind __before__ and __after__ callback animation event.
```
<script>
function beforeFn() {
	console('before callback');
}
function afterFn() {
	console('after callback');
}
</script>
```

```
<div class="element" 
	data-am-enter=":before beforeFn() :enter left move 500px :after afterFn()">
</div>
```